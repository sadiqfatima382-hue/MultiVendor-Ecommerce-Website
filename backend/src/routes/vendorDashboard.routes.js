import express from "express";
import { getDashboardStats, getVendorProducts, getVendorProduct, getLowStockProducts, getOutOfStockProducts, submitProduct, } from "../controllers/vendorDashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize("VENDOR"));

// Dashboard
router.get("/", getDashboardStats);

// Products
router.get("/products", getVendorProducts);
router.get("/products/low-stock", getLowStockProducts);
router.get("/products/out-of-stock", getOutOfStockProducts);
router.get("/products/:id", getVendorProduct);

// Submit product for approval
router.patch("/products/:id/submit", submitProduct);

export default router;