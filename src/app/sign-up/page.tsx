import SignUpForm from "./sign-up-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const callbackURL =
    typeof resolvedSearchParams.callbackURL === "string"
      ? resolvedSearchParams.callbackURL
      : undefined;

  return (
    <div className="flex h-screen flex-col md:items-center md:justify-center">
      <div className="border-border flex h-full flex-col items-center justify-center gap-2 rounded-xl border md:h-auto md:px-8 md:py-16">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <SignUpForm callbackURL={callbackURL} />
      </div>
    </div>
  );
}
