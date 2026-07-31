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

export async function getRecentCustomerOrders(userId, limit = 5) {
  return prisma.order.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: limit,

    select: {
      id: true,

      status: true,
      grandTotal: true,
      paymentStatus: true,
      createdAt: true,
    },
  });
}

export async function getRecentWishlist(userId, limit = 5) {
  return prisma.wishlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      product: {
        include: {
          brand: true,
          category: true,
          variants: {
            take: 1,
          },
        },
      },
    },
  });
}

export async function getCartPreview(userId, limit = 5) {
  return prisma.cartItem.findMany({
    where: {
      cart: {
        userId,
      },
    },

    take: limit,

    include: {
      productVariant: {
        include: {
          product: {
            include: {
              brand: true,
              category: true,
            },
          },
        },
      },
    },
  });
}