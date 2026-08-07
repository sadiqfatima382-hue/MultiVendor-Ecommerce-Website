import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createComponentType, getComponentTypes, getComponentTypeById, updateComponentType, deleteComponentType, } from "../controllers/componentType.controller.js";
import { createComponentTypeSchema, updateComponentTypeSchema, componentTypeIdSchema, } from "../validators/website/componentType.validation.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createComponentTypeSchema),
    createComponentType
);

router.get(
    "/",
    getComponentTypes
);

router.get(
    "/:id",
    validate(componentTypeIdSchema),
    getComponentTypeById
);

router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(componentTypeIdSchema.merge(updateComponentTypeSchema)),
    updateComponentType
);

router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(componentTypeIdSchema),
    deleteComponentType
);

export default router;