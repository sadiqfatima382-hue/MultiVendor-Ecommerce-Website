import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductWeightSchema, updateProductWeightSchema, } from "../validators/auth/productWeight.validation.js";
import { createProductWeight, getProductWeights, getProductWeightById, updateProductWeight, deleteProductWeight, } from "../controllers/productWeight.controller.js";

const router = express.Router();

router.post("/create", validate(createProductWeightSchema), createProductWeight);

router.get("/get", getProductWeights);

router.get("/:id", getProductWeightById);

router.put("/:id", validate(updateProductWeightSchema), updateProductWeight);

router.delete("/:id", deleteProductWeight);

export default router;