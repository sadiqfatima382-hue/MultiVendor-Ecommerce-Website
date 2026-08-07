import { z } from "zod";


// =====================================================
// CREATE HOME PAGE
// =====================================================

export const createHomePageSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    title: z
      .string()
      .trim()
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    isActive: z
      .boolean()
      .optional(),

    components: z
      .array(
        z.object({
          componentTypeId: z
            .string()
            .min(1),

          title: z
            .string()
            .trim()
            .max(200)
            .optional(),

          content: z
            .record(z.string(), z.any())
            .nullable()
            .optional(),

          sortOrder: z
            .number()
            .int()
            .min(0)
            .optional(),

          isActive: z
            .boolean()
            .optional(),
        })
      )
      .optional(),
  }),
});


// =====================================================
// UPDATE HOME PAGE
// =====================================================

export const updateHomePageSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    title: z
      .string()
      .trim()
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),
});


// =====================================================
// HOME PAGE ID
// =====================================================

export const homePageIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});


// =====================================================
// HOME PAGE COMPONENT
// =====================================================

export const addHomePageComponentSchema =
  z.object({
    body: z.object({
      componentTypeId: z
        .string()
        .min(1),

      title: z
        .string()
        .trim()
        .max(200)
        .optional(),

      content: z
        .record(z.string(), z.any())
        .nullable()
        .optional(),

      sortOrder: z
        .number()
        .int()
        .min(0)
        .optional(),

      isActive: z
        .boolean()
        .optional(),
    }),
  });


export const updateHomePageComponentSchema =
  z.object({
    body: z.object({
      componentTypeId: z
        .string()
        .min(1)
        .optional(),

      title: z
        .string()
        .trim()
        .max(200)
        .optional(),

      content: z
        .record(z.string(), z.any())
        .nullable()
        .optional(),

      sortOrder: z
        .number()
        .int()
        .min(0)
        .optional(),

      isActive: z
        .boolean()
        .optional(),
    }),
  });


// =====================================================
// HOME PAGE ID PARAM
// =====================================================

export const homePageIdParamSchema =
  z.object({
    params: z.object({
      homePageId: z
        .string()
        .min(1),
    }),
  });


// =====================================================
// COMPONENT ID PARAM
// =====================================================

export const homePageComponentIdSchema =
  z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  });