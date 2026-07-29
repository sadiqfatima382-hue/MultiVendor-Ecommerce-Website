export async function findAbandonedCarts(
  cutoffDate,
  skip,
  take
) {
  const [carts, total] = await Promise.all([
    prisma.cart.findMany({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },

        items: {
          some: {},
        },
      },

      skip,
      take,

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
              include: {
                product: true,
              },
            },
          },
        },
      },

      orderBy: {
        updatedAt: "asc",
      },
    }),

    prisma.cart.count({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },

        items: {
          some: {},
        },
      },
    }),
  ]);

  return {
    carts,
    total,
  };
}