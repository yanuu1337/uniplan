import { getSession } from "#/server/better-auth/server";
import { Button } from "#/components/ui/button";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "./mode-switcher";
import { NavProfile } from "./nav-profile";

export default async function Nav() {
  const session = await getSession();
  return (
    <nav className="border-border bg-background sticky top-0 right-0 left-0 z-50 mx-2 my-2 rounded-lg border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-foreground text-2xl font-bold">
              Uni<span className="text-primary">Plan</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <NavProfile session={session} />
            ) : (
              <div className="inline-flex gap-2">
                <Button
                  variant="outline"
                  className="font-bold"
                  onClick={async () => {
                    "use server";
                    redirect("/sign-in");
                  }}
                >
                  Sign in
                </Button>
                <Button
                  className="font-bold"
                  onClick={async () => {
                    "use server";
                    redirect("/sign-up");
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
