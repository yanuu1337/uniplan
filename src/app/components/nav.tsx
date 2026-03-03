import { auth } from "#/server/better-auth";
import { getSession } from "#/server/better-auth/server";
import { Button, ButtonGroup } from "@heroui/react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Nav() {
    const session = await getSession();
    
    return (
        <nav className="sticky top-0 left-0 right-0 z-50 border rounded-lg border-border my-2 mx-2 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-foreground">
                  Uni<span className="text-accent">Plan</span>
                </h1>
              </div>
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {session.user?.name}
                  </span>
                  <form>
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      formAction={async () => {
                        "use server";
                        await auth.api.signOut({
                          headers: await headers(),
                        });
                        redirect("/");
                      }}
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ):(
                <ButtonGroup>
                    <Button 
                    className="font-bold"
                    onPress={async () => {
                    "use server";
                    redirect("/signin");
                  }}>Sign in</Button>
                  <Button
                    variant="secondary"
                    className="font-bold"
                  onPress={async () => {
                    "use server";
                    redirect("/signup");
                  }}>Sign up</Button>
                </ButtonGroup>
              )}
            </div>
          </div>
        </nav>
    )
}