import { createProductTypeService, getProductTypesService, getProductTypeByIdService, updateProductTypeService, deleteProductTypeService, } from "../services/productType.service.js";

export async function createProductType(req, res, next) {
    try {
        const productType = await createProductTypeService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product type created successfully.",
            data: productType,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: productType,
        });
    }
}

export async function getProductTypes(req, res, next) {
    try {
        const result = await getProductTypesService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product types fetched successfully.",
            data: result.productTypes,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: result.productTypes,
            pagination: result.pagination,
        });
    }
}

export async function getProductTypeById(req, res, next) {
    try {
        const productType = await getProductTypeByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product type fetched successfully.",
            data: productType,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: productType,
        });
    }
}

export async function updateProductType(req, res, next) {
    try {
        const productType = await updateProductTypeService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product type updated successfully.",
            data: productType,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: productType,
        });
    }
}

export async function deleteProductType(req, res, next) {
    try {
        await deleteProductTypeService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product type deleted successfully.",
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}