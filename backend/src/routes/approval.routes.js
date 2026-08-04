import express from "express"
import { approvePurchase, } from "../controllers/approval.controller.js";
import { approvePurchaseSchema, } from "../validators/purchase/purchase.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router=express.Router();
router.patch("/:id/approve", authenticate, authorize("SUPER_ADMIN", "EMPLOYEE"), validate(approvePurchaseSchema), approvePurchase);

export default router;