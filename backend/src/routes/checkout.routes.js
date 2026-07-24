import express from "express";
import { getCheckoutSummary, validateCheckout, } from "../controllers/checkout.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateCheckoutSchema, } from "../validators/vendor/checkout.validation.js";

const router = express.Router();

router.use(authenticate);

// Checkout summary
router.get("/", getCheckoutSummary);

// Final validation before payment
router.post("/validate", validate(validateCheckoutSchema), validateCheckout);

export default router;