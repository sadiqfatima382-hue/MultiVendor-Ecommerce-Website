import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createVendorSchema, updateVendorSchema, } from "../validators/vendor/vendor.validation.js";
import { createVendor, getVendors, getVendorById, updateVendor, deleteVendor, } from "../controllers/vendor.controller.js";

const router = Router();

router.post("/create-vendor", validate(createVendorSchema), createVendor);

router.get("/", getVendors);

router.get("/:id", getVendorById);

router.put("/:id", validate(updateVendorSchema), updateVendor);

router.delete("/:id", deleteVendor);

export default router;