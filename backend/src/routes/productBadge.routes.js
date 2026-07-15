import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductBadgeSchema, updateProductBadgeSchema, } from "../validators/auth/productBadge.validation.js";
import { createproductBadge, getproductBadges, getproductBadgeById, updateproductBadge, deleteproductBadge, } from "../controllers/productBadge.controller.js";

const router = express.Router();

router.post("/create", validate(createProductBadgeSchema), createproductBadge);

router.get("/get", getproductBadges);

router.get("/:id", getproductBadgeById);

router.put("/:id", validate(updateProductBadgeSchema), updateproductBadge);

router.delete("/:id", deleteproductBadge);

export default router;