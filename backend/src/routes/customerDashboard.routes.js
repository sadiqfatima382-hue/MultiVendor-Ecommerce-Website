import { Router } from "express";
import { getCustomerDashboard } from "../controllers/customerDashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(  authenticate,  authorize("CUSTOMER"));

router.get("/", getCustomerDashboard);

export default router;