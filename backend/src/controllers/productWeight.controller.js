import { createProductWeightService, getProductWeightsService, getProductWeightByIdService, updateProductWeightService, deleteProductWeightService, } from "../services/productWeight.service.js";

export async function createProductWeight(req, res, next) {
    try {
        const productWeight = await createProductWeightService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product weight created successfully.",
            data: productWeight,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: productWeight,
        });
    }
}

export async function getProductWeights(req, res, next) {
    try {
        const result = await getProductWeightsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product weights fetched successfully.",
            data: result.productWeights,
            pagination: result.pagination,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: result.productWeights,
            pagination: result.pagination,
        });
    }
}

export async function getProductWeightById(req, res, next) {
    try {
        const productWeight = await getProductWeightByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product weight fetched successfully.",
            data: productWeight,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: productWeight,
        });
    }
}

export async function updateProductWeight(req, res, next) {
    try {
        const productWeight = await updateProductWeightService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product weight updated successfully.",
            data: productWeight,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: productWeight,
        });
    }
}

export async function deleteProductWeight(req, res, next) {
    try {
        await deleteProductWeightService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product weight deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}