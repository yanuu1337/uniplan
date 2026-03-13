import { ClassGroupRole, ClassGroupType } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import bcrypt from "bcrypt";
import { sendCalendarInviteEmail } from "#/server/mail/mailing";
import { TRPCError } from "@trpc/server";
import { env } from "#/env";
import dayjs from "dayjs";
import { InviteStatus } from "#/server/utils";

export const groupRouter = createTRPCRouter({
  getGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.classGroup.findUnique({
        where: { id: input.id },
      });
    }),
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z
          .nativeEnum(ClassGroupType)
          .optional()
          .default(ClassGroupType.CLASS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const password = input.password
      //   ? await bcrypt.hash(input.password, 10)
      //   : null;
      return await ctx.db.classGroup.create({
        data: {
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          // password,
          createdById: ctx.session.user.id,
          type: input.type,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: ClassGroupRole.OWNER,
              isVisible: true,
            },
          },
        },
      });
    }),

  createGroupInvite: protectedProcedure
    .input(
      z.object({
        classGroupId: z.string({
          required_error: "Class group ID is required",
        }),
        expiresAt: z.date().optional(),
        maxUses: z.number().optional().default(0),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const token = crypto.randomUUID();
      const hashedToken = await bcrypt.hash(token, 10);
      const email = input.email;
      const group = await ctx.db.classGroup.findUnique({
        where: { id: input.classGroupId },
        select: { name: true },
      });
      if (!group) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group not found.",
        });
      }
      await ctx.db.groupInvite.create({
        data: {
          classGroupId: input.classGroupId,
          token: hashedToken,
          expiresAt: input.expiresAt,
          maxUses: email ? 1 : input.maxUses, // if e-mail invite, only one use
          email,
          createdById: ctx.session.user.id,
        },
      });

      if (email) {
        const invitee = await ctx.db.user.findUnique({
          where: { email },
          select: { name: true },
        });
        if (!invitee) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "User not found. Please check the email address and try again.",
          });
        }
        await sendCalendarInviteEmail(
          email,
          invitee.name,
          ctx.session.user.name,
          group.name,
          `${env.NEXT_PUBLIC_BASE_URL}/invite/${input.classGroupId}/${token}`,
          input.expiresAt,
        );
      }
      return { success: true, token };
    }),
  getInviteStatus: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const groupInvites = await ctx.db.groupInvite.findMany({
        where: {
          classGroupId: input.groupId,
        },
      });

      if (!groupInvites.length) {
        return { status: InviteStatus.INVALID };
      }

      let matchedInvite: (typeof groupInvites)[number] | null = null;

      for (const invite of groupInvites) {
        const isMatch = await bcrypt.compare(input.token, invite.token);
        if (isMatch) {
          matchedInvite = invite;
          break;
        }
      }

      if (!matchedInvite) {
        return { status: InviteStatus.INVALID };
      }
      if (
        matchedInvite.expiresAt &&
        dayjs().isAfter(dayjs(matchedInvite.expiresAt))
      ) {
        return { status: InviteStatus.EXPIRED };
      }
      if (
        matchedInvite.maxUses &&
        matchedInvite.uses >= matchedInvite.maxUses
      ) {
        return { status: InviteStatus.MAX_USES };
      }
      return { status: InviteStatus.VALID };
    }),

  getEvents: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findMany({
        where: { classGroupId: input.groupId },
        include: {
          classGroup: true,
          createdBy: true,
          template: {
            include: {
              classGroup: true,
            },
          },
        },
      });
    }),
});
