import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createAdsBanner, getAdsBanners, getAdsBannerById, updateAdsBanner, deleteAdsBanner, } from "../controllers/adsBanner.controller.js";
import { createAdsBannerSchema, updateAdsBannerSchema, adsBannerIdSchema, } from "../validators/website/adsBanner.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

// Active advertisement banners
router.get(
    "/active",
    (req, res, next) => {
        req.query.publicOnly = "true";
        next();
    },
    getAdsBanners
);


// All advertisement banners
router.get(
    "/",
    getAdsBanners
);


// =====================================================
// ADMIN
// =====================================================

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(createAdsBannerSchema),
    createAdsBanner
);


// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    validate(adsBannerIdSchema),
    getAdsBannerById
);


// =====================================================
// UPDATE
// =====================================================

router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(
        adsBannerIdSchema.merge(
            updateAdsBannerSchema
        )
    ),
    updateAdsBanner
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(adsBannerIdSchema),
    deleteAdsBanner
);

export default router;