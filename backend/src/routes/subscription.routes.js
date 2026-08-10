import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createSubscriptionPlan, getSubscriptionPlans, getSubscriptionPlanById, updateSubscriptionPlan, deleteSubscriptionPlan, createUserSubscription, getUserSubscriptions, getUserSubscriptionById, getActiveUserSubscription, cancelUserSubscription, expireUserSubscription, deleteUserSubscription, } from "../controllers/subscription.controller.js";
import { createSubscriptionPlanSchema, updateSubscriptionPlanSchema, subscriptionPlanIdSchema, subscriptionPlanQuerySchema, createUserSubscriptionSchema, userSubscriptionIdSchema, subscriptionUserIdSchema, userSubscriptionQuerySchema, } from "../validators/website/subscription.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC PLANS
// =====================================================

router.get(
    "/plans/public",
    validate(subscriptionPlanQuerySchema),
    (req, res, next) => {
        req.validatedData.query.publicOnly = true;
        next();
    },
    getSubscriptionPlans
);


// =====================================================
// ADMIN PLAN MANAGEMENT
// =====================================================

router.get(
    "/plans",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(subscriptionPlanQuerySchema),
    getSubscriptionPlans
);

router.get(
    "/plans/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(subscriptionPlanIdSchema),
    getSubscriptionPlanById
);

router.post(
    "/plans",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createSubscriptionPlanSchema),
    createSubscriptionPlan
);

router.patch(
    "/plans/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(
        subscriptionPlanIdSchema.merge(
            updateSubscriptionPlanSchema
        )
    ),
    updateSubscriptionPlan
);

router.delete(
    "/plans/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(subscriptionPlanIdSchema),
    deleteSubscriptionPlan
);


// =====================================================
// USER SUBSCRIPTIONS
// =====================================================
router.post(
    "/",
    authenticate,
    validate(createUserSubscriptionSchema),
    createUserSubscription
);

router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(userSubscriptionQuerySchema),
    getUserSubscriptions
);

router.get(
    "/user/:userId/active",
    authenticate,
    validate(subscriptionUserIdSchema),
    getActiveUserSubscription
);

router.get(
    "/:id",
    authenticate,
    validate(userSubscriptionIdSchema),
    getUserSubscriptionById
);

router.patch(
    "/:id/cancel",
    authenticate,
    validate(userSubscriptionIdSchema),
    cancelUserSubscription
);

// Admin/manual expiry
router.patch(
    "/:id/expire",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(userSubscriptionIdSchema),
    expireUserSubscription
);

router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(userSubscriptionIdSchema),
    deleteUserSubscription
);

export default router;