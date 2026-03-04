"use client";

import { useActionState } from "react";
import { ArrowRightIcon } from "lucide-react";

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

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, {
    errors: {
      email: [] as string[],
      name: [] as string[],
      password: [] as string[],
      generic: [] as string[],
    },
  } satisfies { errors: SignUpErrors });
  const errors: SignUpErrors = state?.errors ?? {};

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
          name="name"
          type="text"
          required
          placeholder="John Doe"
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
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Enter your password"
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
    </form>
  );
}
