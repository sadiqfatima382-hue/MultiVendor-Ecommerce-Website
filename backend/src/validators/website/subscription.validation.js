import { z } from "zod";


// =====================================================
// HELPERS
// =====================================================

const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return value;
  },
  z.boolean().optional()
);


const numberValue = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value !== ""
    ) {
      return Number(value);
    }

    return value;
  },
  z.number().min(0).optional()
);


const pageValue = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value !== ""
    ) {
      return Number(value);
    }

    return value;
  },
  z.number().int().min(1).optional()
);


// =====================================================
// PLAN CREATE
// =====================================================

export const createSubscriptionPlanSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100),

      description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

      price: z
        .union([
          z.number().min(0),
          z.string().regex(
            /^\d+(\.\d+)?$/,
            "Price must be a valid number."
          ),
        ]),

      billingCycle: z.enum([
        "MONTHLY",
        "YEARLY",
      ]),

      features: z
        .any()
        .optional(),

      isActive: formBoolean,
    }),
  });


// =====================================================
// PLAN UPDATE
// =====================================================

export const updateSubscriptionPlanSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

      description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

      price: numberValue,

      billingCycle: z
        .enum([
          "MONTHLY",
          "YEARLY",
        ])
        .optional(),

      features: z
        .any()
        .optional(),

      isActive: formBoolean,
    }),
  });


// =====================================================
// PLAN ID
// =====================================================

export const subscriptionPlanIdSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  });


// =====================================================
// PLAN QUERY
// =====================================================

export const subscriptionPlanQuerySchema =
  z.object({
    query: z.object({
      page: pageValue,

      limit: pageValue,

      search: z
        .string()
        .trim()
        .optional(),

      billingCycle: z
        .enum([
          "MONTHLY",
          "YEARLY",
        ])
        .optional(),

      isActive: formBoolean,

      publicOnly: formBoolean,
    }),
  });


// =====================================================
// CREATE USER SUBSCRIPTION
// =====================================================

export const createUserSubscriptionSchema =
  z.object({
    body: z.object({
      userId: z.string().min(1),
      planId: z.string().min(1),
    }),
  });


// =====================================================
// USER SUBSCRIPTION ID
// =====================================================

export const userSubscriptionIdSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  });


// =====================================================
// USER ID
// =====================================================

export const subscriptionUserIdSchema =
  z.object({
    params: z.object({
      userId: z.string().min(1),
    }),
  });


// =====================================================
// USER SUBSCRIPTION QUERY
// =====================================================

export const userSubscriptionQuerySchema =
  z.object({
    query: z.object({
      page: pageValue,

      limit: pageValue,

      userId: z
        .string()
        .optional(),

      status: z
        .enum([
          "ACTIVE",
          "CANCELLED",
          "EXPIRED",
          "PENDING",
        ])
        .optional(),
    }),
  });