import { getPagination } from "../helpers/pagination.js";

export async function getAbandonedCartsService(query) {
  const { page, limit, skip } = getPagination(query);

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 24);

  const { carts, total } =
    await findAbandonedCarts(
      cutoffDate,
      skip,
      limit
    );

  const result = carts.map((cart) => {
    let totalQuantity = 0;
    let subtotal = 0;

    for (const item of cart.items) {
      totalQuantity += item.quantity;

      subtotal +=
        Number(item.productVariant.price) *
        item.quantity;
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
    totalAbandonedCarts: total,

    currentPage: page,

    totalPages: Math.ceil(total / limit),

    limit,

    carts: result,
  };
}