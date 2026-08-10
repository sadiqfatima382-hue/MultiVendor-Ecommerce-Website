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

const optionalDate = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return new Date(value);
    }

    return value;
  },
  z
    .date()
    .optional()
);

// =====================================================
// DECIMAL
// =====================================================

const optionalDecimal = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return Number(value);
    }

    return value;
  },
  z
    .number()
    .min(0)
    .optional()
);

// =====================================================
// INTEGER
// =====================================================

const optionalInteger = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return Number(value);
    }

    return value;
  },
  z
    .number()
    .int()
    .min(1)
    .optional()
);

// =====================================================
// CREATE
// =====================================================

export const createCareerSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200),

    department: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    location: z
      .string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal("")),

    employmentType: z
      .string()
      .trim()
      .max(50)
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .min(1),

    requirements: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    responsibilities: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    salaryMin: optionalDecimal,

    salaryMax: optionalDecimal,

    salaryCurrency: z
      .string()
      .trim()
      .max(10)
      .optional()
      .or(z.literal("")),

    vacancies: optionalInteger,

    isPublished: formBoolean,

    isActive: formBoolean,

    publishedAt: optionalDate,

    applicationDeadline: optionalDate,
  }),
});

// =====================================================
// UPDATE
// =====================================================

export const updateCareerSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),

  body: z.object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    department: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal("")),

    location: z
      .string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal("")),

    employmentType: z
      .string()
      .trim()
      .max(50)
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .min(1)
      .optional(),

    requirements: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    responsibilities: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    salaryMin: optionalDecimal,

    salaryMax: optionalDecimal,

    salaryCurrency: z
      .string()
      .trim()
      .max(10)
      .optional()
      .or(z.literal("")),

    vacancies: optionalInteger,

    isPublished: formBoolean,

    isActive: formBoolean,

    publishedAt: optionalDate,

    applicationDeadline: optionalDate,
  }),
});

// =====================================================
// ID
// =====================================================

export const careerIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// =====================================================
// SLUG
// =====================================================

export const careerSlugSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1),
  }),
});

// =====================================================
// QUERY
// =====================================================

export const careerQuerySchema = z.object({
  query: z.object({
    page: z.preprocess(
      (value) => {
        if (
          typeof value === "string" &&
          value !== ""
        ) {
          return Number(value);
        }

        return value;
      },
      z
        .number()
        .int()
        .min(1)
        .optional()
    ),

    limit: z.preprocess(
      (value) => {
        if (
          typeof value === "string" &&
          value !== ""
        ) {
          return Number(value);
        }

        return value;
      },
      z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
    ),

    search: z
      .string()
      .trim()
      .optional(),

    department: z
      .string()
      .trim()
      .optional(),

    employmentType: z
      .string()
      .trim()
      .optional(),

    isPublished: formBoolean,

    isActive: formBoolean,

    publicOnly: formBoolean,
  }),
});

// =====================================================
// ACTIVE STATUS
// =====================================================

export const careerActiveSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),

  body: z.object({
    isActive: z.preprocess(
      (value) => {
        if (value === "true") return true;
        if (value === "false") return false;

        return value;
      },
      z.boolean()
    ),
  }),
});