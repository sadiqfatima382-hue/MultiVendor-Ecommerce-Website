import { addToWishlistService, removeWishlistService, getWishlistService, checkWishlistService, getWishlistCountService, } from "../services/wishlist.service.js";

export async function addToWishlist(req, res, next) {
    try {
        const data = await addToWishlistService(
            req.user.id,
            req.params.productId
        );

        return res.status(201).json({
            success: true,
            message: data.message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
    });
}}

export async function removeFromWishlist(req, res, next) {
    try {
        const data = await removeWishlistService(
            req.user.id,
            req.params.productId
        );

        return res.status(200).json({
            success: true,
            message: data.message,
        });
    } catch (error) {
      return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getWishlist(req, res, next) {
    try {
        const data = await getWishlistService(
            req.user.id,
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

export async function checkWishlist(req, res, next) {
    try {
        const data = await checkWishlistService(
            req.user.id,
            req.params.productId
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

export async function getWishlistCount(req, res, next) {
    try {
        const data = await getWishlistCountService(
            req.user.id
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