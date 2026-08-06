import { z } from "zod";

export const createWebsiteIconSchema =
  z.object({
    body: z.object({
      type: z.enum([
        "LOGO",
        "DARK_LOGO",
        "MOBILE_LOGO",
        "FOOTER_LOGO",
        "ADMIN_LOGO",
        "EMAIL_LOGO",
        "FAVICON",
      ]),

      altText:
        z.string().optional(),
    }),
  });

export const updateWebsiteIconSchema =
  z.object({
    body: z.object({
      altText:
        z.string().optional(),
    }),
  });