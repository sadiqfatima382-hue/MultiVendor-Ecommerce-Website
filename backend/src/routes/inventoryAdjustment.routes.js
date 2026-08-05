import express from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/authorize.middleware.js";
import {validate} from "../middlewares/validate.middleware.js";
import { createInventoryAdjustment } from "../controllers/inventoryAdjustment.controller.js";
import { createInventoryAdjustmentSchema } from "../validators/purchase/inventoryAdjustment.validation.js";

const router = express.Router();

router.post("/", authenticate, authorize("SUPER_ADMIN", "EMPLOYEE"), validate(createInventoryAdjustmentSchema), createInventoryAdjustment);

export default router;