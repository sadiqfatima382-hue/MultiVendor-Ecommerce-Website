import prisma from "../config/prisma.js";

export async function findCheckoutCart(userId) {
  return prisma.cart.findFirst({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  vendor: true,
                },
              },
            },
          },
        },
      },
    },
  });
}