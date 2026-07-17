import { findProductByName, findProductBySlug, findProductById, createProduct, findProducts, countProducts, updateProduct, deleteProduct, findCategoryById, findBrandById, findProductTypeById, findProductBaseById, findProductBadgeById, } from "../repositories/product.repository.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

export async function createProductService(data) {
    const { name, shortDescription, description, status = true, categoryId, brandId, typeId, baseId, badgeId, } = data;

    const trimmedName = name.trim();
    const normalizedName = trimmedName.toLowerCase();
    const slug = generateSlug(trimmedName);

    // Duplicate Name
    const existingProduct = await findProductByName(normalizedName);

    if (existingProduct) {
        throw new Error("Product already exists.");
    }

    // Duplicate Slug
    const existingSlug = await findProductBySlug(slug);

    if (existingSlug) {
        throw new Error("Product slug already exists.");
    }

    // Category
    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new Error("Category not found.");
    }

    // Product Type
    const type = await findProductTypeById(typeId);

    if (!type) {
        throw new Error("Product type not found.");
    }

    // Brand (Optional)
    if (brandId) {
        const brand = await findBrandById(brandId);

        if (!brand) {
            throw new Error("Product brand not found.");
        }
    }

    // Base (Optional)
    if (baseId) {
        const base = await findProductBaseById(baseId);

        if (!base) {
            throw new Error("Product base not found.");
        }
    }

    // Badge (Optional)
    if (badgeId) {
        const badge = await findProductBadgeById(badgeId);

        if (!badge) {
            throw new Error("Product badge not found.");
        }
    }

    return createProduct({ name: trimmedName, slug, shortDescription, description, status, categoryId, brandId, typeId, baseId, badgeId, });
}

export async function getProductsService(query) {
    const {
        search,
        status,
        categoryId,
        brandId,
        typeId,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

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

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (brandId) {
        where.brandId = brandId;
    }

    if (typeId) {
        where.typeId = typeId;
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
        findProducts({
            skip,
            take,
            where,
            orderBy,
        }),
        countProducts(where),
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

export async function getProductByIdService(id) {
    const product = await findProductById(id);

    if (!product) {
        throw new Error("Product not found.");
    }

    return product;
}

export async function updateProductService(id, data) {
    const product = await findProductById(id);

    if (!product) {
        throw new Error("Product not found.");
    }

    const updateData = { ...data };

    if (data.name) {
        const trimmedName = data.name.trim();
        const normalizedName = trimmedName.toLowerCase();
        const slug = generateSlug(trimmedName);

        const existingProduct = await findProductByName(normalizedName);

        if (existingProduct && existingProduct.id !== id) {
            throw new Error("Product already exists.");
        }

        const existingSlug = await findProductBySlug(slug);

        if (existingSlug && existingSlug.id !== id) {
            throw new Error("Product slug already exists.");
        }

        updateData.name = trimmedName;
        updateData.slug = slug;
    }

    if (data.categoryId) {
        const category = await findCategoryById(data.categoryId);

        if (!category) {
            throw new Error("Category not found.");
        }
    }

    if (data.typeId) {
        const type = await findProductTypeById(data.typeId);

        if (!type) {
            throw new Error("Product type not found.");
        }
    }

    if (data.brandId) {
        const brand = await findBrandById(data.brandId);

        if (!brand) {
            throw new Error("Product brand not found.");
        }
    }

    if (data.baseId) {
        const base = await findProductBaseById(data.baseId);

        if (!base) {
            throw new Error("Product base not found.");
        }
    }

    if (data.badgeId) {
        const badge = await findProductBadgeById(data.badgeId);

        if (!badge) {
            throw new Error("Product badge not found.");
        }
    }

    return updateProduct(id, updateData);
}

export async function deleteProductService(id) {
    const product = await findProductById(id);

    if (!product) {
        throw new Error("Product not found.");
    }

    await deleteProduct(id);

    return null;
}