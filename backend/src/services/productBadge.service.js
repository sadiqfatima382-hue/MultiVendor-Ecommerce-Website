import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

import { findproductBadgeById, findproductBadgeByName, findproductBadgeBySlug, createproductBadge, findproductBadges, countproductBadges, updateproductBadge, deleteproductBadge, } from "../repositories/productBadge.repository.js";

export async function createproductBadgeService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();
    const slug = generateSlug(name);

    const existingproductBadge = await findproductBadgeByName(normalizedName);

    if (existingproductBadge) {
        throw new Error("Product Badge already exists.");
    }

    const existingSlug = await findproductBadgeBySlug(slug);

    if (existingSlug) {
        throw new Error("Slug already exists.");
    }

    return createproductBadge({
        name,
        slug,
        color: data.color,
    });
}

export async function getproductBadgesService(query) {
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

    const [productBadges, total] = await Promise.all([
        findproductBadges({
            skip,
            take,
            where,
            orderBy,
        }),
        countproductBadges(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productBadges,
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

export async function getproductBadgeByIdService(id) {
    const productBadge = await findproductBadgeById(id);

    if (!productBadge) {
        throw new Error("Product Badge not found.");
    }

    return productBadge;
}

export async function updateproductBadgeService(id, data) {
    const productBadge = await findproductBadgeById(id);

    if (!productBadge) {
        throw new Error("Product Badge not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();
        const slug = generateSlug(name);

        const existingproductBadge = await findproductBadgeByName(normalizedName);

        if (existingproductBadge && existingproductBadge.id !== id) {
            throw new Error("Product Badge already exists.");
        }

        const existingSlug = await findproductBadgeBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateproductBadge(id, updateData);
}

export async function deleteproductBadgeService(id) {
    const productBadge = await findproductBadgeById(id);

    if (!productBadge) {
        throw new Error("Product Badge not found.");
    }

    await deleteproductBadge(id);

    return null;
}