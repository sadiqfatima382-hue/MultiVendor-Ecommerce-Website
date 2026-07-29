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