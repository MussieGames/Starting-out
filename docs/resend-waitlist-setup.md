# Flourish waitlist emails — Resend + Firebase (Option A)

Confirmation emails for the CTA (“Get Early Access” / “Reserve My Spot”) using **Resend** and one **2nd-gen Cloud Function**. This replaces the Firebase Trigger Email extension (and avoids the SendGrid SMTP footguns).

## What you get

| Piece | Role |
|---|---|
| `functions/src/index.ts` | Fires on `waitlist/{id}` create → sends confirmation |
| `functions/src/email-templates.ts` | Brand-aligned HTML + text email |
| `firestore.rules` | Public can *create* waitlist docs only; cannot read the list |
| Resend | Delivers the email (API, not SMTP) |

## What’s involved (checklist)

### You do once (accounts / DNS) — ~20–40 min

1. **Resend account** — [resend.com](https://resend.com) → create account → create API key (Sending access).
2. **Verify a sending domain** (strongly recommended: subdomain)
   - In Resend: add `mail.goflourish.com.au` (or similar)
   - Copy DKIM / SPF / MX records into your DNS host
   - Wait until status is **Verified** (often &lt; 15 min)
3. **Firebase project on Blaze** — Cloud Functions need Blaze to call Resend’s API.
4. **Firebase CLI logged in**
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use flourish-7b8c8
   ```
   `.firebaserc` in this repo is already set to `flourish-7b8c8`.

### Wire secrets & config — ~5 min

```bash
cd functions && npm install && cd ..

# Store the Resend key in Secret Manager (never commit it)
firebase functions:secrets:set RESEND_API_KEY
# paste the key when prompted

# Optional: override from / reply-to (must match verified Resend domain)
firebase functions:config:set   # not used — we use params below at deploy time
```

At deploy / first run, set params if you don’t want the defaults:

```bash
firebase deploy --only functions \
  --force
```

Defaults in code:

- `WAITLIST_FROM_EMAIL` = `Flourish <hello@mail.goflourish.com.au>`
- `WAITLIST_REPLY_TO` = `hello@goflourish.com.au`

Change those strings in `functions/src/index.ts` (or pass params) to match your verified Resend domain.

### Deploy — ~5 min

```bash
firebase deploy --only functions,firestore:rules
```

### Point the CTA form at Firestore

On signup success, create a document like:

```js
await addDoc(collection(db, "waitlist"), {
  email: userEmail,
  name: optionalName,          // optional
  source: "cta-hero",          // or "cta-footer"
  createdAt: serverTimestamp(),
});
```

The function sends the email automatically. It writes back:

- `confirmationSentAt` + `confirmationMessageId` on success  
- `confirmationError` on failure (and retries)

### Test safely

1. In Resend, you can send test mail to **your own** address before domain verify (using Resend’s onboarding sender for tests only).
2. After domain verify, create a waitlist doc from the Firebase console or a test form submit.
3. Check:
   - Firebase → Functions → Logs
   - Resend → Emails
   - Inbox (+ spam once, while warming)

## Why this should work where SendGrid + Firebase failed

| Old pain | This setup |
|---|---|
| SMTP URI / Trigger Email extension | Resend **API** only |
| Unverified sender drops | Explicit domain verify step |
| Opaque extension config | Your function + logs you control |
| Extension sunset (Mar 2027) | Self-managed 2nd-gen function |

## Costs (early stage)

- Resend: free tier is enough for waitlist volume
- Firebase: Blaze pay-as-you-go; waitlist traffic is tiny
- You only pay when emails actually send / functions run

## Optional next steps

- Launch announcement to the same `waitlist` collection later (separate function or Resend broadcast)
- Unsubscribe handling (add `List-Unsubscribe` when you send campaigns)
- Move CTA site to write via a thin HTTPS function if you want server-side validation / rate limits

## Troubleshooting

| Symptom | Check |
|---|---|
| Function never runs | Blaze enabled? Doc path exactly `waitlist/{id}`? Deployed region? |
| Resend 403 / domain error | From-address domain verified in Resend? |
| No email, no error in logs | Confirm the Firestore create succeeded; check security rules |
| Lands in spam | Domain auth + prefer `mail.` subdomain; avoid `noreply@gmail.com`-style from |
| Duplicate emails | Function is idempotent via `confirmationSentAt` — don’t delete that field |

## Files

```
functions/
  package.json
  tsconfig.json
  src/
    index.ts
    email-templates.ts
firebase.json
firestore.rules
.firebaserc.example
docs/resend-waitlist-setup.md   ← this file
```
