import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";

import { createProductVariantSchema, updateProductVariantSchema, } from "../validators/auth/productVariant.validation.js";

import { createProductVariant, getProductVariants, getProductVariantById, updateProductVariant, deleteProductVariant, } from "../controllers/productVariant.controller.js";

const router = Router();

router.post("/create-product-variant", validate(createProductVariantSchema), createProductVariant);

router.get("/get-product-variants", getProductVariants);

router.get("/get-product-variant/:id", getProductVariantById);

router.put("/update-product-variant/:id", validate(updateProductVariantSchema), updateProductVariant);

router.delete("/delete-product-variant/:id", deleteProductVariant);

export default router;