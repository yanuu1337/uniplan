"use server";
import { auth } from "#/server/better-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signUp = async (
  prevState:
    | {
        errors: {
          email?: string[];
          name?: string[];
          password?: string[];
          generic?: string[];
        };
      }
    | undefined,
  formData: FormData,
) => {
  const validated = schema.safeParse(Object.fromEntries(formData));
  // const callbackURL =
  //   (formData.get("callbackURL") as string | null | undefined) ?? "/";
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: validated.data.email,
        name: validated.data.name,
        password: validated.data.password,
        // callbackURL,
      },
    });
    if (!user.token) {
      return { errors: { email: ["Failed to sign up"] } };
    }

    void redirect(`/sign-up/email-confirm?email=${validated.data.email}`);
  } catch (err) {
    return {
      errors: {
        generic: [err instanceof Error ? err.message : "Failed to sign up"],
      },
    };
  }
};
