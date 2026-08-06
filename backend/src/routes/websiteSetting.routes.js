import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createWebsiteSetting, getWebsiteSetting, updateWebsiteSetting, } from "../controllers/websiteSetting.controller.js";
import { createWebsiteSettingSchema, updateWebsiteSettingSchema, } from "../validators/website/websiteSetting.validation.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createWebsiteSettingSchema),
    createWebsiteSetting
);

router.get(
    "/",
    getWebsiteSetting
);

router.patch(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(updateWebsiteSettingSchema),
    updateWebsiteSetting
);

export default router;