export function orderConfirmationEmailTemplate({
  name,
  orderNumber,
  grandTotal,
}) {
  return {
    subject: `Order Confirmed - ${orderNumber}`,

    text: `
Hello ${name},

Your order ${orderNumber} has been confirmed.

Order Total: ${grandTotal}

Thank you for shopping with us.

Regards,
Multi Vendor Ecommerce
`,

    html: `
<!DOCTYPE html>
<html>
<body>
  <h2>Order Confirmed 🎉</h2>

  <p>Hello ${name},</p>

  <p>
    Your order
    <strong>${orderNumber}</strong>
    has been confirmed.
  </p>

  <p>
    <strong>Order Total:</strong>
    ${grandTotal}
  </p>

  <p>
    Thank you for shopping with us.
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