import z from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(1).max(255),
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = z.object({
  title: z.string().min(1).max(255),
});

export type UpdateQuizDTO = z.infer<typeof updateQuizSchema>;
