import { getPagination } from "../utils/pagination.js";
import { findproductSizeById, findproductSizeByName, createproductSize, findproductSizes, countproductSizes, updateproductSize, deleteproductSize, } from "../repositories/productSize.repository.js";

export async function createproductSizeService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();

    const existingproductSize = await findproductSizeByName(normalizedName);

    if (existingproductSize) {
        throw new Error("Product Size already exists.");
    }

    return createproductSize({
        name,
    });
}

export async function getproductSizesService(query) {
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

    const [productSizes, total] = await Promise.all([
        findproductSizes({
            skip,
            take,
            where,
            orderBy,
        }),
        countproductSizes(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productSizes,
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

export async function getproductSizeByIdService(id) {
    const productSize = await findproductSizeById(id);

    if (!productSize) {
        throw new Error("Product Size not found.");
    }

    return productSize;
}

export async function updateproductSizeService(id, data) {
    const productSize = await findproductSizeById(id);

    if (!productSize) {
        throw new Error("Product Size not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();

        const existingproductSize = await findproductSizeByName(normalizedName);

        if (existingproductSize && existingproductSize.id !== id) {
            throw new Error("Product Size already exists.");
        }

        const existingSlug = await findproductSizeBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateproductSize(id, updateData);
}

export async function deleteproductSizeService(id) {
    const productSize = await findproductSizeById(id);

    if (!productSize) {
        throw new Error("Product Size not found.");
    }

    await deleteproductSize(id);

    return null;
}