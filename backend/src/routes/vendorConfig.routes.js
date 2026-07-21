import express from "express";
import { createVendorConfig, getVendorConfig, updateVendorConfig, } from "../controllers/vendorConfig.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createVendorConfigSchema, updateVendorConfigSchema, } from "../validators/vendor/vendorConfig.validation.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize("VENDOR"));

// Create Vendor Config
router.post(
    "/",
    validate(createVendorConfigSchema),
    createVendorConfig
);

// Get Vendor Config
router.get("/", getVendorConfig);

// Update Vendor Config
router.put(
    "/",
    validate(updateVendorConfigSchema),
    updateVendorConfig
);

export default router;