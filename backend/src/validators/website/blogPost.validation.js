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
  z.date().optional()
);


// =====================================================
// CREATE
// =====================================================

export const createBlogPostSchema =
  z.object({
    body: z.object({
      title: z
        .string()
        .trim()
        .min(2)
        .max(200),

      excerpt: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),

      content: z
        .string()
        .trim()
        .min(1),

      authorId: z
        .string()
        .min(1)
        .optional()
        .or(z.literal("")),

      isPublished: formBoolean,

      isFeatured: formBoolean,

      publishedAt: optionalDate,
    }),
  });


// =====================================================
// UPDATE
// =====================================================

export const updateBlogPostSchema =
  z.object({
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

      excerpt: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),

      content: z
        .string()
        .trim()
        .min(1)
        .optional(),

      authorId: z
        .string()
        .min(1)
        .optional()
        .or(z.literal("")),

      isPublished: formBoolean,

      isFeatured: formBoolean,

      publishedAt: optionalDate,
    }),
  });


// =====================================================
// ID
// =====================================================

export const blogPostIdSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  });


// =====================================================
// SLUG
// =====================================================

export const blogPostSlugSchema =
  z.object({
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

export const blogPostQuerySchema =
  z.object({
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
        z.number().int().min(1).optional()
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
        z.number().int().min(1).max(100).optional()
      ),

      search: z
        .string()
        .trim()
        .optional(),

      isPublished: formBoolean,

      isFeatured: formBoolean,

      publicOnly: formBoolean,
    }),
  });


// =====================================================
// FEATURED
// =====================================================

export const featuredBlogPostSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),

    body: z.object({
      isFeatured: z.preprocess(
        (value) => {
          if (value === "true") return true;
          if (value === "false") return false;

          return value;
        },
        z.boolean()
      ),
    }),
  });