import { getPagination } from "../utils/pagination.js";
import { findproductColorById, findproductColorByName, createproductColor, findproductColors, countproductColors, updateproductColor, deleteproductColor, } from "../repositories/productColor.repository.js";

export async function createproductColorService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();

    const existingproductColor = await findproductColorByName(normalizedName);

    if (existingproductColor) {
        throw new Error("Product Color already exists.");
    }

    return createproductColor({
        name,
        hexCode: data.hexCode,
    });
}

export async function getproductColorsService(query) {
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

    const [productColors, total] = await Promise.all([
        findproductColors({
            skip,
            take,
            where,
            orderBy,
        }),
        countproductColors(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productColors,
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

export async function getproductColorByIdService(id) {
    const productColor = await findproductColorById(id);

    if (!productColor) {
        throw new Error("Product Color not found.");
    }

    return productColor;
}

export async function updateproductColorService(id, data) {
    const productColor = await findproductColorById(id);

    if (!productColor) {
        throw new Error("Product Color not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();

        const existingproductColor = await findproductColorByName(normalizedName);

        if (existingproductColor && existingproductColor.id !== id) {
            throw new Error("Product Color already exists.");
        }

        const existingSlug = await findproductColorBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateproductColor(id, updateData);
}

export async function deleteproductColorService(id) {
    const productColor = await findproductColorById(id);

    if (!productColor) {
        throw new Error("Product Color not found.");
    }

    await deleteproductColor(id);

    return null;
}