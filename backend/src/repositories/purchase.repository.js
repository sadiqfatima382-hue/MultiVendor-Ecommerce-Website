import prisma from "../config/prisma.js";

export async function createPurchase(data) {
    return prisma.purchase.create({
        data,
    });
}

export async function findPurchaseById(id) {
  return prisma.purchase.findUnique({
    where: {
      id,
    },

    include: {
      supplier: true,

      vendor: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      items: {
        include: {
          product: true,
          productVariant: true,
        },
      },
    },
  });
}

export async function findPurchaseByNumber(
  purchaseNumber
) {
  return prisma.purchase.findUnique({
    where: {
      purchaseNumber,
    },
  });
}

export async function updatePurchase(id, data) {
  return prisma.purchase.update({
    where: {
      id,
    },

    data,
  });
}

export async function deletePurchase(id) {
  return prisma.purchase.delete({
    where: {
      id,
    },
  });
}

//Purchase Item Methods

export async function addPurchaseItem(data) {
  return prisma.purchaseItem.create({
    data,
  });
}

export async function updatePurchaseItem(
  id,
  data
) {
  return prisma.purchaseItem.update({
    where: {
      id,
    },

    data,
  });
}

export async function removePurchaseItem(id) {
  return prisma.purchaseItem.delete({
    where: {
      id,
    },
  });
}

export async function findPurchaseItemById(id) {
  return prisma.purchaseItem.findUnique({
    where: {
      id,
    },
  });
}

export async function getPurchaseItems(
  purchaseId
) {
  return prisma.purchaseItem.findMany({
    where: {
      purchaseId,
    },

    include: {
      product: true,
      productVariant: true,
    },
  });
}

export async function approvePurchase(
  purchaseId,
  approvedById
) {
  return prisma.purchase.update({
    where: {
      id: purchaseId,
    },
    data: {
      status: "APPROVED",
      approvedById,
      approvedAt: new Date(),
    },
  });
}

export async function updatePurchaseStatus(
  purchaseId,
  data
) {
  return prisma.purchase.update({
    where: {
      id: purchaseId,
    },
    data,
  });
}