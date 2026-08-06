import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, validateCoupon, } from "../controllers/coupon.controller.js";
import { createCouponSchema, updateCouponSchema, validateCouponSchema, } from "../validators/purchase/coupon.validation.js";

const router = express.Router();

router.post("/", authenticate, authorize("SUPER_ADMIN"), validate(createCouponSchema), createCoupon);

router.get("/", authenticate, authorize("SUPER_ADMIN"), getCoupons);

router.get("/:id", authenticate, authorize("SUPER_ADMIN"), getCouponById);

router.patch("/:id", authenticate, authorize("SUPER_ADMIN"), validate(updateCouponSchema), updateCoupon);

router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), deleteCoupon);

router.post("/validate", authenticate, validate(validateCouponSchema), validateCoupon);

export default router;