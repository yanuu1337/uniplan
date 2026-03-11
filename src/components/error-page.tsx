"use client";
import { Button } from "./ui";
import Link from "next/link";
export type ErrorPageProps = {
  title: string;
  code?: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
};

export default function ErrorPage({ error }: { error: ErrorPageProps }) {
  const { code, title, description, action } = error;
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Uh oh... Something went wrong.</h1>
      {code && (
        <h2 className="text-destructive animate-bounce text-8xl font-bold hover:animate-none">
          {code}
        </h2>
      )}
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action && (
        <Button variant="outline" size="lg" asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
