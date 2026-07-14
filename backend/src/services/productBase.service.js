import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

import { findproductBaseById, findproductBaseByName, findproductBaseBySlug, createproductBase, findproductBases, countproductBases, updateproductBase, deleteproductBase, } from "../repositories/productBase.repository.js";

export async function createproductBaseService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();
    const slug = generateSlug(name);

    const existingproductBase = await findproductBaseByName(normalizedName);

    if (existingproductBase) {
        throw new Error("Product Base already exists.");
    }

    const existingSlug = await findproductBaseBySlug(slug);

    if (existingSlug) {
        throw new Error("Slug already exists.");
    }

    return createproductBase({
        name,
        slug,
    });
}

export async function getproductBasesService(query) {
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

    const [productBases, total] = await Promise.all([
        findproductBases({
            skip,
            take,
            where,
            orderBy,
        }),
        countproductBases(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productBases,
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

export async function getproductBaseByIdService(id) {
    const productBase = await findproductBaseById(id);

    if (!productBase) {
        throw new Error("Product Base not found.");
    }

    return productBase;
}

export async function updateproductBaseService(id, data) {
    const productBase = await findproductBaseById(id);

    if (!productBase) {
        throw new Error("Product Base not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();
        const slug = generateSlug(name);

        const existingproductBase = await findproductBaseByName(normalizedName);

        if (existingproductBase && existingproductBase.id !== id) {
            throw new Error("Product Base already exists.");
        }

        const existingSlug = await findproductBaseBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateproductBase(id, updateData);
}

export async function deleteproductBaseService(id) {
    const productBase = await findproductBaseById(id);

    if (!productBase) {
        throw new Error("Product Base not found.");
    }

    await deleteproductBase(id);

    return null;
}