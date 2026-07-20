import { initializeApp } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { Resend } from "resend";
import { z } from "zod";
import { waitlistConfirmationHtml, waitlistConfirmationText } from "./email-templates";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");
const fromEmail = defineString("WAITLIST_FROM_EMAIL", {
  default: "Flourish <hello@mail.goflourish.com.au>",
  description: "Verified Resend from address (use a mail subdomain)",
});
const replyToEmail = defineString("WAITLIST_REPLY_TO", {
  default: "hello@goflourish.com.au",
  description: "Where parent replies should land",
});

const waitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(120).optional(),
  source: z.string().optional(),
  confirmationSentAt: z.any().optional(),
  confirmationError: z.string().optional(),
});

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

    const raw = snapshot.data();
    const parsed = waitlistSchema.safeParse(raw);

    if (!parsed.success) {
      logger.error("Invalid waitlist document", {
        signupId: event.params.signupId,
        issues: parsed.error.flatten(),
      });
      await snapshot.ref.set(
        {
          confirmationError: "invalid_document",
          confirmationUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return;
    }

    if (parsed.data.confirmationSentAt) {
      logger.info("Confirmation already sent — skipping", {
        signupId: event.params.signupId,
      });
      return;
    }

    const { email, name } = parsed.data;
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
          { name: "source", value: parsed.data.source ?? "unknown" },
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

      // Re-throw so Functions retry policy can attempt again.
      throw error;
    }
  },
);
