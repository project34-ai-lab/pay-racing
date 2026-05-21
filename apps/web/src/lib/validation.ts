import { z } from "zod";

export const tripKickoffSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "Nickname must be at least 2 characters")
    .max(24, "Nickname must be less than 24 characters"),
});
