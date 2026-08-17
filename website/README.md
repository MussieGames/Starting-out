# Deploy CTA → Firestore waitlist (no reCAPTCHA)

The live site lives in **MussieGames/Flourish** (GitHub Pages). This folder has the updated files ready to copy there.

## What changed
- Hero + CTA forms write to Firestore `waitlist` (same path as your successful manual test)
- reCAPTCHA + `addWaitlistEmail` removed from the page
- Firestore rules allow **create-only** on `waitlist` (no public read/update)
- `sendWaitlistConfirmation` still sends the Resend email

## On your PC — update the Flourish site repo

```bat
cd C:\Users\opals
git clone https://github.com/MussieGames/Flourish.git
cd Flourish
```

If you already have it:

```bat
cd C:\Users\opals\Flourish
git checkout main
git pull
```

Copy these two files from Starting-out into Flourish (overwrite):

- `Starting-out\website\index.html` → `Flourish\index.html`
- `Starting-out\website\firestore.rules` → `Flourish\firestore.rules`

Then:

```bat
cd C:\Users\opals\Flourish
git add index.html firestore.rules
git commit -m "Point CTA waitlist to Firestore; allow public creates"
git push origin main
```

Pushing `firestore.rules` to `main` triggers the Flourish GitHub Action to deploy rules.

Also deploy rules yourself to be sure:

```bat
cd C:\Users\opals\Flourish
npx firebase deploy --only firestore:rules --project flourish-7b8c8
```

(Use the same Firebase login as before.)

## Test
1. Open https://www.goflourish.com.au (hard refresh: Ctrl+F5)
2. Submit a real email on the CTA
3. Check Firestore `waitlist` for a new doc
4. Check inbox for confirmation

reCAPTCHA can be reintroduced later when traffic picks up.
