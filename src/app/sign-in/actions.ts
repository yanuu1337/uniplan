import { authClient } from "#/server/better-auth/client";
import { redirect } from "next/navigation";

export const signIn = async (
  prevState: { error: string | undefined },
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await authClient.signIn.email({
    email,
    password,
  });
  if (user.error) {
    return { error: user.error.message };
  }
  redirect("/");
};
