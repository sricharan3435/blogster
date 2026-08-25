import { z } from "zod";

export const blogSchema = z.object({
    title: z.string().min(2),
    content: z.string().min(5),
});