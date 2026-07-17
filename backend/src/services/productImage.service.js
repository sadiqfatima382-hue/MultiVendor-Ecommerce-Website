import { findProductImageById, createProductImage, findProductImages, countProductImages, updateProductImage, deleteProductImage, findProductById, clearPrimaryImage, } from "../repositories/productImage.repository.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../utils/cloudinary.js";
import { getPagination } from "../utils/pagination.js";

export async function createProductImageService(file, data) {
    if (!file) {
        throw new Error("Image is required.");
    }

    const { productId, isPrimary = false } = data;

    const product = await findProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    const uploadedImage = await uploadImageToCloudinary(file.buffer);

    if (isPrimary) {
        await clearPrimaryImage(productId);
    }

    return createProductImage({
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        productId,
        isPrimary,
    });
}

export async function getProductImagesService(query) {
    const {
        productId,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const { page, limit, skip, take } = getPagination(query);

    const where = {};

    if (productId) {
        where.productId = productId;
    }

    const allowedSortFields = [
        "createdAt",
        "isPrimary",
    ];

    const orderBy = {
        [allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
    };

    const [images, total] = await Promise.all([
        findProductImages({
            skip,
            take,
            where,
            orderBy,
        }),
        countProductImages(where),
    ]);

    return {
        images,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1,
        },
    };
}

export async function setPrimaryImageService(id) {
    const image = await findProductImageById(id);

    if (!image) {
        throw new Error("Image not found.");
    }

    await clearPrimaryImage(image.productId);

    return updateProductImage(id, {
        isPrimary: true,
    });
}

export async function deleteProductImageService(id) {
    const image = await findProductImageById(id);

    if (!image) {
        throw new Error("Image not found.");
    }

    if (image.publicId) {
        await deleteImageFromCloudinary(image.publicId);
    }

    await deleteProductImage(id);

    return null;
}