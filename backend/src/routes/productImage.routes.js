import { Router } from "express";
import  upload  from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductImageSchema, } from "../validators/auth/productImage.validation.js";
import { createProductImage, getProductImages, setPrimaryImage, deleteProductImage, } from "../controllers/productImage.controller.js";

const router = Router();

router.post("/upload", upload.single("image"), validate(createProductImageSchema), createProductImage);

router.get("/", getProductImages);

router.patch("/set-primary/:id", setPrimaryImage);

router.delete("/:id", deleteProductImage);

export default router;