import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";

import { createProductSchema, updateProductSchema, } from "../validators/auth/product.validation.js";

import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, } from "../controllers/product.controller.js";

const router = Router();

router.post("/create-product", validate(createProductSchema), createProduct);

router.get("/get-products", getProducts);

router.get("/get-product/:id", getProductById);

router.put("/update-product/:id", validate(updateProductSchema), updateProduct);

router.delete("/delete-product/:id", deleteProduct);

export default router;