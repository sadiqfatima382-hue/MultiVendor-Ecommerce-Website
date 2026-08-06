import { z } from "zod";

export const createWebsiteSettingSchema =
  z.object({
    body: z.object({
      siteName:
        z.string().trim().min(2),

      tagline:
        z.string().optional(),

      description:
        z.string().optional(),

      logo:
        z.string().optional(),

      favicon:
        z.string().optional(),

      email:
        z.string().email().optional(),

      phone:
        z.string().optional(),

      address:
        z.string().optional(),

      currency:
        z.string().optional(),

      timezone:
        z.string().optional(),

      maintenanceMode:
        z.boolean().optional(),

      copyrightText:
        z.string().optional(),

      facebook:
        z.string().url().optional(),

      instagram:
        z.string().url().optional(),

      twitter:
        z.string().url().optional(),

      youtube:
        z.string().url().optional(),

      linkedin:
        z.string().url().optional(),

      seoTitle:
        z.string().optional(),

      seoDescription:
        z.string().optional(),

      seoKeywords:
        z.string().optional(),
    }),
  });

export const updateWebsiteSettingSchema =
  createWebsiteSettingSchema.partial();