import prisma from "../config/prisma.js";

//Order Repository
export async function countCustomerOrders(userId, where = {}) {
  return prisma.order.count({
    where: {
      userId,
      ...where,
    },
  });
}

export async function sumCustomerSpending(userId) {
  const result = await prisma.order.aggregate({
    where: {
      userId,
      status: "DELIVERED",
    },
    _sum: {
      grandTotal: true,
    },
  });

  return Number(result._sum.grandTotal ?? 0);
}

export async function sumCustomerProductsPurchased(userId) {
  const result = await prisma.orderItem.aggregate({
    where: {
      vendorOrder: {
        order: {
          userId,
        },
        status: "DELIVERED",
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity ?? 0;
}

//Wishlist Repository
export async function countWishlistItems(userId) {
  return prisma.wishlist.count({
    where: {
      userId,
    },
  });
}

//Cart Repository
export async function countCartItems(userId) {
  return prisma.cartItem.count({
    where: {
      cart: {
        userId,
      },
    },
  });
}

//Address Repository
export async function countAddresses(userId) {
  return prisma.address.count({
    where: {
      userId,
    },
  });
}

