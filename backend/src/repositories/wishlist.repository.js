import prisma from "../config/prisma.js";

export async function findWishlistItem(userId, productId) {
  return prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function createWishlist(data) {
  return prisma.wishlist.create({
    data,
  });
}

export async function deleteWishlist(userId, productId) {
  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function countWishlist(userId) {
  return prisma.wishlist.count({
    where: {
      userId,
    },
  });
}

export async function findWishlist({
  userId,
  skip,
  take,
  where = {},
  orderBy,
}) {
  return prisma.wishlist.findMany({
    where: {
      userId,
      ...where,
    },

    skip,
    take,

    orderBy,

    include: {
      product: {
        include: {
          brand: true,
          category: true,
          variants: {
            where: {
              isDefault: true,
            },
          },
        },
      },
    },
  });
}

export async function countWishlistItems(userId, where = {}) {
  return prisma.wishlist.count({
    where: {
      userId,
      ...where,
    },
  });
}