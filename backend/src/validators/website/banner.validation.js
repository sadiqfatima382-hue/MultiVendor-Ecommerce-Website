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

const formNumber = z.preprocess(
  (value) => {
    if (value === "") return undefined;

    if (
      typeof value === "string" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }

    return value;
  },
  z.number().int().min(0).optional()
);


// =====================================================
// CREATE
// =====================================================

export const createBannerSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200),

    subtitle: z
      .string()
      .trim()
      .max(500)
      .optional(),

    linkUrl: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    buttonText: z
      .string()
      .trim()
      .max(100)
      .optional(),

    position: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    sortOrder: formNumber,

    isActive: formBoolean,

    startDate: z
      .string()
      .optional(),

    endDate: z
      .string()
      .optional(),
  }),
});


// =====================================================
// UPDATE
// =====================================================

export const updateBannerSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    subtitle: z
      .string()
      .trim()
      .max(500)
      .optional(),

    linkUrl: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    buttonText: z
      .string()
      .trim()
      .max(100)
      .optional(),

    position: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    sortOrder: formNumber,

    isActive: formBoolean,

    startDate: z
      .string()
      .optional(),

    endDate: z
      .string()
      .optional(),
  }),
});


// =====================================================
// ID
// =====================================================

export const bannerIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});