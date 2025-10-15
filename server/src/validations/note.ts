import z from "zod";

export const createNoteSchema = z.object({
  userId: z.uuid(),
  title: z.string().min(1).max(255),
});

export type CreateNoteDTO = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isShared: z.boolean().optional(),
});

export type UpdateNoteDTO = z.infer<typeof updateNoteSchema>;
