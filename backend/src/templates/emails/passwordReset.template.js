export function passwordResetEmailTemplate({
  name,
  resetUrl,
}) {
  return {
    subject: "Reset Your Password",

    text: `
Hello ${name},

We received a request to reset your password.

Reset your password using this link:

${resetUrl}

If you did not request a password reset, you can safely ignore this email.

Regards,
Multi Vendor Ecommerce
`,

    html: `
<!DOCTYPE html>
<html>
<body>
  <h2>Hello ${name},</h2>

  <p>
    We received a request to reset your password.
  </p>

  <p>
    Click the button below to reset your password:
  </p>

  <p>
    <a href="${resetUrl}">
      Reset Password
    </a>
  </p>

  <p>
    If you did not request a password reset,
    you can safely ignore this email.
  </p>

  <p>
    Regards,<br>
    Multi Vendor Ecommerce
  </p>
</body>
</html>
`,
  };
}