import { createproductSizeService, getproductSizesService, getproductSizeByIdService, updateproductSizeService, deleteproductSizeService, } from "../services/productSize.service.js";

export async function createproductSize(req, res, next) {
    try {
        const productSize = await createproductSizeService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Product Size created successfully.",
            data: productSize,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getproductSizes(req, res, next) {
    try {
        const result = await getproductSizesService(req.query);

        return res.status(200).json({
            success: true,
            message: "Product Size fetched successfully.",
            data: result.productSizes,
            pagination: result.pagination,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
           
    });
}
}

export async function getproductSizeById(req, res, next) {
    try {
        const productSize = await getproductSizeByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product Size fetched successfully.",
            data: productSize,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function updateproductSize(req, res, next) {
    try {
        const productSize = await updateproductSizeService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Product Size updated successfully.",
            data: productSize,
        });
    } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
}

export async function deleteproductSize(req, res, next) {
    try {
        await deleteproductSizeService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product Size deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}