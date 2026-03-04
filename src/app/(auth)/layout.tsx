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
    <main className="flex h-screen flex-col md:items-center md:justify-center">
      {children}
    </main>
  );
}
