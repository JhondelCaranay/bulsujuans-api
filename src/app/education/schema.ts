import { z } from "zod";

const currentYear = new Date().getFullYear();

export const storeEducationSchema = z.object({
  degree: z
    .string()
    .min(1, "Please enter the position or title.")
    .max(100, "The position or title must not exceed 100 characters."),

  institution: z
    .string()
    .min(1, "Please enter the company or organization name.")
    .max(100, "The company or organization name must not exceed 100 characters."),

  description: z.string().max(1000, "The description must not exceed 1,000 characters.").optional(),

  year: z
    .int("The end year must be a whole number.")
    .min(1900, "The end year must be 1900 or later.")
    .max(currentYear, "The end year cannot be later than the current year."),

  userId: z.string().min(1, "User ID is required"),
});

export type TStoreEducationSchema = z.infer<typeof storeEducationSchema>;

export const updateEducationSchema = storeEducationSchema
  .safeExtend({
    uuid: z.string(),
  })
  .partial();

export type TUpdateEducationSchema = z.infer<typeof updateEducationSchema>;
