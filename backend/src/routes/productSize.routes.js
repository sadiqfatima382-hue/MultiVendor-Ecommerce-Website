import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSizeSchema, updateProductSizeSchema, } from "../validators/auth/productSize.validation.js";
import { createproductSize, getproductSizes, getproductSizeById, updateproductSize, deleteproductSize, } from "../controllers/productSize.controller.js";

const router = express.Router();

router.post("/create", validate(createProductSizeSchema), createproductSize);

router.get("/get", getproductSizes);

router.get("/:id", getproductSizeById);

router.put("/:id", validate(updateProductSizeSchema), updateproductSize);

router.delete("/:id", deleteproductSize);

export default router;