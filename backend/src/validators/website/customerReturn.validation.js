import { z } from "zod";

// =====================================================
// ENUMS
// =====================================================

const returnReasons = [
  "DAMAGED",
  "WRONG_ITEM",
  "DEFECTIVE",
  "NOT_AS_DESCRIBED",
  "SIZE_ISSUE",
  "QUALITY_ISSUE",
  "CHANGED_MIND",
  "OTHER",
];

const returnStatuses = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "RECEIVED",
  "REFUNDED",
];

// =====================================================
// CREATE RETURN ITEM
// =====================================================

const returnItemSchema = z.object({
  orderItemId: z
    .string()
    .min(1),

  quantity: z
    .coerce
    .number()
    .int()
    .min(1),

  reason: z.enum(
    returnReasons
  ),

  reasonNotes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("")),
});

// =====================================================
// CREATE RETURN
// =====================================================

export const createCustomerReturnSchema =
  z.object({
    body: z.object({
      orderId: z
        .string()
        .min(1),

      items: z
        .array(returnItemSchema)
        .min(1),

      customerNotes: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal("")),
    }),
  });

// =====================================================
// ID
// =====================================================

export const customerReturnIdSchema =
  z.object({
    params: z.object({
      id: z
        .string()
        .min(1),
    }),
  });

// =====================================================
// LIST QUERY
// =====================================================

export const customerReturnQuerySchema =
  z.object({
    query: z.object({
      page: z.coerce
        .number()
        .int()
        .min(1)
        .optional(),

      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),

      status: z
        .enum(returnStatuses)
        .optional(),
    }),
  });

// =====================================================
// ADMIN NOTES
// =====================================================

export const customerReturnAdminNotesSchema =
  z.object({
    params: z.object({
      id: z
        .string()
        .min(1),
    }),

    body: z.object({
      adminNotes: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal("")),
    }),
  });

// =====================================================
// REJECT
// =====================================================

export const rejectCustomerReturnSchema =
  z.object({
    params: z.object({
      id: z
        .string()
        .min(1),
    }),

    body: z.object({
      adminNotes: z
        .string()
        .trim()
        .min(1, "Rejection reason is required.")
        .max(2000),
    }),
  });