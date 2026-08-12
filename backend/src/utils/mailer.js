import transporter from "../config/mail.js";
import {  otpEmailTemplate,} from "../templates/emails/otp.template.js";
import {  passwordResetEmailTemplate,} from "../templates/emails/passwordReset.template.js";
import {  orderConfirmationEmailTemplate,} from "../templates/emails/orderConfirmation.template.js";

async function sendEmail({
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

export async function sendOtpEmail({
  to,
  name,
  otp,
}) {
  const email =
    otpEmailTemplate({
      name,
      otp,
    });

  return sendEmail({
    to,
    ...email,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}) {
  const email =
    passwordResetEmailTemplate({
      name,
      resetUrl,
    });

  return sendEmail({
    to,
    ...email,
  });
}

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  grandTotal,
}) {
  const email =
    orderConfirmationEmailTemplate({
      name,
      orderNumber,
      grandTotal,
    });

  return sendEmail({
    to,
    ...email,
  });
}