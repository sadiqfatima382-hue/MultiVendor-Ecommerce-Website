import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getAdminDashboard } from "../controllers/adminDashboard.controller.js";

const router = Router();

router.get("/", authenticate, authorize("SUPER_ADMIN"), getAdminDashboard);

export default router;