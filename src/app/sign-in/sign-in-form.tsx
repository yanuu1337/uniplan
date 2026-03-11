"use client";

import Link from "next/link";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldError } from "#/components/ui/field";

import { signIn } from "./actions";

type SignInState = { error: string };

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm({
  callbackURL,
}: {
  callbackURL?: string;
}) {
  const [rawState, formAction, isPending] = useActionState(signIn, {
    error: "",
  } satisfies SignInState);
  const state = rawState ?? { error: "" };

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-4"
    >
      {callbackURL ? (
        <input type="hidden" name="callbackURL" value={callbackURL} />
      ) : null}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...form.register("email")}
        />
        <FieldError errors={[form.formState.errors.email]} className="text-xs" />
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
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
        />
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        <ArrowRightIcon className="ml-1.5 h-4 w-4" />
      </Button>

      <p className="text-muted-foreground text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={
            callbackURL
              ? `/sign-up?callbackURL=${encodeURIComponent(callbackURL)}`
              : "/sign-up"
          }
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
