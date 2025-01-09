const { z } = require("zod");

export const journalScheme = z.object({
  title: z.string().min(1, "Title is Required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().min(1, "Mood is required"),
  collectionId: z.string().optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  description: z.string().optional(),
});