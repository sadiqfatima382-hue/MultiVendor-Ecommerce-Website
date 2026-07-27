import express from "express";
import { createPayment, getPaymentById, getPaymentByOrder, } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPaymentSchema, } from "../validators/vendor/payment.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createPaymentSchema), createPayment);

router.get("/:id", getPaymentById);

router.get("/order/:orderId", getPaymentByOrder);

export default router;