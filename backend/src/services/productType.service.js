import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

import { findProductTypeById, findProductTypeByName, findProductTypeBySlug, createProductType, findProductTypes, countProductTypes, updateProductType, deleteProductType, } from "../repositories/productType.repository.js";

export async function createProductTypeService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();
    const slug = generateSlug(name);

    const existingProductType = await findProductTypeByName(normalizedName);

    if (existingProductType) {
        throw new Error("Product type already exists.");
    }

    const existingSlug = await findProductTypeBySlug(slug);

    if (existingSlug) {
        throw new Error("Slug already exists.");
    }

    return createProductType({
        name,
        slug,
    });
}

export async function getProductTypesService(query) {
    const {
        search,
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

    const [productTypes, total] = await Promise.all([
        findProductTypes({
            skip,
            take,
            where,
            orderBy,
        }),
        countProductTypes(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productTypes,
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

export async function getProductTypeByIdService(id) {
    const productType = await findProductTypeById(id);

    if (!productType) {
        throw new Error("Product type not found.");
    }

    return productType;
}

export async function updateProductTypeService(id, data) {
    const productType = await findProductTypeById(id);

    if (!productType) {
        throw new Error("Product type not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();
        const slug = generateSlug(name);

        const existingProductType = await findProductTypeByName(normalizedName);

        if (existingProductType && existingProductType.id !== id) {
            throw new Error("Product type already exists.");
        }

        const existingSlug = await findProductTypeBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateProductType(id, updateData);
}

export async function deleteProductTypeService(id) {
    const productType = await findProductTypeById(id);

    if (!productType) {
        throw new Error("Product type not found.");
    }

    await deleteProductType(id);

    return null;
}