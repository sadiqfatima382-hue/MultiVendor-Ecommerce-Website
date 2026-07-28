import { z } from "zod";

export const createQualityControlSchema = z.object({});

export const updateQualityControlSchema = z.object({
  status: z.enum([
    "PASSED",
    "FAILED",
  ]),

  remarks: z
    .string()
    .trim()
    .max(500)
    .optional(),
});