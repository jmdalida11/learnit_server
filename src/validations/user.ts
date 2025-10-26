import z from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must not exceed 30 characters" }),

  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(30, { message: "Password must not exceed 30 characters" }),

  name: z
    .string({ message: "Name is required" })
    .max(255, { message: "Name must not exceed 255 characters" }),

  email: z
    .string({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
