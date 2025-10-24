import z from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(30),
  name: z.string().min(1).max(50),
  email: z.email(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
