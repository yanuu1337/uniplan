import z from "zod";

export const CreateGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export const CreateGroupInviteSchema = z
  .object({
    classGroupId: z.string().min(1, { message: "Class group ID is required" }),
    expiresAt: z.date().optional(),
    maxUses: z
      .number()
      .optional()
      .transform((_val) => 1), // always return 1 use for e-mail invites
    email: z.string().email({ message: "Invalid email address" }),
  })
  .or(
    z.object({
      classGroupId: z
        .string()
        .min(1, { message: "Class group ID is required" }),
      expiresAt: z.date().optional(),
      maxUses: z.number().optional().default(0),
    }),
  );

export const LeaveGroupSchema = z.object({
  classGroupId: z.string().min(1, { message: "Class group ID is required" }),
});
