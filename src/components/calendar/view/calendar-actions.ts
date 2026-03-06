"use server";
import { type z } from "zod";
import { api } from "#/trpc/server";
import { AddEventSchema } from "../schemas";

export const createEvent = async (event: z.infer<typeof AddEventSchema>) => {
  const validated = await AddEventSchema.safeParseAsync(event);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  try {
    await api.event.createEvent({
      name: validated.data.name,
      description: validated.data.description,
      startDateTime: validated.data.start,
      endDateTime: validated.data.end,
      classGroupId: validated.data.groupId,
    });
    return { success: true };
  } catch {
    return { errors: { generic: ["Failed to create event"] } };
  }
};
