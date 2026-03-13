import z from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { ClassGroupRole, ClassGroupType } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import dayjs from "dayjs";

export const userRouter = createTRPCRouter({
  joinGroup: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const groupInvites = await ctx.db.groupInvite.findMany({
        where: {
          classGroupId: input.groupId,
        },
      });

      if (!groupInvites.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired invite token.",
        });
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired invite token.",
        });
      }

      if (
        matchedInvite.expiresAt &&
        dayjs().isAfter(dayjs(matchedInvite.expiresAt))
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invite link has expired.",
        });
      }

      if (
        matchedInvite.email &&
        matchedInvite.email.toLowerCase() !==
          ctx.session.user.email?.toLowerCase()
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invite is not valid for your account.",
        });
      }

      if (
        matchedInvite.maxUses !== null &&
        matchedInvite.maxUses !== undefined &&
        matchedInvite.uses >= matchedInvite.maxUses
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invite link has reached its maximum number of uses.",
        });
      }

      const existingMembership = await ctx.db.userClassGroup.findUnique({
        where: {
          userId_classGroupId: {
            userId: ctx.session.user.id,
            classGroupId: matchedInvite.classGroupId,
          },
        },
      });

      if (existingMembership) {
        return { success: true, alreadyMember: true };
      }

      const inviteToUse = matchedInvite;

      await ctx.db.$transaction(async (trx) => {
        const updatedInvite = await trx.groupInvite.update({
          where: { id: inviteToUse.id },
          data: {
            uses: {
              increment: 1,
            },
          },
        });

        if (
          updatedInvite.maxUses !== null &&
          updatedInvite.maxUses !== undefined &&
          updatedInvite.uses > updatedInvite.maxUses
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This invite link has reached its maximum number of uses.",
          });
        }

        await trx.userClassGroup.create({
          data: {
            userId: ctx.session.user.id,
            classGroupId: inviteToUse.classGroupId,
            role: ClassGroupRole.MEMBER,
            isVisible: true,
          },
        });
      });

      return { success: true, alreadyMember: false };
    }),
  leaveGroup: protectedProcedure
    .input(z.object({ classGroupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingMembership = await ctx.db.userClassGroup.findUnique({
        where: {
          userId_classGroupId: {
            userId: ctx.session.user.id,
            classGroupId: input.classGroupId,
          },
        },
        include: {
          classGroup: true,
        },
      });
      if (!existingMembership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not a member of this group.",
        });
      }
      if (existingMembership.role == ClassGroupRole.OWNER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot leave a group you are the owner of.",
        });
      }
      if (existingMembership.classGroup.type == ClassGroupType.PERSONAL) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot leave a personal group.",
        });
      }
      return await ctx.db.userClassGroup.delete({
        where: {
          userId_classGroupId: {
            userId: ctx.session.user.id,
            classGroupId: input.classGroupId,
          },
        },
      });
    }),
  getUserGroups: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        classGroupMemberships: {
          include: {
            classGroup: {
              include: {
                events: true,
                members: true,
                recurringEventTemplates: true,
                createdBy: true,
              },
            },
          },
        },
      },
    });
  }),
});
