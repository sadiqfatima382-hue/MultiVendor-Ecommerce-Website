import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart, } from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema, } from "../validators/vendor/cart.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(addToCartSchema), addToCart);

router.get("/", getCart);

router.patch("/:itemId", validate(updateCartItemSchema), updateCartItem);

router.delete("/:itemId", removeCartItem);

router.delete("/", clearCart);

export default router;