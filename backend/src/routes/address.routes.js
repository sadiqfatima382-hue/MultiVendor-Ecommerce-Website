import express from "express";
import { createAddress, getAddresses, getAddress, updateAddress, deleteAddress, setDefaultAddress, } from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema, } from "../validators/vendor/address.validation.js";

const router = express.Router();

router.use(authenticate);

// Create
router.post("/", validate(createAddressSchema), createAddress);

// Get all
router.get("/", getAddresses);

// Get one
router.get("/:id", getAddress);

// Update
router.patch("/:id", validate(updateAddressSchema), updateAddress);

// Delete
router.delete("/:id", deleteAddress);

// Set default
router.patch("/:id/default", setDefaultAddress);

export default router;