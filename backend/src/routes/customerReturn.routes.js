import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import { createCustomerReturn, getMyCustomerReturns, getCustomerReturns, getCustomerReturnById, getCustomerReturnByIdAdmin, approveCustomerReturn, rejectCustomerReturn, receiveCustomerReturn, refundCustomerReturn, deleteCustomerReturn, } from "../controllers/customerReturn.controller.js";
import { createCustomerReturnSchema, customerReturnIdSchema, customerReturnQuerySchema, customerReturnAdminNotesSchema, rejectCustomerReturnSchema, } from "../validators/website/customerReturn.validation.js";

const router = express.Router();

// =====================================================
// CUSTOMER
// =====================================================

// Create return
router.post(
    "/",
    authenticate,
    validate(createCustomerReturnSchema),
    createCustomerReturn
);

// My returns
router.get(
    "/my",
    authenticate,
    validate(customerReturnQuerySchema),
    getMyCustomerReturns
);

// My return by ID
router.get(
    "/my/:id",
    authenticate,
    validate(customerReturnIdSchema),
    getCustomerReturnById
);

// Delete requested return
router.delete(
    "/my/:id",
    authenticate,
    validate(customerReturnIdSchema),
    deleteCustomerReturn
);

// =====================================================
// ADMIN
// =====================================================

// Get all returns
router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(customerReturnQuerySchema),
    getCustomerReturns
);

// Get return by ID
router.get(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(customerReturnIdSchema),
    getCustomerReturnByIdAdmin
);

// Approve
router.patch(
    "/:id/approve",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(customerReturnAdminNotesSchema),
    approveCustomerReturn
);

// Reject
router.patch(
    "/:id/reject",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(rejectCustomerReturnSchema),
    rejectCustomerReturn
);

// Receive
router.patch(
    "/:id/receive",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(customerReturnIdSchema),
    receiveCustomerReturn
);

// Refund
router.patch(
    "/:id/refund",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(customerReturnIdSchema),
    refundCustomerReturn
);

export default router;