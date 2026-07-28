import express from "express";
import { getVendorOrders, getVendorOrderById, updateVendorOrderStatus, } from "../controllers/vendorOrder.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateVendorOrderStatusSchema, } from "../validators/vendor/vendorOrder.validation.js";

const router = express.Router();

router.use(authenticate);

router.use(authorize("VENDOR"));

router.get("/", getVendorOrders);

router.get("/:id", getVendorOrderById);

router.patch("/:id/status", validate(updateVendorOrderStatusSchema), updateVendorOrderStatus);

export default router;