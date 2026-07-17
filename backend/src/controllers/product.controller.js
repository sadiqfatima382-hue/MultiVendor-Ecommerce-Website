import { createProductService, getProductsService, getProductByIdService, updateProductService, deleteProductService, } from "../services/product.service.js";

export async function createProduct(req, res, next) {
    try {
        const product = await createProductService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: product,
        });
    }
}

export async function getProducts(req, res, next) {
    try {
        const products = await getProductsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: products,
        });
    }
}

export async function getProductById(req, res, next) {
    try {
        const product = await getProductByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: product,
        });
    }
}

export async function updateProduct(req, res, next) {
    try {
        const product = await updateProductService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: product,
        });
    }
}

export async function deleteProduct(req, res, next) {
    try {
        await deleteProductService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}