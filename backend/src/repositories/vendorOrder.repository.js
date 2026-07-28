import prisma from "../config/prisma.js";

export async function findVendorOrders(vendorId) {
  return prisma.vendorOrder.findMany({
    where: {
      vendorId,
    },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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

export async function findVendorOrderById(id) {
  return prisma.vendorOrder.findUnique({
    where: {
      id,
    },
    include: {
      order: {
        include: {
          address: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      items: {
        include: {
          product: true,
          productVariant: true,
        },
      },

      vendor: true,
    },
  });
}

export async function updateVendorOrder(id, data) {
  return prisma.vendorOrder.update({
    where: {
      id,
    },
    data,
  });
}

export async function countIncompleteVendorOrders(
  orderId
) {
  return prisma.vendorOrder.count({
    where: {
      orderId,
      NOT: {
        status: "DELIVERED",
      },
    },
  });
}