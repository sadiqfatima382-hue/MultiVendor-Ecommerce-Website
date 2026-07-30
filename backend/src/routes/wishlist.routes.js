import { Router } from "express";
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist, getWishlistCount, } from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productIdSchema } from "../validators/vendor/wishlist.validation.js";

const router = Router();

router.use(authenticate, authorize("CUSTOMER"));

router.get("/", getWishlist);

router.get("/count", getWishlistCount);

router.get("/check/:productId", validate(productIdSchema), checkWishlist);

router.post("/:productId", validate(productIdSchema), addToWishlist);

router.delete("/:productId", validate(productIdSchema), removeFromWishlist);

export default router;