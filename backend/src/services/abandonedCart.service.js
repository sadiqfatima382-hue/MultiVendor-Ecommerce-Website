import { findAbandonedCarts } from "../repositories/abandonedCart.repository.js";

export async function getAbandonedCartsService() {
  const cutoffDate = new Date();

  // Cart inactive for 24 hours
  cutoffDate.setHours(cutoffDate.getHours() - 24);

  const carts = await findAbandonedCarts(cutoffDate);

  const result = carts.map((cart) => {
    let totalQuantity = 0;
    let subtotal = 0;

    for (const item of cart.items) {
      totalQuantity += item.quantity;
      subtotal +=
        Number(item.productVariant.price) * item.quantity;
    }

    return {
      id: cart.id,

      customer: cart.user,

      totalItems: cart.items.length,

      totalQuantity,

      subtotal,

      lastActivity: cart.updatedAt,

      items: cart.items,
    };
  });

  return {
    totalAbandonedCarts: result.length,
    carts: result,
  };
}