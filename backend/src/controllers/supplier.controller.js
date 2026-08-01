import { createSupplierService, getSuppliersService, getSupplierByIdService, updateSupplierService, deleteSupplierService, } from "../services/supplier.service.js";

export async function createSupplier(req, res, next) {
    try {
        const supplier = await createSupplierService(
            req.user,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Supplier created successfully.",
            data: supplier,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getSuppliers(req, res, next) {
    try {
        const data = await getSuppliersService(
            req.user,
            req.query
        );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getSupplierById(req, res, next) {
    try {
        const supplier = await getSupplierByIdService(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: supplier,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateSupplier(req, res, next) {
    try {
        const supplier = await updateSupplierService(
            req.user,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Supplier updated successfully.",
            data: supplier,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteSupplier(req, res, next) {
    try {
        await deleteSupplierService(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Supplier deleted successfully.",
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}