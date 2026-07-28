import prisma from "../config/prisma.js";

export async function findAbandonedCarts(cutoffDate) {
  return prisma.cart.findMany({
    where: {
      updatedAt: {
        lt: cutoffDate,
      },

      items: {
        some: {},
      },
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      items: {
        include: {
          productVariant: {
            select: {
              id: true,
              sku: true,
              price: true,
              comparePrice: true,
              stock: true,

              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      updatedAt: "asc",
    },
  });
}