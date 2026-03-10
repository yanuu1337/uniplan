import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "../../env";
import { db } from "../../server/db";
import { sendVerificationEmail } from "../../server/mail/mailing";
import { createAuthMiddleware } from "better-auth/api";
import { ClassGroupRole, ClassGroupType } from "generated/prisma";
import { revalidatePath } from "next/cache";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(db, {
    provider: "postgresql", // or "sqlite" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL],
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(
        user.email,
        user.name ?? "User",
        url,
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      );
    },
    sendOnSignIn: true,
    expiresIn: 1000 * 60 * 60 * 24 * 3, // 3 days
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          await db.classGroup.create({
            data: {
              id: crypto.randomUUID(),
              name: `${newSession.user.name}'s Personal Calendar`,
              description: `This is your personal calendar. Nobody can join - create a group to share.`,
              createdById: newSession.user.id,
              type: ClassGroupType.PERSONAL,
              members: {
                create: {
                  userId: newSession.user.id,
                  role: ClassGroupRole.OWNER,
                  isVisible: true,
                },
              },
            },
          });
        }
      }
      if (ctx.path.startsWith("/sign-in")) {
        revalidatePath("/", "page");
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
