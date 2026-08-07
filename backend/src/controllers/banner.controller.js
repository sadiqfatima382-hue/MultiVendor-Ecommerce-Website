import { createBannerService, getBannersService, getBannerByIdService, updateBannerService, deleteBannerService, } from "../services/banner.service.js";

export async function createBanner(req, res) {
    try {
        const banner = await createBannerService(
            req.validatedData.body,
            req.file
        );

        return res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            data: banner,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getBanners(req, res) {
    try {
        const result = await getBannersService({
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            position: req.query.position,
            isActive: req.query.isActive,
            publicOnly: req.query.publicOnly,
        });

        return res.status(200).json({
            success: true,
            data: result.banners,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getBannerById(req, res) {
    try {
        const banner =
            await getBannerByIdService(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: banner,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateBanner(req, res) {
    try {
        const banner =
            await updateBannerService(
                req.params.id,
                req.body,
                req.file
            );

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            data: banner,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteBanner(req, res) {
    try {
        await deleteBannerService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}