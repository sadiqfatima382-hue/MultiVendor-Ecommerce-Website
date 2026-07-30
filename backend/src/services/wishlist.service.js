import {  findWishlistItem,  createWishlist,  deleteWishlist,  findWishlist,  countWishlist,  countWishlistItems,} from "../repositories/wishlist.repository.js";
import { findProductById } from "../repositories/product.repository.js";
import { getPagination } from "../utils/pagination.js";

export async function addToWishlistService(userId, productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  const exists = await findWishlistItem(userId, productId);

  if (exists) {
    throw new Error("Product already exists in wishlist.");
  }

  await createWishlist({
    userId,
    productId,
  });

  return {
    message: "Product added to wishlist successfully.",
  };
}

export async function removeWishlistService(userId, productId) {
  const wishlist = await findWishlistItem(userId, productId);

  if (!wishlist) {
    throw new Error("Wishlist item not found.");
  }

  await deleteWishlist(userId, productId);

  return {
    message: "Product removed from wishlist successfully.",
  };
}

export async function getWishlistService(userId, query) {
  const {
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const { page, limit, skip, take } = getPagination(query);

  const where = {};

  if (search?.trim()) {
    where.product = {
      name: {
        contains: search.trim(),
        mode: "insensitive",
      },
    };
  }

  const allowedSortFields = [
    "createdAt",
  ];

  const orderBy = {
    [allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
  };

  const [wishlist, total] = await Promise.all([
    findWishlist({
      userId,
      skip,
      take,
      where,
      orderBy,
    }),

    countWishlistItems(userId, where),
  ]);

  return {
    wishlist,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
}

export async function checkWishlistService(userId, productId) {
  const wishlist = await findWishlistItem(
    userId,
    productId
  );

  return {
    wishlisted: !!wishlist,
  };
}

export async function getWishlistCountService(userId) {
  const count = await countWishlist(userId);

  return {
    count,
  };
}

