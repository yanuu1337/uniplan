"use server";
import { api } from "#/trpc/server";
import { TRPCError } from "@trpc/server";
import {
  CreateGroupInviteSchema,
  CreateGroupSchema,
  LeaveGroupSchema,
} from "./schema";
import type { z } from "zod";
import { env } from "#/env";
export const createGroup = async (data: z.infer<typeof CreateGroupSchema>) => {
  const validated = await CreateGroupSchema.safeParseAsync(data);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  try {
    await api.group.createGroup(data);
    return { success: true };
  } catch {
    return { errors: { generic: ["Failed to create group"] } };
  }
};

export const createGroupInvite = async (
  data: z.infer<typeof CreateGroupInviteSchema>,
) => {
  const validated = await CreateGroupInviteSchema.safeParseAsync(data);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  try {
    const result = await api.group.createGroupInvite(validated.data);
    return {
      success: true,
      url: `${env.NEXT_PUBLIC_BASE_URL}/invite/${validated.data.classGroupId}/${result.token}`,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        generic: [error instanceof TRPCError ? error.message : "Unknown error"],
      },
    };
  }
};

export const leaveGroup = async (data: z.infer<typeof LeaveGroupSchema>) => {
  const validated = await LeaveGroupSchema.safeParseAsync(data);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  try {
    await api.user.leaveGroup(validated.data);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        generic: [error instanceof TRPCError ? error.message : "Unknown error"],
      },
    };
  }
};
