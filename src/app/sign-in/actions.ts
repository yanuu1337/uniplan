"use server";
import { auth } from "#/server/better-auth/config";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SignInState = { error: string };

export const signIn = async (
  prevState: SignInState | undefined,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
  });
  if (response.redirect && response.url) {
    void redirect(response.url);
  }
  if (!response.user) return { error: "Invalid email or password" };
  revalidatePath("/", "layout");
  void redirect("/");
};
