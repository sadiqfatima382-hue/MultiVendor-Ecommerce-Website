import { findProductWeightById, findProductWeight, findProductWeights, createProductWeight, countProductWeights, updateProductWeight, deleteProductWeight, } from "../repositories/productWeight.repository.js";
import { getPagination } from "../utils/pagination.js";


export async function createProductWeightService(data) {
    const value = data.value;
    const unit = data.unit.trim();
    const normalizedUnit = unit.toLowerCase();

    const existingProductWeight = await findProductWeight(
        value,
        normalizedUnit
    );

    if (existingProductWeight) {
        throw new Error("Product weight already exists.");
    }

    return createProductWeight({
        value,
        unit: normalizedUnit,
    });
}

export async function getProductWeightsService(query) {
    const {
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const { page, limit, skip, take } = getPagination(query);

    const where = {};

    if (search?.trim()) {
        where.unit = {
            contains: search.trim(),
            mode: "insensitive",
        };
    }

    const allowedSortFields = [
        "value",
        "unit",
        "createdAt",
    ];

    const orderBy = {
        [allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
    };

    const [productWeights, total] = await Promise.all([
        findProductWeights({
            skip,
            take,
            where,
            orderBy,
        }),
        countProductWeights(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productWeights,
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

export async function getProductWeightByIdService(id) {
    const productWeight = await findProductWeightById(id);

    if (!productWeight) {
        throw new Error("Product weight not found.");
    }

    return productWeight;
}

export async function updateProductWeightService(id, data) {
    const productWeight = await findProductWeightById(id);

    if (!productWeight) {
        throw new Error("Product weight not found.");
    }

    const value = data.value ?? productWeight.value;

    const unit = (data.unit ?? productWeight.unit).trim();
    const normalizedUnit = unit.toLowerCase();

    const existingProductWeight = await findProductWeight(
        value,
        normalizedUnit
    );

    if (
        existingProductWeight &&
        existingProductWeight.id !== id
    ) {
        throw new Error("Product weight already exists.");
    }

    return updateProductWeight(id, {
        ...data,
        value,
        unit: normalizedUnit,
    });
}

export async function deleteProductWeightService(id) {
    const productWeight = await findProductWeightById(id);

    if (!productWeight) {
        throw new Error("Product weight not found.");
    }

    // Prevent deletion if this weight is used by any variants
    if (productWeight.variants.length > 0) {
        throw new Error(
            "Cannot delete product weight because it is being used by product variants."
        );
    }

    await deleteProductWeight(id);

    return;
}