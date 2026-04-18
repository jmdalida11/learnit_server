import z from "zod";

const questionSchema = z.object({
  question: z.string().min(1),
  type: z.enum([
    "multiple_choice",
    "multiple_answer",
    "true_false",
    "short_answer",
  ]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
});

export const createQuizSchema = z.object({
  title: z.string().min(1).max(255),
  questions: z.array(questionSchema).min(1),
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = z.object({
  title: z.string().min(1).max(255),
});

export type UpdateQuizDTO = z.infer<typeof updateQuizSchema>;
