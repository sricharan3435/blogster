import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(280),
  avatar_url: z.union([z.string().url(), z.literal("")]),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});
