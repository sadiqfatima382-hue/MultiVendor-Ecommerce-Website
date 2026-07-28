import prisma from "../config/prisma.js";

export async function createQualityControl(data) {
  return prisma.qualityControl.create({
    data,
  });
}

export async function findQualityControlByVendorOrder(
  vendorOrderId
) {
  return prisma.qualityControl.findUnique({
    where: {
      vendorOrderId,
    },

    include: {
      vendorOrder: {
        include: {
          order: true,
          items: true,
        },
      },
    },
  });
}

export async function updateQualityControl(
  id,
  data
) {
  return prisma.qualityControl.update({
    where: {
      id,
    },
    data,
  });
}