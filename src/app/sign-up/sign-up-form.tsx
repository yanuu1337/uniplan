"use client";
import {
  Form,
  Input,
  TextField,
  Label,
  FieldError,
  Description,
  Button,
} from "@heroui/react";
import { signUp } from "./actions";
import { useActionState } from "react";
import { ArrowRightIcon } from "lucide-react";

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, {
    errors: {},
  });
  const errors = state?.errors ?? {};
  return (
    <Form
      action={formAction}
      validationErrors={errors}
      className="flex w-96 flex-col gap-4"
    >
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
          }

          return null;
        }}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        name="name"
        type="text"
        validate={(value) => {
          if (value.length < 3) {
            return "Name must be at least 3 characters";
          }
        }}
      >
        <Label>Name</Label>
        <Input placeholder="John Doe" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        minLength={8}
        name="password"
        type="password"
        validate={(value) => {
          if (value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
          }

          return null;
        }}
      >
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        <Description>Must be at least 8 characters</Description>
        <FieldError />
      </TextField>
      <Button type="submit" className="w-full">
        Continue
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </Form>
  );
}
