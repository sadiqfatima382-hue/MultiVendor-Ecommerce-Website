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

//Analytics Dashboard
export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    take: limit,

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getRecentUsers(limit = 5) {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },

    take: limit,

    include: {
      role: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getRecentVendors(limit = 5) {
  return prisma.vendor.findMany({
    orderBy: {
      createdAt: "desc",
    },

    take: limit,
  });
}

export async function getPendingVendorApprovals(limit = 5) {
  return prisma.vendor.findMany({
    where: {
      status: "PENDING",
    },

    orderBy: {
      createdAt: "asc",
    },

    take: limit,
  });
}

export async function getTopSellingProducts(limit = 5) {
  return prisma.orderItem.groupBy({
    by: ["productId", "productName"],

    where: {
      vendorOrder: {
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

export async function getTopVendors(limit = 5) {
  return prisma.vendorOrder.groupBy({
    by: ["vendorId"],

    where: {
      status: "DELIVERED",
    },

    _sum: {
      subtotal: true,
    },

    orderBy: {
      _sum: {
        subtotal: "desc",
      },
    },

    take: limit,
  });
}

//Monthly Revenue
export async function getMonthlyRevenue(year) {
  const result = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      SUM("grandTotal") AS revenue
    FROM "Order"
    WHERE
      "status" = 'DELIVERED'
      AND EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY month
    ORDER BY month;
  `;

  return result;
}

//Monthly Orders
export async function getMonthlyOrders(year) {
  const result = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS orders
    FROM "Order"
    WHERE
      EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY month
    ORDER BY month;
  `;

  return result;
}

//Monthly User Registration
export async function getMonthlyUsers(year) {
  const result = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS users
    FROM "User"
    WHERE
      EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY month
    ORDER BY month;
  `;

  return result;
}

//Monthly Vendor Registration
export async function getMonthlyVendors(year) {
  const result = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS vendors
    FROM "Vendor"
    WHERE
      EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY month
    ORDER BY month;
  `;

  return result;
}

//Product Status Distribution
export async function getProductStatusDistribution() {
  return prisma.product.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });
}

//Vendor Status Distribution
export async function getVendorStatusDistribution() {
  return prisma.vendor.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });
}