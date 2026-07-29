import prisma from "../config/prisma.js";
export async function countVendorOrders(
  vendorId,
  where = {}
) {
  return prisma.vendorOrder.count({
    where: {
      vendorId,
      ...where,
    },
  });
}

export async function sumVendorRevenue(
  vendorId,
  where = {}
) {
  const result = await prisma.vendorOrder.aggregate({
    where: {
      vendorId,
      ...where,
    },

    _sum: {
      subtotal: true,
    },
  });

  return Number(result._sum.subtotal ?? 0);
}

export async function countCompletedVendorOrders(
  vendorId,
  where = {}
) {
  return prisma.vendorOrder.count({
    where: {
      vendorId,
      status: "DELIVERED",
      ...where,
    },
  });
}

export async function sumProductsSold(vendorId) {
  const result = await prisma.orderItem.aggregate({
    where: {
      vendorOrder: {
        vendorId,
        status: "DELIVERED",
      },
    },

    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity ?? 0;
}

export async function getRecentVendorOrders(vendorId, limit = 5){
return prisma.vendorOrder.findMany({
  where: {
    vendorId,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: limit,
  include: {
    order: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
  },
});
}

export async function getTopSellingProducts(vendorId, limit = 5){
return prisma.orderItem.groupBy({
  by: ["productId", "productName"],
  where: {
    vendorOrder: {
      vendorId,
      status: "DELIVERED",
    },
  },
  _sum: {
    quantity: true,
  },
  orderBy: {
    _sum: {
      quantity: "desc",
    },
  },
  take: limit,
});
}