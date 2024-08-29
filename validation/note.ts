import { z } from "zod";

export const noteValidation = {
  CREATE: z.object({
    title: z
      .string()
      .min(1, { message: "Title must contain at least 1 characters" }),
    type: z.enum(["freetext", "todolist", "habits"]),
    note: z.any(),
  }),
};
