import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductColorSchema, updateProductColorSchema, } from "../validators/auth/productColor.validation.js";
import { createproductColor, getproductColors, getproductColorById, updateproductColor, deleteproductColor, } from "../controllers/productColor.controller.js";

const router = express.Router();

router.post("/create", validate(createProductColorSchema), createproductColor);

router.get("/get", getproductColors);

router.get("/:id", getproductColorById);

router.put("/:id", validate(updateProductColorSchema), updateproductColor);

router.delete("/:id", deleteproductColor);

export default router;