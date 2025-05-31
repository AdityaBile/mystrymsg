import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must not be less than 10 characters" })
    .max(300, { message: "Content should not be greater than 300 characters" }),
});
