import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
      if (!userWithGroups)
        throw new TRPCError({ message: "No groups found.", code: "NOT_FOUND" });
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
});
