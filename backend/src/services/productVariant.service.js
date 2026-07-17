import { findProductVariantById, findProductVariants, findProductVariantBySku, createProductVariant, countProductVariants, updateProductVariant, deleteProductVariant, findProductById, findProductSizeById, findProductWeightById, findProductColorById, } from "../repositories/productVariant.repository.js";

import { getPagination } from "../utils/pagination.js";

export async function createProductVariantService(data) {
    const {
        sku,
        price,
        comparePrice,
        stock,
        productId,
        sizeId,
        colorId,
        weightId,
    } = data;

    const trimmedSku = sku.trim();

    // Check duplicate SKU
    const existingSku = await findProductVariantBySku(trimmedSku);

    if (existingSku) {
        throw new Error("SKU already exists.");
    }

    // Validate Product
    const product = await findProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    // Validate Size (Optional)
    if (sizeId) {
        const size = await findProductSizeById(sizeId);

        if (!size) {
            throw new Error("Product size not found.");
        }
    }

    // Validate Color (Optional)
    if (colorId) {
        const color = await findProductColorById(colorId);

        if (!color) {
            throw new Error("Product color not found.");
        }
    }

    // Validate Weight (Optional)
    if (weightId) {
        const weight = await findProductWeightById(weightId);

        if (!weight) {
            throw new Error("Product weight not found.");
        }
    }

    return createProductVariant({
        sku: trimmedSku,
        price,
        comparePrice,
        stock,
        productId,
        sizeId,
        colorId,
        weightId,
    });
}

export async function getProductVariantsService(query) {
    const {
        search,
        productId,
        sizeId,
        colorId,
        weightId,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const { page, limit, skip, take } = getPagination(query);

    const where = {};

    // Search by SKU
    if (search?.trim()) {
        where.sku = {
            contains: search.trim(),
            mode: "insensitive",
        };
    }

    if (productId) {
        where.productId = productId;
    }

    if (sizeId) {
        where.sizeId = sizeId;
    }

    if (colorId) {
        where.colorId = colorId;
    }

    if (weightId) {
        where.weightId = weightId;
    }

    const allowedSortFields = [
        "sku",
        "price",
        "stock",
        "createdAt",
        "updatedAt",
    ];

    const orderBy = {
        [allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
    };

    const [productVariants, total] = await Promise.all([
        findProductVariants({
            skip,
            take,
            where,
            orderBy,
        }),
        countProductVariants(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productVariants,
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

export async function getProductVariantByIdService(id) {
    const productVariant = await findProductVariantById(id);

    if (!productVariant) {
        throw new Error("Product Variant not found.");
    }

    return productVariant;
}

export async function updateProductVariantService(id, data) {
    const productVariant = await findProductVariantById(id);

    if (!productVariant) {
        throw new Error("Product Variant not found.");
    }

    const updateData = { ...data };

    // Update SKU
    if (data.sku) {
        const trimmedSku = data.sku.trim();

        const existingSku = await findProductVariantBySku(trimmedSku);

        if (existingSku && existingSku.id !== id) {
            throw new Error("SKU already exists.");
        }

        updateData.sku = trimmedSku;
    }

    // Validate Product
    if (data.productId) {
        const product = await findProductById(data.productId);

        if (!product) {
            throw new Error("Product not found.");
        }
    }

    // Validate Size
    if (data.sizeId) {
        const size = await findProductSizeById(data.sizeId);

        if (!size) {
            throw new Error("Product size not found.");
        }
    }

    // Validate Color
    if (data.colorId) {
        const color = await findProductColorById(data.colorId);

        if (!color) {
            throw new Error("Product color not found.");
        }
    }

    // Validate Weight
    if (data.weightId) {
        const weight = await findProductWeightById(data.weightId);

        if (!weight) {
            throw new Error("Product weight not found.");
        }
    }

    return updateProductVariant(id, updateData);
}

export async function deleteProductVariantService(id) {
    const productVariant = await findProductVariantById(id);

    if (!productVariant) {
        throw new Error("Product Variant not found.");
    }

    await deleteProductVariant(id);

    return null;
}