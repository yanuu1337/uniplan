import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "#/server/better-auth";
import { getSession } from "#/server/better-auth/server";
import { Button, ButtonGroup } from '@heroui/react';
import { HydrateClient } from "#/trpc/server";
import { ArrowRight, Calendar, ChevronsRight, Clock, Group, Pin } from "lucide-react";
export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-linear-to-tr from-accent via-background to-background-secondary">
        

        {/* Hero Section */}
        <section className="relative overflow-hidden ">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                Your classes,{" "}
                <span className="text-accent">all in one place</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-4 leading-relaxed">
                Tired of having to check <span className="font-bold">multiple</span> sources to figure out where and
                when you have classes?
              </p>
              <p className="text-lg text-muted-foreground mb-12">
                UniPlan - an academic calendar - made <span className="font-bold">your</span> way.
              </p>

              {!session && (
                <form className="flex flex-col gap-2 items-center">
                  <ButtonGroup 
                    
                  >
                  <Button
                    className=" items-center  hover:scale-105 hover:cursor-pointer bg-accent px-32 py-4 text-lg font-semibold text-accent-foreground shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
                    size="lg"
                    onPress={async () => {
                      "use server";
                      redirect("/signup");
                    }}
                    
                  >
                    
                    Sign Up
                  </Button>
                  <Button
                    className=" items-center  hover:scale-105 bg-background-muted px-32 py-4 text-lg font-semibold text-foreground shadow-lg transition-all  hover:shadow-xl active:scale-95"
                    size="lg"
                    variant="secondary"
                    onPress={async () => {
                      "use server";
                      redirect("/signin");
                    }}
                  >
                    Sign In
                  </Button>
                  </ButtonGroup>
                </form>
              )}

              {session && (
                <div className="mt-8">
                  <p className="text-lg text-foreground mb-4">
                    Welcome back,{" "}
                    <span className="font-semibold text-foreground">
                      {session?.user?.name || "Guest"}
                    </span>
                  </p>
                  <Button
                    size="lg"
                    className="items-center  hover:scale-105 hover:cursor-pointer bg-accent px-32 py-4 text-lg font-semibold text-accent-foreground shadow-lg transition-all hover:bg-accent-hover hover:shadow-xl "
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
        <section className="py-24 rounded-lg mx-2 md:mx-16 border border-border bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-24 md:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background-tertiary">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    One Calendar
                  </h3>
                  <p className="text-muted-foreground">
                    All your classes in a single, unified calendar view. No
                    more switching between apps.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background-tertiary">
                    <Group className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Class Groups
                  </h3>
                  <p className="text-muted-foreground">
                    Create protected class groups to share your calendar with other students. Join existing groups or create your own.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background-tertiary">
                    <Pin className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Individual Events
                  </h3>
                  <p className="text-muted-foreground">
                    Add your individual classes or one-time events to the calendar to get a more detailed view.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background-tertiary">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Time Management
                  </h3>
                  <p className="text-muted-foreground">
                    Plan your day effectively with a clear view of your
                    schedule and upcoming classes.
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
