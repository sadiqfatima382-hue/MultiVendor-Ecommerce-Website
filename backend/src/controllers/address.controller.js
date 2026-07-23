import { createAddressService, getAddressesbyUserId, getAddressService, updateAddressService, deleteAddressService, setDefaultAddressService, } from "../services/address.service.js";

export async function createAddress(req, res) {
    try {
        const address = await createAddressService(
            req.user.id,
            req.validatedData
        );

        return res.status(201).json({
            success: true,
            message: "Address created successfully.",
            data: address,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getAddresses(req, res) {
    try {
        const addresses = await getAddressesService(req.user.id);

        return res.status(200).json({
            success: true,
            data: addresses,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getAddress(req, res) {
    try {
        const address = await getAddressService(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: address,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateAddress(req, res) {
    try {
        const address = await updateAddressService(
            req.user.id,
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            data: address,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteAddress(req, res) {
    try {
        const result = await deleteAddressService(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function setDefaultAddress(req, res) {
    try {
        const address = await setDefaultAddressService(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully.",
            data: address,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
}