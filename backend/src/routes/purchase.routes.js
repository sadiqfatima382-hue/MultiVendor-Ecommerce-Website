import express from "express";
import { createPurchase, updatePurchase, deletePurchase, addPurchaseItem, updatePurchaseItem, removePurchaseItem, submitPurchase, } from "../controllers/purchase.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import { createPurchaseSchema, updatePurchaseSchema, addPurchaseItemSchema, updatePurchaseItemSchema, submitPurchaseSchema, } from "../validators/purchase/purchase.validation.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/authorize.middleware.js";

const router = express.Router();
//purchase routes
router.post(  "/",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  validate(createPurchaseSchema),  createPurchase);
router.patch(  "/:id",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  validate(updatePurchaseSchema),  updatePurchase);
router.delete(  "/:id",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  deletePurchase);
router.patch(  "/:id/submit",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  validate(submitPurchaseSchema),  submitPurchase);

//purchase items routes
router.post(  "/:id/items",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  validate(addPurchaseItemSchema),  addPurchaseItem);
router.patch(  "/items/:id",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  validate(updatePurchaseItemSchema),  updatePurchaseItem);
router.delete(  "/items/:id",  authenticate,  authorize("SUPER_ADMIN", "VENDOR"),  removePurchaseItem);

export default router;