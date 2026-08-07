import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createHomePage, getHomePages, getHomePageById, updateHomePage, deleteHomePage, getHomePageComponents, addHomePageComponent, updateHomePageComponent, deleteHomePageComponent, } from "../controllers/homePage.controller.js";
import { createHomePageSchema, updateHomePageSchema, homePageIdSchema, addHomePageComponentSchema, updateHomePageComponentSchema, homePageIdParamSchema, homePageComponentIdSchema, } from "../validators/website/homePage.validation.js";

const router = express.Router();


// =====================================================
// HOME PAGE CRUD
// =====================================================

router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createHomePageSchema),
    createHomePage
);


router.get(
    "/",
    getHomePages
);


router.get(
    "/:id",
    validate(homePageIdSchema),
    getHomePageById
);


router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        homePageIdSchema.merge(
            updateHomePageSchema
        )
    ),
    updateHomePage
);


router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(homePageIdSchema),
    deleteHomePage
);


// =====================================================
// HOME PAGE COMPONENTS
// =====================================================

router.get(
    "/:homePageId/components",
    validate(homePageIdParamSchema),
    getHomePageComponents
);


router.post(
    "/:homePageId/components",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        homePageIdParamSchema.merge(
            addHomePageComponentSchema
        )
    ),
    addHomePageComponent
);


// =====================================================
// COMPONENT UPDATE / DELETE
// =====================================================

router.patch(
    "/components/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        homePageComponentIdSchema.merge(
            updateHomePageComponentSchema
        )
    ),
    updateHomePageComponent
);


router.delete(
    "/components/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        homePageComponentIdSchema
    ),
    deleteHomePageComponent
);

export default router;