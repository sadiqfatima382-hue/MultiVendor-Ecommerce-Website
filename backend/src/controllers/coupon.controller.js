import { createCouponService, getCouponsService, getCouponByIdService, updateCouponService, deleteCouponService, validateCouponService, } from "../services/coupon.service.js";

export async function createCoupon(req, res) {
    try {
        const coupon = await createCouponService(req.body);

        res.status(201).json({
            success: true,
            message: "Coupon created successfully.",
            data: coupon,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getCoupons(req, res) {
    try {
        const data = await getCouponsService(req.query);

        res.json({
            success: true,
            ...data,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getCouponById(req, res) {
    try {
        const coupon = await getCouponByIdService(req.params.id);

        res.json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateCoupon(req, res) {
    try {
        const coupon = await updateCouponService(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: "Coupon updated successfully.",
            data: coupon,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteCoupon(req, res) {
    try {
        await deleteCouponService(req.params.id);

        res.json({
            success: true,
            message: "Coupon deleted successfully.",
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export async function validateCoupon(req, res) {
    try {
        const result = await validateCouponService(
            req.user,
            req.body
        );

        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}