import express from "express";
import { createInvoice, getInvoiceById, getInvoiceByOrder, } from "../controllers/invoice.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authenticate);

router.post("/order/:orderId", createInvoice);

router.get("/:id", getInvoiceById);

router.get("/order/:orderId", getInvoiceByOrder);

export default router;