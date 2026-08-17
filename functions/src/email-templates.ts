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
 * Warm confirmation for CTA early-access signups.
 * Colours/tone aligned with goflourish.com.au (cream, sienna, ink).
 * Plain HTML so Cloud Functions stay light.
 */
export function waitlistConfirmationHtml({ name }: TemplateInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're on the Flourish list</title>
</head>
<body style="margin:0;padding:0;background:#FBF7F2;font-family:Georgia,'Times New Roman',serif;color:#2C2420;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FBF7F2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FEFCF9;border:1px solid rgba(196,169,160,0.35);">
          <tr>
            <td style="background:#2C2420;padding:28px 32px;color:#FBF7F2;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C17B5C;">Flourish</p>
              <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:normal;font-style:italic;">Every First, Forever.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">${greeting({ name })}</p>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">
                You're on the Flourish early access list. Thank you — that means more than you know.
              </p>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">
                Flourish exists because childhood disappears quietly — into camera rolls, chat threads, and folders that never quite feel worthy of the love inside them. We're building a private scrapbook for those earliest moments: a warm, secure place to keep every first, without ads, without algorithms, and without your family's photos ever being sold or used to train AI.
              </p>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">
                Privacy isn't a feature for us. It's the promise — a space that respects how intimate new parenthood really is.
              </p>
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C17B5C;font-weight:bold;">
                As an early access member
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:16px;line-height:1.65;color:#5C4A42;">
                <li>3 months of Bloom, free</li>
                <li>First access to printed keepsake books</li>
              </ul>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">
                We'll send a gentle note when it's time to join — no spam, ever.
              </p>
              <p style="margin:0;font-size:17px;line-height:1.6;">
                With care,<br />
                <strong>Shamus</strong><br />
                <span style="color:#8C7870;">Founder, Flourish</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(196,169,160,0.35);font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#8C7870;">
              You signed up at
              <a href="https://www.goflourish.com.au" style="color:#C17B5C;">goflourish.com.au</a>.
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

You're on the Flourish early access list. Thank you — that means more than you know.

Flourish exists because childhood disappears quietly — into camera rolls, chat threads, and folders that never quite feel worthy of the love inside them. We're building a private scrapbook for those earliest moments: a warm, secure place to keep every first, without ads, without algorithms, and without your family's photos ever being sold or used to train AI.

Privacy isn't a feature for us. It's the promise — a space that respects how intimate new parenthood really is.

As an early access member you'll get:
- 3 months of Bloom, free
- First access to printed keepsake books

We'll send a gentle note when it's time to join — no spam, ever.

With care,
Shamus
Founder, Flourish

https://www.goflourish.com.au
`;
}
