import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must contain atleast 2 charater")
  .max(15, "Username must not exceed more than 15 characters")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
    "Username should not contain special character"
  );

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password should be of atleast 6 character" }),
});
