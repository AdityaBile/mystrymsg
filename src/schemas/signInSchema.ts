import { z } from "zod";

export const singnInSchema = z.object({
  identifier: z.string(), // Username
  password: z.string(),
});
