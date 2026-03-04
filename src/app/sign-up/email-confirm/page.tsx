// get the email from the url query ?email=...
export default async function EmailConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const email = (await searchParams).email;
  return (
    <div className="flex h-screen flex-col md:items-center md:justify-center">
      <div className="border-border flex h-full flex-col items-center justify-center gap-2 rounded-xl border md:h-auto md:px-8 md:py-16">
        <h1 className="text-4xl font-bold">Email Confirmation</h1>
        <p className="text-muted-foreground">
          Please check your email for a confirmation link.
        </p>
        <p className="text-muted-foreground">
          An email has been sent to {email} for confirmation.
        </p>
      </div>
    </div>
  );
}
