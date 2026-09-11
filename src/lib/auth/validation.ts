import { z } from "zod";

const email = z.string().trim().email();

export const signInSchema = z.object({
  email,
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  email,
  password: z.string().min(10),
});

export const passwordResetSchema = z.object({ email });
export const passwordUpdateSchema = z.object({ password: z.string().min(10) });
