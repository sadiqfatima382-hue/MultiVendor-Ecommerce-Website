export function orderPlacedEmail({
  customerName,
  orderId,
  orderNumber,
  grandTotal,
}) {
  return {
    subject: "Order placed successfully",

    text: `
Hello ${customerName},

Your order has been placed successfully.

Order ID: ${orderId}
Order Number: ${orderNumber || orderId}
Total: ${grandTotal}

Thank you for shopping with us.
`,

    html: `
      <div>
        <h2>Order Placed Successfully 🎉</h2>

        <p>Hello ${customerName},</p>

        <p>
          Your order has been placed successfully.
        </p>

        <p>
          <strong>Order ID:</strong>
          ${orderId}
        </p>

        <p>
          <strong>Order Number:</strong>
          ${orderNumber || orderId}
        </p>

        <p>
          <strong>Total:</strong>
          ${grandTotal}
        </p>

        <p>
          Thank you for shopping with us. ❤️
        </p>
      </div>
    `,
  };
}