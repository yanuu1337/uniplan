"use client";

import Link from "next/link";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

import { signIn } from "./actions";

type SignInState = { error: string };

export default function SignInForm() {
  const [rawState, formAction, isPending] = useActionState(signIn, {
    error: "",
  } satisfies SignInState);
  const state = rawState ?? { error: "" };

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        <ArrowRightIcon className="ml-1.5 h-4 w-4" />
      </Button>

      <p className="text-muted-foreground text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
