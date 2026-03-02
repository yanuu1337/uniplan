import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "#/env";
import { db } from "#/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "sqlite" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  trustedOrigins: [
    env.NEXT_PUBLIC_BASE_URL,
  ],
});

export type Session = typeof auth.$Infer.Session;
