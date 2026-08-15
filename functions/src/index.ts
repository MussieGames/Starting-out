import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { waitlistConfirmationHtml, waitlistConfirmationText } from "./email-templates";

// Keep module init light — heavy imports (e.g. Resend) load inside the handler
// so Firebase deploy discovery does not time out on Windows.
if (getApps().length === 0) {
  initializeApp();
}

const resendApiKey = defineSecret("RESEND_API_KEY");
const fromEmail = defineString("WAITLIST_FROM_EMAIL", {
  default: "Flourish <hello@mail.goflourish.com.au>",
  description: "Verified Resend from address (use a mail subdomain)",
});
const replyToEmail = defineString("WAITLIST_REPLY_TO", {
  default: "hello@goflourish.com.au",
  description: "Where parent replies should land",
});

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Sends the Flourish waitlist confirmation when a new doc is created in `waitlist`.
 *
 * Expected document shape:
 * {
 *   email: string;          // required
 *   name?: string;          // optional first name
 *   source?: string;        // e.g. "cta-hero" | "cta-footer"
 *   createdAt?: Timestamp;  // set by client or server
 * }
 */
export const sendWaitlistConfirmation = onDocumentCreated(
  {
    document: "waitlist/{signupId}",
    secrets: [resendApiKey],
    region: "australia-southeast1",
    retry: true,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No snapshot on waitlist create", { signupId: event.params.signupId });
      return;
    }

    const raw = snapshot.data() as Record<string, unknown>;
    const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
    const name = typeof raw.name === "string" ? raw.name.trim() : undefined;
    const source = typeof raw.source === "string" ? raw.source : "unknown";

    if (!isValidEmail(email)) {
      logger.error("Invalid waitlist document", { signupId: event.params.signupId });
      await snapshot.ref.set(
        {
          confirmationError: "invalid_document",
          confirmationUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return;
    }

    if (raw.confirmationSentAt) {
      logger.info("Confirmation already sent — skipping", {
        signupId: event.params.signupId,
      });
      return;
    }

    // Lazy-load Resend only when sending (avoids deploy discovery timeout)
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey.value());

    try {
      const result = await resend.emails.send({
        from: fromEmail.value(),
        to: email,
        replyTo: replyToEmail.value(),
        subject: "You're on the Flourish list — Every First, Forever",
        html: waitlistConfirmationHtml({ name }),
        text: waitlistConfirmationText({ name }),
        tags: [
          { name: "type", value: "waitlist_confirmation" },
          { name: "source", value: source },
        ],
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      await snapshot.ref.set(
        {
          confirmationSentAt: FieldValue.serverTimestamp(),
          confirmationMessageId: result.data?.id ?? null,
          confirmationError: FieldValue.delete(),
          confirmationUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      logger.info("Waitlist confirmation sent", {
        signupId: event.params.signupId,
        messageId: result.data?.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      logger.error("Failed to send waitlist confirmation", {
        signupId: event.params.signupId,
        message,
      });

      await snapshot.ref.set(
        {
          confirmationError: message,
          confirmationUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      throw error;
    }
  },
);
