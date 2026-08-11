import transporter from "../config/mail.js";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}