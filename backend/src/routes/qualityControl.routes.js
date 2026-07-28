import express from "express";

import {
  createQualityControl,
  getQualityControl,
  updateQualityControl,
} from "../controllers/qualityControl.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createQualityControlSchema,
  updateQualityControlSchema,
} from "../validations/qualityControl.validation.js";

const router = express.Router();

router.use(authenticate);

router.use(authorize("VENDOR"));

router.post(
  "/:vendorOrderId",
  validate(createQualityControlSchema),
  createQualityControl
);

router.get(
  "/:vendorOrderId",
  getQualityControl
);

router.patch(
  "/:vendorOrderId",
  validate(updateQualityControlSchema),
  updateQualityControl
);

export default router;