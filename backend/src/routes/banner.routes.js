import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createBanner, getBanners, getBannerById, updateBanner, deleteBanner, } from "../controllers/banner.controller.js";
import { createBannerSchema, updateBannerSchema, bannerIdSchema, } from "../validators/website/banner.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

// All banners / filtered banners
router.get(
    "/",
    getBanners
);

// Currently active banners
router.get(
    "/active",
    (req, res, next) => {
        req.query.publicOnly = "true";
        next();
    },
    getBanners
);


// =====================================================
// ADMIN
// =====================================================

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(createBannerSchema),
    createBanner
);

router.get(
    "/:id",
    validate(bannerIdSchema),
    getBannerById
);

router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(
        bannerIdSchema.merge(
            updateBannerSchema
        )
    ),
    updateBanner
);

router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(bannerIdSchema),
    deleteBanner
);

export default router;