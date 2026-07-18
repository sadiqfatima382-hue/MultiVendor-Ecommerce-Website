import { createproductBadgeService, getproductBadgesService, getproductBadgeByIdService, updateproductBadgeService, deleteproductBadgeService, } from "../services/productBadge.service.js";

export async function createproductBadge(req, res, next) {
    try {
        const productBadge = await createproductBadgeService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product badge created successfully.",
            data: productBadge,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
           
        });
    }
}

export async function getproductBadges(req, res, next) {
    try {
        const result = await getproductBadgesService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product badge fetched successfully.",
            data: result.productBadges,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
           
        });
    }
}

export async function getproductBadgeById(req, res, next) {
    try {
        const productBadge = await getproductBadgeByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product badge fetched successfully.",
            data: productBadge,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function updateproductBadge(req, res, next) {
    try {
        const productBadge = await updateproductBadgeService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product badge updated successfully.",
            data: productBadge,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function deleteproductBadge(req, res, next) {
    try {
        await deleteproductBadgeService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product badge deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}