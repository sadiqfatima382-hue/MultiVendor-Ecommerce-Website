import { z } from "zod";


// =====================================================
// BOOLEAN
// =====================================================

const formBoolean = z.preprocess(
    (value) => {
        if (value === "true") return true;
        if (value === "false") return false;

        return value;
    },
    z.boolean().optional()
);


// =====================================================
// URL
// =====================================================

const optionalUrl = z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal(""));


// =====================================================
// CREATE
// =====================================================

export const createContactSettingSchema =
    z.object({
        body: z.object({
            email: z
                .string()
                .trim()
                .email()
                .optional()
                .or(z.literal("")),

            phone: z
                .string()
                .trim()
                .max(30)
                .optional()
                .or(z.literal("")),

            whatsapp: z
                .string()
                .trim()
                .max(30)
                .optional()
                .or(z.literal("")),

            address: z
                .string()
                .trim()
                .max(500)
                .optional()
                .or(z.literal("")),

            googleMapUrl: optionalUrl,

            workingHours: z
                .string()
                .trim()
                .max(200)
                .optional()
                .or(z.literal("")),

            facebookUrl: optionalUrl,

            instagramUrl: optionalUrl,

            twitterUrl: optionalUrl,

            linkedinUrl: optionalUrl,

            youtubeUrl: optionalUrl,

            isActive: formBoolean,
        }),
    });


// =====================================================
// UPDATE
// =====================================================

export const updateContactSettingSchema =
    z.object({
        params: z.object({
            id: z.string().min(1),
        }),

        body: z.object({
            email: z
                .string()
                .trim()
                .email()
                .optional()
                .or(z.literal("")),

            phone: z
                .string()
                .trim()
                .max(30)
                .optional()
                .or(z.literal("")),

            whatsapp: z
                .string()
                .trim()
                .max(30)
                .optional()
                .or(z.literal("")),

            address: z
                .string()
                .trim()
                .max(500)
                .optional()
                .or(z.literal("")),

            googleMapUrl: optionalUrl,

            workingHours: z
                .string()
                .trim()
                .max(200)
                .optional()
                .or(z.literal("")),

            facebookUrl: optionalUrl,

            instagramUrl: optionalUrl,

            twitterUrl: optionalUrl,

            linkedinUrl: optionalUrl,

            youtubeUrl: optionalUrl,

            isActive: formBoolean,
        }),
    });


// =====================================================
// ID
// =====================================================

export const contactSettingIdSchema =
    z.object({
        params: z.object({
            id: z.string().min(1),
        }),
    });


// =====================================================
// QUERY
// =====================================================

export const contactSettingQuerySchema =
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
                z.number().int().min(1).optional()
            ),

            isActive: formBoolean,
        }),
    });