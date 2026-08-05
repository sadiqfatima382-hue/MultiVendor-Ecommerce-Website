import prisma from "../config/prisma.js";

export async function createInventoryAdjustment(
  data,
  db = prisma
) {
  return db.inventoryAdjustment.create({
    data,
    include: {
      items: true,
      createdBy: true,
    },
  });
}

export async function createInventoryAdjustmentItem(
  data,
  db = prisma
) {
  return db.inventoryAdjustmentItem.create({
    data,
  });
}

export async function findInventoryAdjustmentById(
  id,
  db = prisma
) {
  return db.inventoryAdjustment.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
      createdBy: true,
    },
  });
}

export async function getInventoryAdjustments(
  where = {},
  skip = 0,
  take = 10,
  db = prisma
) {
  return db.inventoryAdjustment.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdBy: true,
    },
  });
}

export async function countInventoryAdjustments(
  where = {},
  db = prisma
) {
  return db.inventoryAdjustment.count({
    where,
  });
}

