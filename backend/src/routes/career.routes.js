import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createCareer, getCareers, getCareerById, getCareerBySlug, updateCareer, publishCareer, unpublishCareer, setCareerActive, deleteCareer, } from "../controllers/career.controller.js";
import { createCareerSchema, updateCareerSchema, careerIdSchema, careerSlugSchema, careerQuerySchema, careerActiveSchema, } from "../validators/website/career.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

// Public career listing
router.get(
    "/public",
    validate(careerQuerySchema),
    (req, res, next) => {
        req.validatedData.query.publicOnly = true;
        next();
    },
    getCareers
);


// Public career by slug
router.get(
    "/slug/:slug",
    validate(careerSlugSchema),
    getCareerBySlug
);


// =====================================================
// ADMIN
// =====================================================

// Create
router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createCareerSchema),
    createCareer
);


// Get all
router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerQuerySchema),
    getCareers
);


// Get by ID
router.get(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerIdSchema),
    getCareerById
);


// Update
router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(updateCareerSchema),
    updateCareer
);


// Publish
router.patch(
    "/:id/publish",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerIdSchema),
    publishCareer
);


// Unpublish
router.patch(
    "/:id/unpublish",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerIdSchema),
    unpublishCareer
);


// Open / close
router.patch(
    "/:id/active",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerActiveSchema),
    setCareerActive
);


// Delete
router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(careerIdSchema),
    deleteCareer
);


export default router;