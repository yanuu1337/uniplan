import z from "zod";

export const AddEventSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  start: z.date({ required_error: "Start is required" }),
  end: z.date({ required_error: "End is required" }),
  groupId: z.string().min(1, { message: "Group is required" }),
});
