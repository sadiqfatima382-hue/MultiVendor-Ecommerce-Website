import { createVendorConfig, findVendorConfigByVendorId, updateVendorConfig, } from "../repositories/vendorConfig.repository.js";
import { findVendorByOwnerId } from "../repositories/vendor.repository.js";

export async function createVendorConfigService(userId, data) {
    // Find vendor of logged-in user
    const vendor = await findVendorByOwnerId(userId);

    if (!vendor) {
        throw new Error("Vendor not found.");
    }

    // Check existing config
    const existingConfig = await findVendorConfigByVendorId(vendor.id);

    if (existingConfig) {
        throw new Error("Vendor configuration already exists.");
    }

    return createVendorConfig({
        ...data,
        vendorId: vendor.id,
    });
}

export async function getVendorConfigService(userId) {
    const vendor = await findVendorByOwnerId(userId);

    if (!vendor) {
        throw new Error("Vendor not found.");
    }

    const config = await findVendorConfigByVendorId(vendor.id);

    if (!config) {
        throw new Error("Vendor configuration not found.");
    }

    return config;
}

export async function updateVendorConfigService(userId, data) {
    const vendor = await findVendorByOwnerId(userId);

    if (!vendor) {
        throw new Error("Vendor not found.");
    }

    const existingConfig = await findVendorConfigByVendorId(vendor.id);

    if (!existingConfig) {
        throw new Error("Vendor configuration not found.");
    }

    return updateVendorConfig(vendor.id, data);
}