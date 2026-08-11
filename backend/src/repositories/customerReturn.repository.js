import prisma from "../config/prisma.js";

// =====================================================
// CREATE RETURN
// =====================================================

export async function createCustomerReturn(
  data,
  db = prisma
) {
  return db.customerReturn.create({
    data,
    include: {
      items: true,
    },
  });
}

// =====================================================
// FIND RETURN BY ID
// =====================================================

export async function findCustomerReturnById(
  id,
  db = prisma
) {
  return db.customerReturn.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          orderItem: true,
          product: true,
          productVariant: true,
        },
      },
      user: true,
      order: true,
    },
  });
}

// =====================================================
// FIND BY RETURN NUMBER
// =====================================================

export async function findCustomerReturnByNumber(
  returnNumber,
  db = prisma
) {
  return db.customerReturn.findUnique({
    where: {
      returnNumber,
    },
  });
}

// =====================================================
// FIND RETURNS
// =====================================================

export async function findCustomerReturns(
  {
    skip,
    take,
    where,
    orderBy,
  },
  db = prisma
) {
  return db.customerReturn.findMany({
    skip,
    take,
    where,
    orderBy,

    include: {
      items: {
        include: {
          product: true,
          productVariant: true,
          orderItem: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
          grandTotal: true,
          paymentStatus: true,
          status: true,
        },
      },
    },
  });
}

// =====================================================
// COUNT RETURNS
// =====================================================

export async function countCustomerReturns(
  where,
  db = prisma
) {
  return db.customerReturn.count({
    where,
  });
}

// =====================================================
// UPDATE RETURN
// =====================================================

export async function updateCustomerReturn(
  id,
  data,
  db = prisma
) {
  return db.customerReturn.update({
    where: {
      id,
    },
    data,
    include: {
      items: true,
    },
  });
}

// =====================================================
// DELETE RETURN
// =====================================================

export async function deleteCustomerReturn(
  id,
  db = prisma
) {
  return db.customerReturn.delete({
    where: {
      id,
    },
  });
}

// =====================================================
// FIND ORDER
// =====================================================

export async function findOrderById(
  orderId,
  db = prisma
) {
  return db.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      user: true,

      vendorOrders: {
        include: {
          orderItems: true,
        },
      },
    },
  });
}

// =====================================================
// FIND ORDER ITEM
// =====================================================

export async function findOrderItemById(
  orderItemId,
  db = prisma
) {
  return db.orderItem.findUnique({
    where: {
      id: orderItemId,
    },
  });
}

// =====================================================
// FIND PREVIOUSLY RETURNED QUANTITY
// =====================================================

export async function getReturnedQuantity(
  orderItemId,
  db = prisma
) {
  const result =
    await db.customerReturnItem.aggregate({
      where: {
        orderItemId,

        return: {
          status: {
            not: "REJECTED",
          },
        },
      },

      _sum: {
        quantity: true,
      },
    });

  return result._sum.quantity || 0;
}

// =====================================================
// CREATE RETURN ITEM
// =====================================================

export async function createCustomerReturnItem(
  data,
  db = prisma
) {
  return db.customerReturnItem.create({
    data,
  });
}

// =====================================================
// FIND INVENTORY LEDGER ENTRIES
// =====================================================

export async function findInventoryLedgerByReference(
  referenceId,
  db = prisma
) {
  return db.inventoryLedger.findMany({
    where: {
      referenceId,
    },
  });
}