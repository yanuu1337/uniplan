import { redirect } from "next/navigation";

import { getSession } from "#/server/better-auth/server";
import { Button } from "#/components/ui/button";
import { HydrateClient } from "#/trpc/server";
import { Calendar, ChevronsRight, Clock, Group, Pin } from "lucide-react";
export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="from-accent via-background to-background-secondary min-h-screen bg-linear-to-tr">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-foreground mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Your classes,{" "}
                <span className="text-primary">all in one place</span>
              </h1>
              <p className="text-muted-foreground mb-4 text-xl leading-relaxed sm:text-2xl">
                Tired of having to check{" "}
                <span className="font-bold">multiple</span> sources to figure
                out where and when you have classes?
              </p>
              <p className="text-muted-foreground mb-12 text-lg">
                UniPlan - an academic calendar - made{" "}
                <span className="font-bold">your</span> way.
              </p>

              {!session && (
                <form className="flex flex-col items-center gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="bg-primary text-primary-foreground items-center px-32 py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:cursor-pointer hover:bg-blue-700 hover:shadow-xl active:scale-95"
                      size="lg"
                      onClick={async () => {
                        "use server";
                        redirect("/sign-up");
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      className="bg-background-muted text-foreground items-center px-32 py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                      size="lg"
                      variant="secondary"
                      onClick={async () => {
                        "use server";
                        redirect("/signin");
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              )}

              {session && (
                <div className="mt-8">
                  <p className="text-foreground mb-4 text-lg">
                    Welcome back,{" "}
                    <span className="text-foreground font-semibold">
                      {session?.user?.name || "Guest"}
                    </span>
                  </p>
                  <Button
                    size="lg"
                    onClick={async () => {
                      "use server";
                      redirect("/calendar");
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/80 items-center px-32 py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:cursor-pointer hover:shadow-xl"
                  >
                    Go to Calendar
                    <ChevronsRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-border bg-background-secondary mx-2 rounded-lg border py-24 md:mx-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-24 md:grid-cols-4">
                <div className="text-center">
                  <div className="bg-accent mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    One Calendar
                  </h3>
                  <p className="text-muted-foreground">
                    All your classes in a single, unified calendar view. No more
                    switching between apps.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-accent mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Group className="text-foreground h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Class Groups
                  </h3>
                  <p className="text-muted-foreground">
                    Create protected class groups to share your calendar with
                    other students. Join existing groups or create your own.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-accent mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Pin className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Individual Events
                  </h3>
                  <p className="text-muted-foreground">
                    Add your individual classes or one-time events to the
                    calendar to get a more detailed view.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-accent mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Time Management
                  </h3>
                  <p className="text-muted-foreground">
                    Plan your day effectively with a clear view of your schedule
                    and upcoming classes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
