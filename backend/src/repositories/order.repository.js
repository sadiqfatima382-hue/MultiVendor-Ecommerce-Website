import prisma from "../config/prisma.js"

export async function createOrder(tx,data) {
    return tx.order.create({
        data,
    });
}

export async function createVendorOrder(tx,data) {
    return tx.vendorOrder.create({
        data,
    });
}

export async function createOrderItem(tx,data) {
    return tx.orderItem.create({
        data,
    });
}

export async function updateVariantStock(tx, id, data) {
    return tx.productVariant.update({
        where: {
            id,
        },
        data,
    })
}

export async function clearCart(tx,cartId) {
    return tx.cartItem.deleteMany({
        where: {
            cartId,
        },
    });
}

export async function findOrdersByUser(userId) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      vendorOrders: {
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findOrderById(id) {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      address: true,

      vendorOrders: {
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              slug: true,
            },
          },

          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },

              productVariant: {
                select: {
                  id: true,
                  sku: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function updateOrder(id, data) {
  return prisma.order.update({
    where: {
      id,
    },
    data,
  });
}

export async function decrementVariantStock(
  tx,
  variantId,
  quantity
) {
  const result = await tx.productVariant.updateMany({
    where: {
      id: variantId,
      stock: {
        gte: quantity,
      },
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });

  return result;
}

export async function findUserCart(
  userId,
  db = prisma
) {
  return db.cart.findUnique({
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