import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createApiConfig, getApiConfigs, getApiConfigById, getApiConfigByName, updateApiConfig, deleteApiConfig, } from "../controllers/apiConfig.controller.js";
import { createApiConfigSchema, updateApiConfigSchema, apiConfigIdSchema, apiConfigNameSchema, apiConfigQuerySchema, } from "../validators/website/apiConfig.validation.js";

const router = express.Router();


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(apiConfigQuerySchema),
    getApiConfigs
);


// =====================================================
// GET BY NAME
// =====================================================

// Put this before /:id
router.get(
    "/name/:name",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(apiConfigNameSchema),
    getApiConfigByName
);


// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(apiConfigIdSchema),
    getApiConfigById
);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createApiConfigSchema),
    createApiConfig
);


// =====================================================
// UPDATE
// =====================================================

router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        apiConfigIdSchema.merge(
            updateApiConfigSchema
        )
    ),
    updateApiConfig
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(apiConfigIdSchema),
    deleteApiConfig
);

export default router;