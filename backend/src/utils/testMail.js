import "dotenv/config"
import transporter from "../config/mail.js";

try {
  await transporter.verify();

  console.log("✅ SMTP connection is working.");

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,

    to: "your_test_email@gmail.com",

    subject: "Multi Vendor Ecommerce Test Email",

    text: "Nodemailer is working successfully.",

    html: `
      <div>
        <h2>Multi Vendor Ecommerce</h2>
        <p>Nodemailer is working successfully.</p>
      </div>
    `,
  });

  console.log(
    "✅ Email sent:",
    info.messageId
  );
} catch (error) {
  console.error(
    "❌ Email failed:",
    error
  );
}