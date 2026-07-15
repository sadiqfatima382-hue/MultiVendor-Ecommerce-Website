import { createBrandService, getBrandsService, getBrandByIdService, updateBrandService, deleteBrandService, } from "../services/brand.service.js";

export async function createBrand(req, res, next) {
    try {
        const brand = await createBrandService(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "Brand created successfully.",
            data: brand,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: brand,
        });
    }
}

export async function getBrands(req, res, next) {
    try {
        const result = await getBrandsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Brands fetched successfully.",
            data: result.brands,
            pagination: result.pagination,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: result.brands,
            pagination: result.pagination,
        });
    }
}

export async function getBrandById(req, res, next) {
    try {
        const brand = await getBrandByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Brand fetched successfully.",
            data: brand,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
            data: brand,
        });
    }
}

export async function updateBrand(req, res, next) {
    try {
        const brand = await updateBrandService(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully.",
            data: brand,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: brand,
        });
    }
}

export async function deleteBrand(req, res, next) {
    try {
        await deleteBrandService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully.",
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}