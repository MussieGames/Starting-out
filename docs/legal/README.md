# Flourish legal documents — notes for the owner

**Important:** These documents are drafted for Flourish as an **Australian sole trader** business (ABN, not a company). They are written to align with current Australian guidance (Privacy Act / APPs, ACL, Spam Act) and Flourish’s product positioning. They are **not a substitute for legal advice**. Have an Australian solicitor review them before launch, especially once paid subscriptions and children’s photos go live.

**Last reviewed against public guidance:** August 2026.

---

## Fill these placeholders before publishing

| Placeholder | Where | What to put |
|---|---|---|
| `[ABN XX XXX XXX XXX]` | Privacy + Terms | Your 11-digit ABN |
| `[Full legal name]` | Privacy + Terms | Your personal legal name as sole trader (e.g. Shamus Maloney) |
| `[Postal address, State, Postcode]` | Privacy + Terms | A contactable Australian postal address (PO Box is fine) |
| `[State/Territory]` | Terms | Governing law (recommend where you live/operate, e.g. Victoria) |

Until placeholders are replaced, do **not** treat the pages as final.

---

## Why a full Privacy Policy even as a sole trader

Under the *Privacy Act 1988* (Cth), many small businesses with annual turnover of **$3 million or less** are exempt — **unless** an exception applies (e.g. health service provider, trading in personal information, AML reporting entity, Commonwealth contractor, or voluntary opt-in). See OAIC: [Small business](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business).

Flourish is privacy-first and will handle:

- parent/guardian contact details
- children’s photos, videos, voice memos and journals
- developmental “firsts” / milestone information

That combination is high-sensitivity. Best practice (and brand consistency) is to **voluntarily follow the Australian Privacy Principles (APPs)** now, even if the small-business exemption currently applies. OAIC encourages opting in. Reforms to remove the small-business exemption have been signalled for a later tranche — preparing now avoids a scramble later.

The draft **Children’s Online Privacy Code 2026** (exposure draft) expressly contemplates services such as **family photo sharing** and **early childhood development tracking**. Flourish should design for parent-controlled accounts and child-data minimisation from day one.

---

## Documents produced

| File | Purpose |
|---|---|
| `website/privacy.html` | Public Privacy Policy (site-ready) |
| `website/terms.html` | Public Website & Waitlist Terms (site-ready) |
| `docs/legal/Privacy-Policy.md` | Markdown source |
| `docs/legal/Terms-of-Use.md` | Markdown source |

Footer links on `website/index.html` point to `/privacy.html` and `/terms.html`.

---

## Overseas processing (disclose accurately)

Even with Australian hosting preferences, common vendors may process data outside Australia:

| Vendor | Likely role | Likely locations to disclose |
|---|---|---|
| Google Firebase / Google Cloud | Auth, Firestore, Functions, Storage | Primarily `australia-southeast1`; Google may also process in other regions including the United States |
| Resend | Transactional email | United States (and any other Resend processing locations in their DPA) |
| Cloudflare (if used for DNS/CDN) | Edge delivery | Global edge network |

APP 1 requires saying **whether** overseas disclosure is likely and, if practicable, **which countries**. The Privacy Policy drafts this accordingly. Update if vendors change.

---

## Australian Consumer Law (Terms)

Website terms are usually **standard form consumer contracts**. Avoid:

- “no refunds” that override ACL consumer guarantees
- one-sided change / terminate rights without notice
- broad exclusions of liability for negligence where ACL prohibits it

The Terms preserve ACL rights expressly.

---

## Spam Act 2003 (waitlist)

Commercial electronic messages to Australians need:

1. consent (express via waitlist signup)
2. accurate sender identification
3. a functional unsubscribe

The Privacy Policy and Terms cover waitlist email use. Keep Resend unsubscribe / reply handling working.

---

## Suggested next legal steps (owner)

1. Insert ABN, legal name, postal address, governing State.
2. Solicitor review (especially children’s data + future paid plans).
3. Decide whether to **formally opt in** to the Privacy Act (OAIC process) for trust/signalling.
4. Before app launch: collection notices at signup, parental consent flows, retention schedule, data-breach playbook.
5. When Bloom/Heirloom pricing goes live: add Subscription Terms (billing, cancel, cooling-off where applicable).
