import { db } from "#/server/db";
import { ClassGroupRole, ClassGroupType } from "generated/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import bcrypt from "bcrypt";

export const groupRouter = createTRPCRouter({
  joinGroup: protectedProcedure
    .input(z.object({ classGroupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.userClassGroup.create({
        data: {
          userId: ctx.session.user.id,
          classGroupId: input.classGroupId,
          role: ClassGroupRole.MEMBER,
          isVisible: true,
        },
      });
    }),
  leaveGroup: protectedProcedure
    .input(z.object({ classGroupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.userClassGroup.delete({
        where: {
          userId_classGroupId: {
            userId: ctx.session.user.id,
            classGroupId: input.classGroupId,
          },
        },
      });
    }),
  getUserGroups: protectedProcedure.query(async ({ ctx }) => {
    return await db.user.findUnique({
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

  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        password: z.string().optional(),
        type: z
          .nativeEnum(ClassGroupType)
          .optional()
          .default(ClassGroupType.CLASS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const password = input.password
        ? await bcrypt.hash(input.password, 10)
        : null;
      return await db.classGroup.create({
        data: {
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          password,
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
});
