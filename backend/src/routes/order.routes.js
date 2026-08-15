import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../validators/vendor/order.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createOrderSchema), createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.patch("/:orderId/status", authenticate, updateOrderStatus);
export default router;