import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import  upload  from "../middlewares/upload.middleware.js";
import { createWebsiteIcon, getWebsiteIcons, getWebsiteIconByType, updateWebsiteIcon, deleteWebsiteIcon, } from "../controllers/websiteIcon.controller.js";
import { createWebsiteIconSchema, updateWebsiteIconSchema, } from "../validators/website/websiteIcon.validation.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(createWebsiteIconSchema),
    createWebsiteIcon
);

router.get(
    "/",
    getWebsiteIcons
);

router.get(
    "/:type",
    getWebsiteIconByType
);

router.patch(
    "/:type",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("image"),
    validate(updateWebsiteIconSchema),
    updateWebsiteIcon
);

router.delete(
    "/:type",
    authenticate,
    authorize("SUPER_ADMIN"),
    deleteWebsiteIcon
);

export default router;