export function otpEmailTemplate({
  name,
  otp,
}) {
  return {
    subject: "Your Verification Code",

    text: `
Hello ${name},

Your verification code is: ${otp}

This code will expire soon.

If you did not request this code, please ignore this email.

Regards,
Multi Vendor Ecommerce
`,

    html: `
<!DOCTYPE html>
<html>
<body>
  <h2>Hello ${name},</h2>

  <p>Your verification code is:</p>

  <h1>${otp}</h1>

  <p>
    This code will expire soon.
  </p>

  <p>
    If you did not request this code, please ignore this email.
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