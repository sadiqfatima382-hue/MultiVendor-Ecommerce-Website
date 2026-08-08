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


const paginationNumber = z.preprocess(
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
// CREATE
// =====================================================

export const createApiConfigSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100),

      baseUrl: z
        .string()
        .trim()
        .url()
        .optional(),

      apiKey: z
        .string()
        .trim()
        .optional(),

      apiSecret: z
        .string()
        .trim()
        .optional(),

      isActive: formBoolean,

      description: z
        .string()
        .trim()
        .max(500)
        .optional(),
    }),
  });


// =====================================================
// UPDATE
// =====================================================

export const updateApiConfigSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

      baseUrl: z
        .string()
        .trim()
        .url()
        .nullable()
        .optional(),

      apiKey: z
        .string()
        .trim()
        .nullable()
        .optional(),

      apiSecret: z
        .string()
        .trim()
        .nullable()
        .optional(),

      isActive: formBoolean,

      description: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .optional(),
    }),
  });


// =====================================================
// ID
// =====================================================

export const apiConfigIdSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  });


// =====================================================
// NAME
// =====================================================

export const apiConfigNameSchema =
  z.object({
    params: z.object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(100),
    }),
  });


// =====================================================
// LIST / QUERY
// =====================================================

export const apiConfigQuerySchema =
  z.object({
    query: z.object({
      page: paginationNumber,
      limit: paginationNumber,

      search: z
        .string()
        .trim()
        .optional(),

      isActive: formBoolean,
    }),
  });