import { createproductColorService, getproductColorsService, getproductColorByIdService, updateproductColorService, deleteproductColorService, } from "../services/productColor.service.js";

export async function createproductColor(req, res, next) {
    try {
        const productColor = await createproductColorService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product Color created successfully.",
            data: productColor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getproductColors(req, res, next) {
    try {
        const result = await getproductColorsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product Color fetched successfully.",
            data: result.productColors,
            pagination: result.pagination,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: result.productColors,
            pagination: result.pagination,
    });
}
}

export async function getproductColorById(req, res, next) {
    try {
        const productColor = await getproductColorByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product Color fetched successfully.",
            data: productColor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: productColor,
        });
    }
}

export async function updateproductColor(req, res, next) {
    try {
        const productColor = await updateproductColorService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product Color updated successfully.",
            data: productColor,
        });
    } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
            data: productColor,
        });
    }
}

export async function deleteproductColor(req, res, next) {
    try {
        await deleteproductColorService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product Color deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}