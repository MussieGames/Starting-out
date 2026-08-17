# Deploy premium CTA to Flourish

Updated waitlist landing page with warmer, more premium visuals.

## What changed
- Hero emoji cards → photographic hero visual
- Feature emoji icons → real photo stills
- Removed “Early testers” fake testimonials
- Added **Kept close** story section
- Removed “Founder pricing” perk
- Waitlist still writes to Firestore (unchanged)

## Copy into Flourish (CMD)

```bat
cd C:\Users\opals\Starting-out
git checkout cursor/flourish-resend-waitlist-email-ce4c
git pull

cd C:\Users\opals\Flourish
git checkout main
git pull

copy /Y C:\Users\opals\Starting-out\website\index.html index.html
copy /Y C:\Users\opals\Starting-out\website\firestore.rules firestore.rules

mkdir assets
xcopy /E /I /Y C:\Users\opals\Starting-out\website\assets assets

git add index.html firestore.rules assets
git commit -m "Premium CTA: photo-led visuals, replace testimonials"
git push origin main
```

## Test
1. Hard refresh https://www.goflourish.com.au (`Ctrl+F5`)
2. Confirm hero photo + no emoji cards
3. Confirm “Kept close” section (no Early testers)
4. Submit waitlist once — still saves + emails

Firestore rules only need redeploy if you changed them; this pass is mainly `index.html` + `assets/`.
