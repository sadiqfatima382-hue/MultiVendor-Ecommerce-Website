import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductTypeSchema, updateProductTypeSchema, } from "../validators/auth/productType.validation.js";
import { createProductType, getProductTypes, getProductTypeById, updateProductType, deleteProductType, } from "../controllers/productType.controller.js";

const router = express.Router();

router.post("/create", validate(createProductTypeSchema), createProductType);

router.get("/", getProductTypes);

router.get("/:id", getProductTypeById);

router.put("/:id", validate(updateProductTypeSchema), updateProductType);

router.delete("/:id", deleteProductType);

export default router;