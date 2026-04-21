import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? "InstaTrack <onboarding@resend.dev>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";


function wrapEmail(content: string, previewText: string = ""): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #ffffff;
    }

    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #050505;
      padding-bottom: 40px;
    }

    .main {
      background-color: #0a0a0a;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      border: 1px solid #1a1a1a;
      border-radius: 16px;
      overflow: hidden;
      margin-top: 40px;
    }

    .header {
      padding: 40px 30px;
      text-align: left;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #6366f1;
      letter-spacing: -0.5px;
      text-decoration: none;
    }

    .content {
      padding: 0 30px 40px 30px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    p {
      font-size: 16px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 24px 0;
    }

    .card {
      background-color: #111111;
      border: 1px solid #222222;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }

    .btn {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff !important;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }

    .footer {
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #475569;
    }

    .unfollower-item {
      padding: 16px 0;
      border-bottom: 1px solid #1a1a1a;
    }

    .unfollower-name {
      color: #f8fafc;
      font-weight: 600;
      font-size: 16px;
    }

    .unfollower-link {
      color: #6366f1;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }

    @media screen and (max-width: 600px) {
      .main {
        border-radius: 0;
        margin-top: 0;
        border: none;
      }
      .header, .content {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}</div>` : ''}
  <div class="wrapper">
    <table class="main">
      <tr>
        <td class="header">
          <a href="${BASE_URL}" class="logo">InstaTrack</a>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="font-size: 12px; margin-bottom: 8px;">
            Tracking @{{instaUsername}} • 8:00 AM IST Reports
          </p>
          <a href="${BASE_URL}/unsubscribe" style="color: #475569; text-decoration: underline;">Unsubscribe</a>
          <p style="margin-top: 16px;">© ${new Date().getFullYear()} InstaTrack. Not affiliated with Instagram.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome Email Template
 */
export async function sendWelcomeEmail(to: string, instaUsername: string): Promise<void> {
  const content = `
    <h1>You're all set, @${instaUsername}! 🎉</h1>
    <p>We've successfully created your baseline snapshot. From now on, we'll monitor your followers daily.</p>
    
    <div class="card">
      <p style="color: #ffffff; font-weight: 600; margin-bottom: 8px;">What to expect:</p>
      <ul style="color: #94a3b8; padding-left: 20px; margin: 0;">
        <li style="margin-bottom: 8px;">Daily checks at 8:00 AM IST.</li>
        <li style="margin-bottom: 8px;">Instant notification if someone unfollows.</li>
        <li style="margin-bottom: 0;">Direct links to visit their profiles.</li>
      </ul>
    </div>

    <p>Your first report will arrive tomorrow morning.</p>
    <a href="https://instagram.com/${instaUsername}" class="btn">View My Profile</a>
  `;

  const finalHtml = wrapEmail(content, "Welcome to InstaTrack!")
    .replace(/{{instaUsername}}/g, instaUsername);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `✅ Tracking active for @${instaUsername}`,
    html: finalHtml,
  });

  if (error) throw new Error(`[Mailer] Error: ${error.message}`);
}

/**
 * Daily Unfollower Report
 */
export async function sendUnfollowerReport(
  to: string,
  instaUsername: string,
  unfollowers: string[],
): Promise<void> {
  const hasUnfollowers = unfollowers.length > 0;
  
  let content: string;
  if (hasUnfollowers) {
    const list = unfollowers.map(u => `
      <div class="unfollower-item">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="unfollower-name">@${u}</td>
            <td align="right">
              <a href="https://instagram.com/${u}" class="unfollower-link">View Profile →</a>
            </td>
          </tr>
        </table>
      </div>
    `).join("");

    content = `
      <h1>${unfollowers.length} people unfollowed you 👀</h1>
      <p>Here are the accounts that left your list in the last 24 hours:</p>
      <div class="card">
        ${list}
      </div>
      <p>Click any name to visit their profile and see what's up.</p>
    `;
  } else {
    content = `
      <h1>All good today! ✅</h1>
      <p>Nobody unfollowed you in the last 24 hours. Your circle is holding strong.</p>
      <div class="card" style="text-align: center; padding: 40px 20px;">
        <span style="font-size: 48px;">🎯</span>
        <p style="margin-top: 16px; color: #ffffff;">Keep posting great content!</p>
      </div>
    `;
  }

  const finalHtml = wrapEmail(content, hasUnfollowers ? "New unfollowers detected." : "All good!")
    .replace(/{{instaUsername}}/g, instaUsername);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: hasUnfollowers 
      ? `👀 ${unfollowers.length} people unfollowed you` 
      : `✅ No unfollowers today for @${instaUsername}`,
    html: finalHtml,
  });

  if (error) throw new Error(`[Mailer] Error: ${error.message}`);
}

/**
 * Account Error Email (e.g. Private Account)
 */
export async function sendAccountErrorEmail(to: string, instaUsername: string, reason: string): Promise<void> {
  const content = `
    <h1 style="color: #f87171;">Tracking paused ⚠️</h1>
    <p>We hit a snag while checking <strong>@${instaUsername}</strong>.</p>
    
    <div class="card" style="border-left: 4px solid #f87171;">
      <p style="color: #ffffff; margin-bottom: 4px;">Reason:</p>
      <p style="color: #f87171; font-family: monospace;">${reason}</p>
    </div>

    <p>This usually happens if your account was set to private or deactivated. To resume tracking, please make your account public and sign up again.</p>
    <a href="${BASE_URL}" class="btn">Resume Tracking</a>
  `;

  const finalHtml = wrapEmail(content, "Action required for your account.")
    .replace(/{{instaUsername}}/g, instaUsername);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `⚠️ Action required for @${instaUsername}`,
    html: finalHtml,
  });

  if (error) throw new Error(`[Mailer] Error: ${error.message}`);
}

/**
 * Unsubscribe Confirmation
 */
export async function sendUnsubscribeEmail(to: string, instaUsername: string): Promise<void> {
  const content = `
    <h1>Goodbye, @${instaUsername} 👋</h1>
    <p>We've stopped tracking your followers and your historical data has been queued for deletion.</p>
    <p>If this was a mistake, you can always come back and sign up again anytime.</p>
    <a href="${BASE_URL}" class="btn">Sign Up Again</a>
  `;

  const finalHtml = wrapEmail(content, "You've been unsubscribed.")
    .replace(/{{instaUsername}}/g, instaUsername);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `👋 Unsubscribed from InstaTrack`,
    html: finalHtml,
  });

  if (error) throw new Error(`[Mailer] Error: ${error.message}`);
}