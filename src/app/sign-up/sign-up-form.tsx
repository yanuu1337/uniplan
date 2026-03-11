"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldError } from "#/components/ui/field";

import { signUp } from "./actions";

type SignUpErrors = {
  email?: string[];
  name?: string[];
  password?: string[];
  generic?: string[];
};

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm({
  callbackURL,
}: {
  callbackURL?: string;
}) {
  const [state, formAction, isPending] = useActionState(signUp, {
    errors: {
      email: [] as string[],
      name: [] as string[],
      password: [] as string[],
      generic: [] as string[],
    },
  } satisfies { errors: SignUpErrors });
  const errors: SignUpErrors = state?.errors ?? {};

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
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
        <FieldError
          className="text-xs"
          errors={errors.email?.map((message) => ({ message }))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-foreground text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...form.register("name")}
        />
        <FieldError
          className="text-xs"
          errors={errors.name?.map((message) => ({ message }))}
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
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
        />
        <p className="text-muted-foreground text-xs">
          Must be at least 8 characters, with an uppercase letter and a number.
        </p>
        <FieldError
          className="text-xs"
          errors={errors.password?.map((message) => ({ message }))}
        />
      </div>
      {errors.generic?.map((message) => (
        <p key={crypto.randomUUID()} className="text-destructive text-xs">
          {message}
        </p>
      ))}
      <Button
        type="submit"
        className="w-full"
        disabled={
          isPending || Object.values(errors).some((error) => error?.length > 0)
        }
      >
        Continue
        <ArrowRightIcon className="ml-1.5 h-4 w-4" />
      </Button>
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          href={
            callbackURL
              ? `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
              : "/sign-in"
          }
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
