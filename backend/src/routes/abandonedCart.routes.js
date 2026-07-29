import express from "express";
import { getAbandonedCarts } from "../controllers/abandonedCart.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

router.use(authorize("SUPER_ADMIN","ADMIN"));

router.get(
  "/",
  authorize("SUPER_ADMIN", "ADMIN"),
  getAbandonedCarts
);

export default router;