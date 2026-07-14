import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductBaseSchema, updateProductBaseSchema, } from "../validators/auth/productBase.validation.js";
import { createproductBase, getproductBases, getproductBaseById, updateproductBase, deleteproductBase, } from "../controllers/productBase.controller.js";

const router = express.Router();

router.post("/create", validate(createProductBaseSchema), createproductBase);

router.get("/", getproductBases);

router.get("/:id", getproductBaseById);

router.put("/:id", validate(updateProductBaseSchema), updateproductBase);

router.delete("/:id", deleteproductBase);

export default router;