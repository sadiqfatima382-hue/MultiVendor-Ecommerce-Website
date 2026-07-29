import prisma from "../config/prisma.js";

export async function countUsers(where = {}) {
  return prisma.user.count({
    where,
  });
}

export async function countVendors(where = {}) {
  return prisma.vendor.count({
    where,
  });
}

export async function countProducts(where = {}) {
  return prisma.product.count({
    where,
  });
}

export async function countLowStockProducts() {
  return prisma.productVariant.count({
    where: {
      stock: {
        gt: 0,
        lte: 5,
      },
    },
  });
}

export async function countOutOfStockProducts() {
  return prisma.productVariant.count({
    where: {
      stock: 0,
    },
  });
}

export async function countOrders(where = {}) {
  return prisma.order.count({
    where,
  });
}

export async function sumRevenue(where = {}) {
  const result = await prisma.order.aggregate({
    where,
    _sum: {
      grandTotal: true,
    },
  });

  return Number(result._sum.grandTotal ?? 0);
}

export async function sumProductsSold() {
  const result = await prisma.orderItem.aggregate({
    where: {
      vendorOrder: {
        status: "DELIVERED",
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity ?? 0;
}

export async function countCompletedOrders() {
  return prisma.order.count({
    where: {
      status: "DELIVERED",
    },
  });
}