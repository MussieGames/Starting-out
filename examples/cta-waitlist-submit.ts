/**
 * Example CTA waitlist submit for the Flourish marketing site.
 * Adapt to your stack (vanilla JS, React, etc.).
 *
 * Prerequisites:
 * - Firebase web app config
 * - Firestore enabled
 * - firestore.rules deployed (public create on `waitlist` only)
 * - sendWaitlistConfirmation function deployed
 */
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function joinWaitlist({
  email,
  name,
  source = "cta-hero",
}: {
  email: string;
  name?: string;
  source?: string;
}) {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail.includes("@")) {
    throw new Error("Please enter a valid email.");
  }

  await addDoc(collection(db, "waitlist"), {
    email: trimmedEmail,
    ...(name?.trim() ? { name: name.trim() } : {}),
    source,
    createdAt: serverTimestamp(),
  });

  // Confirmation email is sent by Cloud Function — no client Resend key needed.
}
