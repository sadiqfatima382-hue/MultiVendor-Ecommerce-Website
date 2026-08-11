import transporter from "../config/mail.js";

try {
  await transporter.verify();

  console.log("✅ SMTP connection is working.");
} catch (error) {
  console.error(
    "❌ SMTP connection failed:",
    error.message
  );
}