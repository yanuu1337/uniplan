"use client";
import {
  Label,
  Form,
  TextField,
  Button,
  FieldError,
  Input,
  Link,
} from "@heroui/react";
import { ArrowRightIcon } from "lucide-react";
import { signIn } from "./actions";
import { useActionState } from "react";

export default function SignInForm() {
  const [state, formAction] = useActionState(signIn, {
    error: undefined,
  });
  return (
    <Form action={formAction} className="flex w-96 flex-col gap-4">
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
          }
        }}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" />
        <FieldError />
      </TextField>
      <TextField isRequired name="password" type="password">
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        <FieldError />
      </TextField>
      <Button type="submit" className="w-full">
        Sign In
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <Link href="/sign-up" className="text-sm text-gray-500">
        Don&apos;t have an account? Sign up
      </Link>
    </Form>
  );
}
