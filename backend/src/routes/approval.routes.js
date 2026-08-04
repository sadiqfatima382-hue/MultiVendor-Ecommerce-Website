import express from "express"
import { approvePurchase, } from "../controllers/approval.controller.js";
import { approvePurchaseSchema, } from "../validators/purchase/purchase.validation.js";

router=express.Router
router.patch("/:id/approve", authenticate, authorize("SUPER_ADMIN", "EMPLOYEE"), validate(approvePurchaseSchema), approvePurchase);

export default router;