import { z } from "zod";

export const storeUserSchema = z.object({
  email: z.email("Email is required").max(255, "Email must be at most 255 characters"),
  first_name: z.string().max(100, "First name must be at most 100 characters").optional(),
  middle_name: z.string().max(100, "Middle name must be at most 100 characters").optional(),
  last_name: z.string().max(100, "Last name must be at most 100 characters").optional(),
  student_id: z.string().max(50, "Student ID must be at most 50 characters").optional(),
  status: z.boolean().optional(),
  role_id: z.cuid("Invalid role ID format").optional(),
  office_id: z.cuid("Invalid office ID format").optional(),
});

export type TStoreUserSchema = z.infer<typeof storeUserSchema>;

export const updateUserSchema = storeUserSchema.partial();

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
