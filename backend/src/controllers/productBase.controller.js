import { createproductBaseService, getproductBasesService, getproductBaseByIdService, updateproductBaseService, deleteproductBaseService, } from "../services/productBase.service.js";

export async function createproductBase(req, res, next) {
    try {
        const productBase = await createproductBaseService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product base created successfully.",
            data: productBase,
        });
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function getproductBases(req, res, next) {
    try {
        const result = await getproductBasesService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product base fetched successfully.",
            data: result.productBases,
            pagination: result.pagination,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function getproductBaseById(req, res, next) {
    try {
        const productBase = await getproductBaseByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product base fetched successfully.",
            data: productBase,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
           
        });
    }
}

export async function updateproductBase(req, res, next) {
    try {
        const productBase = await updateproductBaseService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product base updated successfully.",
            data: productBase,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function deleteproductBase(req, res, next) {
    try {
        await deleteproductBaseService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product base deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}