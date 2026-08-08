import { createAdsBannerService, getAdsBannersService, getAdsBannerByIdService, updateAdsBannerService, deleteAdsBannerService, } from "../services/adsBanner.service.js";

// CREATE
export async function createAdsBanner(req, res) {
    try {
        const adsBanner =
            await createAdsBannerService(
                req.validatedData.body,
                req.file
            );

        return res.status(201).json({
            success: true,
            message:
                "Advertisement banner created successfully.",
            data: adsBanner,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// GET ALL
export async function getAdsBanners(req, res) {
    try {
        const result =
            await getAdsBannersService({
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                position: req.query.position,
                isActive: req.query.isActive,
                publicOnly: req.query.publicOnly,
            });

        return res.status(200).json({
            success: true,
            data: result.adsBanners,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// GET BY ID
export async function getAdsBannerById(req, res) {
    try {
        const adsBanner =
            await getAdsBannerByIdService(
                req.validatedData.params.id
            );

        return res.status(200).json({
            success: true,
            data: adsBanner,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

// UPDATE
export async function updateAdsBanner(req, res) {
    try {
        const adsBanner =
            await updateAdsBannerService(
                req.validatedData.params.id,
                req.validatedData.body,
                req.file
            );

        return res.status(200).json({
            success: true,
            message:
                "Advertisement banner updated successfully.",
            data: adsBanner,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// DELETE
export async function deleteAdsBanner(req, res) {
    try {
        await deleteAdsBannerService(
            req.validatedData.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Advertisement banner deleted successfully.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}