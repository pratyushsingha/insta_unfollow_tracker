import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? "InstaTrack <onboarding@resend.dev>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function wrapEmail(content: string, previewText: string = ""): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>InstaTrack</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body, #bodyTable {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #0f0f13;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    img { border: 0; outline: none; text-decoration: none; }
    a { color: inherit; }

    .email-wrapper {
      width: 100%;
      background-color: #0f0f13;
      padding: 40px 16px;
    }

    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #16161e;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #2a2a3a;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    }

    /* Top accent bar */
    .accent-bar {
      height: 3px;
      background: linear-gradient(90deg, #6366f1 0%, #818cf8 40%, #a78bfa 70%, #6366f1 100%);
      background-size: 200% 100%;
    }

    /* Header */
    .header {
      padding: 40px 48px 36px;
      background: linear-gradient(160deg, #1a1a2e 0%, #16161e 60%);
      border-bottom: 1px solid #2a2a3a;
      position: relative;
    }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }

    .logo-mark {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .logo-text {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.3px;
    }

    .logo-text span { color: #818cf8; }

    .date-badge {
      font-size: 11px;
      font-weight: 500;
      color: #555570;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .header-title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.8px;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .header-subtitle {
      font-size: 14px;
      color: #7070a0;
      line-height: 1.5;
    }

    /* Body */
    .body {
      padding: 36px 48px;
    }

    /* Stats row */
    .stats-row {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
    }

    .stat-box {
      flex: 1;
      background: #1e1e2e;
      border: 1px solid #2a2a3a;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: #818cf8;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 11px;
      color: #555570;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Section label */
    .section-label {
      font-size: 11px;
      font-weight: 700;
      color: #555570;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }

    /* Unfollower list */
    .unfollower-list {
      list-style: none;
      margin-bottom: 24px;
    }

    .unfollower-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e1e2e;
      border: 1px solid #2a2a3a;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 8px;
      transition: border-color 0.2s;
    }

    .unfollower-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: #818cf8;
      flex-shrink: 0;
      border: 1px solid #3730a3;
      text-transform: uppercase;
    }

    .unfollower-name {
      font-weight: 600;
      color: #e0e0f0;
      font-size: 14px;
    }

    .unfollower-handle {
      font-size: 12px;
      color: #555570;
      margin-top: 1px;
    }

    .view-btn {
      display: inline-block;
      background: #1e1b4b;
      border: 1px solid #3730a3;
      color: #818cf8 !important;
      text-decoration: none !important;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      letter-spacing: 0.2px;
    }

    /* All good box */
    .all-good-box {
      background: linear-gradient(135deg, #0d1f0d, #0f2010);
      border: 1px solid #1a4a1a;
      border-radius: 16px;
      padding: 36px;
      text-align: center;
      margin-bottom: 24px;
    }

    .all-good-icon {
      font-size: 44px;
      margin-bottom: 16px;
      display: block;
    }

    .all-good-title {
      font-size: 20px;
      font-weight: 800;
      color: #4ade80;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .all-good-sub {
      font-size: 14px;
      color: #166534;
      line-height: 1.5;
    }

    /* Info box */
    .info-box {
      background: #1a1a28;
      border: 1px solid #2a2a3a;
      border-left: 3px solid #6366f1;
      border-radius: 0 10px 10px 0;
      padding: 14px 18px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #7070a0;
      line-height: 1.6;
    }

    /* CTA Button */
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      color: #ffffff !important;
      text-decoration: none !important;
      padding: 14px 32px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-align: center;
    }

    /* Divider */
    .divider {
      height: 1px;
      background: #2a2a3a;
      margin: 28px 0;
    }

    /* Footer */
    .footer {
      padding: 24px 48px 32px;
      border-top: 1px solid #2a2a3a;
      background: #13131a;
    }

    .footer-logo {
      font-size: 13px;
      font-weight: 800;
      color: #3a3a5a;
      letter-spacing: -0.3px;
      margin-bottom: 12px;
    }

    .footer-logo span { color: #4a4a7a; }

    .footer-text {
      font-size: 12px;
      color: #3a3a5a;
      line-height: 1.6;
    }

    .footer-links {
      margin-top: 12px;
      font-size: 12px;
    }

    .footer-links a {
      color: #4a4a7a !important;
      text-decoration: none !important;
    }

    .footer-links a:hover { color: #818cf8 !important; }

    .footer-dot {
      color: #2a2a3a;
      margin: 0 8px;
    }

    /* Welcome specific */
    .welcome-hero {
      text-align: center;
      padding: 8px 0 24px;
    }

    .welcome-icon {
      font-size: 52px;
      display: block;
      margin-bottom: 16px;
    }

    .step-list {
      list-style: none;
      margin-bottom: 24px;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #2a2a3a;
    }

    .step-item:last-child { border-bottom: none; }

    .step-num {
      width: 28px;
      height: 28px;
      background: #1e1b4b;
      border: 1px solid #3730a3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #818cf8;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .step-content {}
    .step-title { font-size: 14px; font-weight: 600; color: #e0e0f0; margin-bottom: 2px; }
    .step-desc { font-size: 13px; color: #555570; line-height: 1.5; }

    /* Error specific */
    .error-box {
      background: #1f0f0f;
      border: 1px solid #4a1a1a;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
    }

    .error-label {
      font-size: 11px;
      font-weight: 700;
      color: #7f1d1d;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .error-reason {
      font-size: 14px;
      color: #fca5a5;
      line-height: 1.6;
    }

    @media only screen and (max-width: 600px) {
      .header, .body, .footer { padding-left: 24px !important; padding-right: 24px !important; }
      .stats-row { flex-direction: column; }
      .header-title { font-size: 22px !important; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
  <div class="email-wrapper">
    <div class="email-container">
      <div class="accent-bar"></div>
      ${content}
      <div class="footer">
        <div class="footer-logo">Insta<span>Track</span></div>
        <p class="footer-text">
          You're receiving this because you signed up for daily follower tracking at InstaTrack.
        </p>
        <div class="footer-links">
          <a href="${BASE_URL}">Dashboard</a>
          <span class="footer-dot">·</span>
          <a href="${BASE_URL}/unsubscribe">Unsubscribe</a>
          <span class="footer-dot">·</span>
          <span style="color:#3a3a5a;">Not affiliated with Instagram or Meta</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getInitial(username: string): string {
  return (username?.[0] ?? '?').toUpperCase();
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function sendWelcomeEmail(
  to: string,
  instaUsername: string,
): Promise<void> {
  const content = `
    <div class="header">
      <div class="header-top">
        <div class="logo-mark">
          <div class="logo-icon">📊</div>
          <span class="logo-text">Insta<span>Track</span></span>
        </div>
        <span class="date-badge">${formatDate()}</span>
      </div>
      <div class="header-title">You're all set! 🎉</div>
      <div class="header-subtitle">Follower tracking is now active for @${instaUsername}</div>
    </div>

    <div class="body">
      <div class="welcome-hero">
        <span class="welcome-icon">🚀</span>
      </div>

      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-value">8AM</div>
          <div class="stat-label">Daily check</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">IST</div>
          <div class="stat-label">Timezone</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">∞</div>
          <div class="stat-label">Days tracked</div>
        </div>
      </div>

      <p class="section-label">What happens next</p>
      <ul class="step-list">
        <li class="step-item">
          <div class="step-num">1</div>
          <div class="step-content">
            <div class="step-title">Snapshot saved</div>
            <div class="step-desc">We've recorded your current follower list for @${instaUsername} as the baseline.</div>
          </div>
        </li>
        <li class="step-item">
          <div class="step-num">2</div>
          <div class="step-content">
            <div class="step-title">Daily comparison</div>
            <div class="step-desc">Every morning at 8 AM IST, we fetch your latest followers and compare them to the previous day.</div>
          </div>
        </li>
        <li class="step-item">
          <div class="step-num">3</div>
          <div class="step-content">
            <div class="step-title">Email report</div>
            <div class="step-desc">If anyone unfollowed you, you'll get an email listing exactly who — with a direct link to their profile.</div>
          </div>
        </li>
      </ul>

      <div class="info-box">
        📌 Your first report will arrive <strong style="color:#e0e0f0;">tomorrow morning</strong>. 
        We only read your public follower list — we never post, like, or interact with your account.
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `✅ Tracking started for @${instaUsername}`,
    html: wrapEmail(content, `Welcome! We've saved your first follower snapshot for @${instaUsername}.`),
  });

  if (error) throw new Error(`[Mailer] Resend error: ${error.message}`);
  console.log(`[Mailer] Welcome email sent to ${to}`);
}

export async function sendUnfollowerReport(
  to: string,
  instaUsername: string,
  unfollowers: string[],
): Promise<void> {
  const hasUnfollowers = unfollowers.length > 0;
  const date = formatDate();

  let content: string;

  if (hasUnfollowers) {
    const items = unfollowers
      .map(
        (u) => `
        <li class="unfollower-item">
          <div class="unfollower-left">
            <div class="avatar">${getInitial(u)}</div>
            <div>
              <div class="unfollower-name">@${u}</div>
              <div class="unfollower-handle">instagram.com/${u}</div>
            </div>
          </div>
          <a class="view-btn" href="https://instagram.com/${u}" target="_blank">View →</a>
        </li>`,
      )
      .join("");

    content = `
      <div class="header">
        <div class="header-top">
          <div class="logo-mark">
            <div class="logo-icon">📊</div>
            <span class="logo-text">Insta<span>Track</span></span>
          </div>
          <span class="date-badge">${date}</span>
        </div>
        <div class="header-title">
          ${unfollowers.length} ${unfollowers.length === 1 ? 'person' : 'people'} unfollowed you 👀
        </div>
        <div class="header-subtitle">Daily report for @${instaUsername}</div>
      </div>

      <div class="body">
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-value" style="color:#f87171;">${unfollowers.length}</div>
            <div class="stat-label">Unfollowed</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color:#818cf8;">@${instaUsername}</div>
            <div class="stat-label">Account</div>
          </div>
        </div>

        <p class="section-label">Who unfollowed you</p>
        <ul class="unfollower-list">${items}</ul>

        <div class="info-box">
          💡 Click <strong style="color:#e0e0f0;">View →</strong> next to any username to visit their Instagram profile directly.
        </div>
      </div>
    `;
  } else {
    content = `
      <div class="header">
        <div class="header-top">
          <div class="logo-mark">
            <div class="logo-icon">📊</div>
            <span class="logo-text">Insta<span>Track</span></span>
          </div>
          <span class="date-badge">${date}</span>
        </div>
        <div class="header-title">All good today ✅</div>
        <div class="header-subtitle">Daily report for @${instaUsername}</div>
      </div>

      <div class="body">
        <div class="all-good-box">
          <span class="all-good-icon">🎯</span>
          <div class="all-good-title">No unfollowers today!</div>
          <div class="all-good-sub">
            @${instaUsername} is holding strong.<br />Keep posting great content!
          </div>
        </div>

        <div class="info-box">
          We'll keep monitoring every morning and notify you the moment anyone unfollows.
        </div>
      </div>
    `;
  }

  const subject = hasUnfollowers
    ? `👀 ${unfollowers.length} ${unfollowers.length === 1 ? 'person' : 'people'} unfollowed @${instaUsername}`
    : `✅ No unfollowers today — @${instaUsername} is all good`;

  const preview = hasUnfollowers
    ? `${unfollowers.length} new unfollow${unfollowers.length !== 1 ? 's' : ''} detected on @${instaUsername}`
    : `Great news! Nobody unfollowed @${instaUsername} today.`;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: wrapEmail(content, preview),
  });

  if (error) throw new Error(`[Mailer] Resend error: ${error.message}`);
  console.log(`[Mailer] Report sent to ${to} — ${unfollowers.length} unfollowers`);
}

export async function sendAccountErrorEmail(
  to: string,
  instaUsername: string,
  reason: string,
): Promise<void> {
  const content = `
    <div class="header">
      <div class="header-top">
        <div class="logo-mark">
          <div class="logo-icon">📊</div>
          <span class="logo-text">Insta<span>Track</span></span>
        </div>
        <span class="date-badge">${formatDate()}</span>
      </div>
      <div class="header-title">Tracking paused ⚠️</div>
      <div class="header-subtitle">Action required for @${instaUsername}</div>
    </div>

    <div class="body">
      <div class="error-box">
        <div class="error-label">Error details</div>
        <div class="error-reason">${reason}</div>
      </div>

      <p style="font-size:14px; color:#7070a0; line-height:1.7; margin-bottom:24px;">
        We were unable to fetch the follower list for <strong style="color:#e0e0f0;">@${instaUsername}</strong>. 
        This usually happens when an account is set to private or has been deactivated.
        Tracking has been paused automatically.
      </p>

      <div class="info-box">
        If you've switched back to a public account, you can re-activate tracking by signing up again below.
      </div>

      <div class="divider"></div>

      <div style="text-align:center;">
        <a href="${BASE_URL}" class="cta-btn">Reactivate Tracking →</a>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `⚠️ Tracking paused for @${instaUsername}`,
    html: wrapEmail(content, `We couldn't track @${instaUsername}. Action required.`),
  });

  if (error) throw new Error(`[Mailer] Resend error: ${error.message}`);
  console.log(`[Mailer] Error email sent to ${to}`);
}

export async function sendUnsubscribeEmail(
  to: string,
  instaUsername: string,
): Promise<void> {
  const content = `
    <div class="header">
      <div class="header-top">
        <div class="logo-mark">
          <div class="logo-icon">📊</div>
          <span class="logo-text">Insta<span>Track</span></span>
        </div>
        <span class="date-badge">${formatDate()}</span>
      </div>
      <div class="header-title">You've unsubscribed 👋</div>
      <div class="header-subtitle">Tracking stopped for @${instaUsername}</div>
    </div>

    <div class="body">
      <p style="font-size:15px; color:#7070a0; line-height:1.7; margin-bottom:24px;">
        We've stopped monitoring followers for <strong style="color:#e0e0f0;">@${instaUsername}</strong>. 
        You won't receive any more daily reports from us. Your data will be removed shortly.
      </p>

      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-value">🛑</div>
          <div class="stat-label">Tracking off</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">0</div>
          <div class="stat-label">Emails left</div>
        </div>
      </div>

      <div class="divider"></div>

      <p style="font-size:13px; color:#555570; text-align:center; margin-bottom:20px;">
        Changed your mind? You can always come back.
      </p>

      <div style="text-align:center;">
        <a href="${BASE_URL}" class="cta-btn">Start Tracking Again →</a>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `👋 You've been unsubscribed from InstaTrack`,
    html: wrapEmail(content, `You've unsubscribed. Tracking stopped for @${instaUsername}.`),
  });

  if (error) throw new Error(`[Mailer] Resend error: ${error.message}`);
  console.log(`[Mailer] Unsubscribe email sent to ${to}`);
}