type TemplateInput = {
  name?: string;
};

function greeting({ name }: TemplateInput): string {
  const trimmed = name?.trim();
  return trimmed ? `Hi ${escapeHtml(trimmed)},` : "Hi there,";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Warm, brand-aligned confirmation for CTA early-access signups.
 * Plain HTML (no React Email) so Cloud Functions stay light.
 */
export function waitlistConfirmationHtml({ name }: TemplateInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're on the Flourish list</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,'Times New Roman',serif;color:#1c2420;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(28,36,32,0.08);">
          <tr>
            <td style="background:#2f5d4a;padding:28px 32px;color:#f4f7f5;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.8;">Flourish</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:normal;">Every First, Forever.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:17px;line-height:1.55;">${greeting({ name })}</p>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.55;">
                You're on the Flourish early access list. Thank you — that means a lot.
              </p>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.55;">
                We're building a private, beautiful scrapbook for your child's earliest moments.
                No ads. No algorithms. No AI training on your family's photos.
              </p>
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#2f5d4a;font-weight:bold;">
                As an early access member
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:16px;line-height:1.6;color:#3d4a43;">
                <li>3 months of Bloom, free</li>
                <li>First access to printed keepsake books</li>
                <li>Founder pricing, locked in</li>
              </ul>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.55;">
                We'll send a gentle note when it's time to join — no spam, ever.
              </p>
              <p style="margin:0;font-size:17px;line-height:1.55;">
                With care,<br />
                <strong>Shamus</strong><br />
                <span style="color:#5c6b63;">Founder, Flourish</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(28,36,32,0.08);font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#5c6b63;">
              You signed up at
              <a href="https://www.goflourish.com.au" style="color:#2f5d4a;">goflourish.com.au</a>.
              If this wasn't you, you can ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function waitlistConfirmationText({ name }: TemplateInput): string {
  const hello = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";
  return `${hello}

You're on the Flourish early access list. Thank you — that means a lot.

We're building a private, beautiful scrapbook for your child's earliest moments.
No ads. No algorithms. No AI training on your family's photos.

As an early access member you'll get:
- 3 months of Bloom, free
- First access to printed keepsake books
- Founder pricing, locked in

We'll send a gentle note when it's time to join — no spam, ever.

With care,
Shamus
Founder, Flourish

https://www.goflourish.com.au
`;
}
