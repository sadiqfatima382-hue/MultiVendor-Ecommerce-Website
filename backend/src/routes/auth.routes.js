import { Router } from "express";
import { register, getMe, refreshToken, logout } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema } from "../validators/auth/auth.validation.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { ROLES } from "../constants/auth/roles.js";
import { createCategory } from "../controllers/category.controller.js";
import { createCategorySchema } from "../validators/auth/category.validation.js";

const router = Router();
//Auth Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/admin", authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res) => { res.json({ success: true, message: "Welcome Admin", user: req.user, }); });
router.get('/me', authenticate, getMe);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post("/logout", validate(logoutSchema), logout);

//Products Route
router.post("/create-category",validate(createCategorySchema),createCategory);


export default router;