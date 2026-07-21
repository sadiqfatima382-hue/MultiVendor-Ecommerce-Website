import { createVendorConfigService, getVendorConfigService, updateVendorConfigService, } from "../services/vendorConfig.service.js";

// Create Vendor Config
export async function createVendorConfig(req, res, next) {
    try {
        const config = await createVendorConfigService(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Vendor configuration created successfully.",
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
// Get Vendor Config
export async function getVendorConfig(req, res, next) {
    try {
        const config = await getVendorConfigService(req.user.id);

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,

        });
    }
}

// Update Vendor Config
export async function updateVendorConfig(req, res, next) {
    try {
        const config = await updateVendorConfigService(
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Vendor configuration updated successfully.",
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}