import { findVendorProducts, findVendorProductById, countVendorProducts, countLowStockProducts, countOutOfStockProducts, submitProduct, } from "../repositories/product.repository.js";
import { findVendorByOwnerId } from "../repositories/vendor.repository.js";
import { getPagination } from "../utils/pagination.js";

export async function getDashboardStatsService(ownerId) {
    const vendor = await findVendorByOwnerId(ownerId);

    if (!vendor) {
        throw new Error("Vendor not found.");
    }

    const [totalProducts, draftProducts, pendingProducts, activeProducts, inactiveProducts, rejectedProducts, archivedProducts, lowStock, outOfStock,] = await Promise.all([
        countVendorProducts(vendor.id),
        countVendorProducts(vendor.id, { status: "DRAFT" }),
        countVendorProducts(vendor.id, { status: "PENDING_APPROVAL" }),
        countVendorProducts(vendor.id, { status: "ACTIVE" }),
        countVendorProducts(vendor.id, { status: "INACTIVE" }),
        countVendorProducts(vendor.id, { status: "REJECTED" }),
        countVendorProducts(vendor.id, { status: "ARCHIVED" }),
        countLowStockProducts(vendor.id),
        countOutOfStockProducts(vendor.id),
    ]);

    return {
        totalProducts,
        draftProducts,
        pendingProducts,
        activeProducts,
        inactiveProducts,
        rejectedProducts,
        archivedProducts,
        lowStock,
        outOfStock,
    };
}
export async function getVendorProductsService(ownerId, query) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const {
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const { page, limit, skip, take } = getPagination(query);

  const where = {};

  if (search?.trim()) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  if (status) {
    where.status = status;
  }

  const allowedSortFields = [
    "name",
    "createdAt",
    "updatedAt",
  ];

  const orderBy = {
    [allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
  };

  const [products, total] = await Promise.all([
    findVendorProducts({
      vendorId: vendor.id,
      skip,
      take,
      where,
      orderBy,
    }),
    countVendorProducts(vendor.id, where),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
export async function getVendorProductByIdService(ownerId, productId) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const product = await findVendorProductById(
    vendor.id,
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
}
export async function getLowStockProductsService(ownerId) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const total = await countLowStockProducts(vendor.id);

  return {
    total,
  };
}
export async function getOutOfStockProductsService(ownerId) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const total = await countOutOfStockProducts(vendor.id);

  return {
    total,
  };
}
export async function submitProductService(ownerId, productId) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const product = await findVendorProductById(
    vendor.id,
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status !== "DRAFT") {
    throw new Error(
      "Only draft products can be submitted."
    );
  }

  return submitProduct(product.id);
}