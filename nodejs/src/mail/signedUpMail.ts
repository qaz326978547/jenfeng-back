import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_ENCRYPTION === "ssl",
  auth: env.MAIL_USERNAME ? { user: env.MAIL_USERNAME, pass: env.MAIL_PASSWORD } : undefined,
});

export interface SignedUpMailData {
  company: string;
  class: string;
  num: string;
  tel: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!,
  );
}

// Matches app/Console date format Y/m/d H:i:s in the Asia/Taipei timezone
// (config/app.php had 'timezone' => 'Asia/Taipei').
function formatSentAt(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}/${get("month")}/${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

// Ports resources/views/emails/signUpClass.blade.php. Blade auto-escapes
// {{ }} output, so we do the same here via escapeHtml().
function renderSignedUpMailHtml(data: SignedUpMailData & { sentAt: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>信箱驗證</title>
<style>
  span { color: blue; font-weight: bold; }
</style>
</head>
<body>
<p>JENFENG 有新的報名資料</p>
<p>報名公司:<span>${escapeHtml(data.company)}</span></p>
<p>報名課程:<span>${escapeHtml(data.class)}</span></p>
<p>報名人數:<span>${escapeHtml(data.num)}</span></p>
<p>公司聯絡電話:<span>${escapeHtml(data.tel)}</span></p>
<p>報名資料建立時間:<span>${data.sentAt}</span></p>
<p>請由此網頁做查看<a href="https://laborservice5690.com/admin/contact" target="_blank">https://laborservice5690.com/admin/contact</a></p>
</body>
</html>`;
}

export async function sendSignedUpMail(data: SignedUpMailData): Promise<void> {
  const html = renderSignedUpMailHtml({ ...data, sentAt: formatSentAt(new Date()) });

  await transporter.sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_ADDRESS}>`,
    to: env.RECIPIENT_EMAIL,
    subject: "JINFENG 報名成功通知",
    html,
  });
}
