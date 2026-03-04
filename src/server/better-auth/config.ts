import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "../../env";
import { db } from "../../server/db";
import { sendVerificationEmail } from "../../server/mail/mailing";

export const auth = betterAuth({
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
});

export type Session = typeof auth.$Infer.Session;
