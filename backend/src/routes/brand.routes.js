import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createBrandSchema, updateBrandSchema, } from "../validators/auth/brand.validation.js";
import { createBrand, getBrands, getBrandById, updateBrand, deleteBrand, } from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", validate(createBrandSchema), createBrand);

router.get("/", getBrands);

router.get("/:id", getBrandById);

router.put("/:id", validate(updateBrandSchema), updateBrand);

router.delete("/:id", deleteBrand);

export default router;