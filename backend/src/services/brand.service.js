import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";
import { createBrand, deleteBrand, findBrandById, findBrandByName, findBrandBySlug, findBrands, countBrands, updateBrand, } from "../repositories/brand.repository.js";

export async function createBrandService(data) {
    const name = data.name.trim();
    const normalizedName = name.toLowerCase();
    const slug = generateSlug(name);

    const existingBrand = await findBrandByName(normalizedName);

    if (existingBrand) {
        throw new Error("Brand already exists.");
    }

    const existingSlug = await findBrandBySlug(slug);

    if (existingSlug) {
        throw new Error("Slug already exists.");
    }

    return createBrand({
        ...data,
        name,
        slug,
    });
}

export async function getBrandsService(query) {
    const { search, status, sortBy = "createdAt", sortOrder = "desc" } = query;

    const { page, limit, skip, take } = getPagination(query);

    const where = {};

    if (search?.trim()) {
        where.OR = [
            {
                name: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
        ];
    }

    if (status !== undefined) {
        where.status = status === "true";
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

    const [brands, total] = await Promise.all([
        findBrands({
            skip,
            take,
            where,
            orderBy,
        }),
        countBrands(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        brands,
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

export async function getBrandByIdService(id) {
    const brand = await findBrandById(id);

    if (!brand) {
        throw new Error("Brand not found.");
    }

    return brand;
}

export async function updateBrandService(id, data) {
    const brand = await findBrandById(id);

    if (!brand) {
        throw new Error("Brand not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const name = data.name.trim();
        const normalizedName = name.toLowerCase();
        const slug = generateSlug(name);

        const existingBrand = await findBrandByName(normalizedName);

        if (existingBrand && existingBrand.id !== id) {
            throw new Error("Brand already exists.");
        }

        const existingSlug = await findBrandBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Slug already exists.");
        }

        updateData.name = name;
        updateData.slug = slug;
    }

    return updateBrand(id, updateData);
}

export async function deleteBrandService(id) {
    const brand = await findBrandById(id);

    if (!brand) {
        throw new Error("Brand not found.");
    }

    await deleteBrand(id);

    return null;
}