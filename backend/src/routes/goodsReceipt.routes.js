import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { receivePurchase } from "../controllers/goodsReceipt.controller.js";
import { receivePurchaseSchema } from "../validators/purchase/goodsReceipt.validation.js";

const route = express.Router();
router.post("/:id/receive", authenticate, authorize("SUPER_ADMIN", "EMPLOYEE"), validate(receivePurchaseSchema), receivePurchase);

export default router;