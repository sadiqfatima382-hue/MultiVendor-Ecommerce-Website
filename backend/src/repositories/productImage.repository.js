import prisma from "../config/prisma.js";

export async function findProductImageById(id) {
  return prisma.productImage.findUnique({
    where: { id },
  });
}

export async function createProductImage(data) {
  return prisma.productImage.create({
    data,
  });
}

export async function findProductImages({
  skip,
  take,
  where,
  orderBy,
}) {
  return prisma.productImage.findMany({
    skip,
    take,
    where,
    orderBy,
    select: {
      id: true,
      imageUrl: true,
      publicId: true,
      isPrimary: true,
      createdAt: true,

      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function countProductImages(where) {
  return prisma.productImage.count({
    where,
  });
}

export async function updateProductImage(id, data) {
  return prisma.productImage.update({
    where: { id },
    data,
  });
}

export async function deleteProductImage(id) {
  return prisma.productImage.delete({
    where: { id },
  });
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function clearPrimaryImage(productId) {
  return prisma.productImage.updateMany({
    where: {
      productId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });
}