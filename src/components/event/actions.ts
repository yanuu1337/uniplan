"use server";
import { api } from "#/trpc/server";
import { AddRecurringEventSchema, DeleteEventSchema } from "./schema";
import { type z } from "zod";

export const createRecurringEvent = async (
  event: z.infer<typeof AddRecurringEventSchema>,
  classGroupId: string,
) => {
  const validated = await AddRecurringEventSchema.safeParseAsync(event);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  try {
    await api.event.createRecurringEvent({
      name: validated.data.name,
      description: validated.data.description,
      startDate: validated.data.startDate,
      endDate: validated.data.endDate,
      weekday: validated.data.weekday,
      startTime: validated.data.startTime,
      endTime: validated.data.endTime,
      classGroupId: classGroupId,
    });
    return { success: true };
  } catch {
    return { errors: { generic: ["Failed to create recurring event"] } };
  }
};

import { EventOverrideSchema } from "./schema";
import { EventStatus } from "generated/prisma";

export const overrideEvent = async (
  eventId: string,
  values: z.infer<typeof EventOverrideSchema>,
) => {
  const validated = await EventOverrideSchema.safeParseAsync(values);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await api.event.overrideEvent({
      eventId,
      name: validated.data.name,
      description: validated.data.description,
      startTime: validated.data.startTime,
      endTime: validated.data.endTime,
      status: validated.data.cancelEvent
        ? EventStatus.CANCELLED
        : EventStatus.MODIFIED,
    });

    return { success: true as const };
  } catch {
    return {
      success: false as const,
      errors: { generic: ["Failed to update event override"] },
    };
  }
};

export const deleteEvent = async (eventId: string) => {
  const validated = await DeleteEventSchema.safeParseAsync({ eventId });

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await (
      api.event as {
        deleteEvent: (input: { eventId: string }) => Promise<unknown>;
      }
    ).deleteEvent({
      eventId: validated.data.eventId,
    });

    return { success: true as const };
  } catch {
    return {
      success: false as const,
      errors: { generic: ["Failed to delete event"] },
    };
  }
};
