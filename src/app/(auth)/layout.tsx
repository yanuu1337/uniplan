import { getSession } from "#/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  return (
    <main className="my-8 flex min-h-screen flex-col items-stretch justify-start">
      {children}
    </main>
  );
}
