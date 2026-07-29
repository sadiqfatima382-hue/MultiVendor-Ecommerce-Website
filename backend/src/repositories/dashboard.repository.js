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