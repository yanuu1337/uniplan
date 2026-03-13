import z from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOccurencesInDateRange } from "#/server/utils";
import { EventStatus } from "generated/prisma";

export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        startDateTime: z.date(),
        endDateTime: z.date(),
        classGroupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.create({
        data: {
          name: input.name,
          description: input.description,
          startDateTime: input.startDateTime,
          endDateTime: input.endDateTime,
          classGroup: {
            connect: {
              id: input.classGroupId,
            },
          },
        },
      });
    }),

  getVisibleEvents: protectedProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ ctx, input }) => {
      const userWithGroups = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          classGroupMemberships: {
            include: {
              classGroup: true,
            },
          },
        },
      });

      if (!userWithGroups) {
        throw new TRPCError({ message: "No groups found.", code: "NOT_FOUND" });
      }

      const userGroups = userWithGroups.classGroupMemberships.filter(
        (grp) => grp.isVisible,
      );

      const events = await ctx.db.event.findMany({
        where: {
          classGroupId: {
            in: userGroups.map((group) => group.classGroup.id),
          },
          startDateTime: {
            gte: input.startDate,
            lte: input.endDate,
          },
          endDateTime: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          classGroup: {
            select: {
              name: true,
              members: {
                select: {
                  color: true,
                  userId: true,
                },
              },
            },
          },
        },
      });

      const eventsWithMemberColor = events.map((event) => {
        const memberColor = event.classGroup.members.find(
          (member) => member.userId === ctx.session.user.id,
        )?.color;

        return {
          ...event,
          memberColor,
        };
      });

      return eventsWithMemberColor;
    }),

  createRecurringEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        weekday: z.number(), // 0-6 (Sunday-Saturday)
        startTime: z.date(), // time-of-day component used
        endTime: z.date(), // time-of-day component used
        classGroupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.endDate < input.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "endDate must be on or after startDate",
        });
      }

      // Yes, I admit! this code was vibe-coded. I'm not proud of it. But it works.

      // 1. Create recurring event template
      const template = await ctx.db.recurringEventTemplate.create({
        data: {
          name: input.name,
          description: input.description,
          weekday: input.weekday,
          startTime: input.startTime,
          endTime: input.endTime,
          startDate: input.startDate,
          endDate: input.endDate,
          classGroup: {
            connect: {
              id: input.classGroupId,
            },
          },
        },
      });

      const occurrences = getOccurencesInDateRange({
        startDate: input.startDate,
        endDate: input.endDate,
        weekday: input.weekday,
        startTime: input.startTime,
        endTime: input.endTime,
      });

      const events = occurrences.map((occurrence) => ({
        name: input.name,
        description: input.description,
        startDateTime: occurrence.startDateTime,
        endDateTime: occurrence.endDateTime,
        classGroupId: input.classGroupId,
        templateId: template.id,
      }));

      // 3. Create events for all computed dates, linked to the template
      if (occurrences.length > 0) {
        await ctx.db.event.createMany({
          data: events,
        });
      }

      return {
        template,
        occurrencesCreated: occurrences.length,
      };
    }),

  getEventTemplates: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.recurringEventTemplate.findMany({
        where: { classGroupId: input.groupId },
      });
    }),

  updateRecurringEventTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        classGroupId: z.string(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        weekday: z.number(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.endDate < input.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "endDate must be on or after startDate",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        const template = await tx.recurringEventTemplate.update({
          where: {
            id: input.id,
            classGroupId: input.classGroupId,
          },
          data: {
            name: input.name,
            description: input.description,
            weekday: input.weekday,
            startTime: input.startTime,
            endTime: input.endTime,
            startDate: input.startDate,
            endDate: input.endDate,
          },
        });

        const occurrences = getOccurencesInDateRange({
          startDate: input.startDate,
          endDate: input.endDate,
          weekday: input.weekday,
          startTime: input.startTime,
          endTime: input.endTime,
        });

        const events = await tx.event.findMany({
          where: {
            templateId: template.id,
          },
          orderBy: {
            startDateTime: "asc",
          },
        });

        const minCount = Math.min(events.length, occurrences.length);

        for (let i = 0; i < minCount; i++) {
          const event = events[i]!;
          const occurrence = occurrences[i]!;

          await tx.event.update({
            where: { id: event.id },
            data: {
              name: input.name,
              description: input.description,
              startDateTime: occurrence.startDateTime,
              endDateTime: occurrence.endDateTime,
            },
          });
        }

        // if there are extra events beyond the new occurrences, delete them
        if (events.length > occurrences.length) {
          const extra = events.slice(occurrences.length);
          const extraIds = extra.map((e) => e.id);
          if (extraIds.length) {
            await tx.event.deleteMany({
              where: {
                id: {
                  in: extraIds,
                },
              },
            });
          }
        }

        // if there are more occurrences than events, create new events
        if (occurrences.length > events.length) {
          const toCreate = occurrences
            .slice(events.length)
            .map((occurrence) => ({
              name: input.name,
              description: input.description,
              startDateTime: occurrence.startDateTime,
              endDateTime: occurrence.endDateTime,
              classGroupId: input.classGroupId,
              templateId: template.id,
            }));

          if (toCreate.length) {
            await tx.event.createMany({
              data: toCreate,
            });
          }
        }

        return template;
      });
    }),

  deleteRecurringEventTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        classGroupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.recurringEventTemplate.delete({
        where: {
          id: input.id,
          classGroupId: input.classGroupId,
        },
      });
    }),

  overrideEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        description: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        status: z.nativeEnum(EventStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
        include: { classGroup: true },
      });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      const membership = await ctx.db.userClassGroup.findFirst({
        where: {
          userId: ctx.session.user.id,
          classGroupId: event.classGroupId,
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to modify this event",
        });
      }

      return ctx.db.event.update({
        where: { id: input.eventId },
        data: {
          overrideName: input.name,
          overrideDescription: input.description,
          overrideStartTime: input.startTime,
          overrideEndTime: input.endTime,
          status: input.status,
        },
      });
    }),

  deleteEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
      });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      if (event.templateId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This event is part of a recurring series and cannot be deleted directly.",
        });
      }

      const membership = await ctx.db.userClassGroup.findFirst({
        where: {
          userId: ctx.session.user.id,
          classGroupId: event.classGroupId,
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this event",
        });
      }

      await ctx.db.event.delete({
        where: { id: input.eventId },
      });

      return { success: true as const };
    }),
});
