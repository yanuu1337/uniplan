import ErrorPage from "#/components/error-page";
import { getSession } from "#/server/better-auth/server";
import { InviteStatus } from "#/server/utils";
import { api } from "#/trpc/server";
import { redirect } from "next/navigation";

export default async function InviteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ classGroupId: string; token: string }>;
}) {
  const { classGroupId, token } = await params;
  const inviteStatus = await api.group.getInviteStatus({
    groupId: classGroupId,
    token,
  });
  const session = await getSession();
  if (inviteStatus.status === InviteStatus.INVALID) {
    return (
      <ErrorPage
        error={{
          title: "Invalid invite",
          code: "404",
          description:
            "We couldn't match the invite token with any existing invites. Make sure you have the correct link and try again.",
        }}
      />
    );
  }
  if (inviteStatus.status === InviteStatus.EXPIRED) {
    return (
      <ErrorPage
        error={{
          code: "403",
          title: "Expired invite",
          description:
            "The invite has expired. Ask the group members to generate a new invite.",
        }}
      />
    );
  }
  if (inviteStatus.status === InviteStatus.MAX_USES) {
    return (
      <ErrorPage
        error={{
          code: "403",
          title: "Maximum uses reached",
          description:
            "The invite has reached the maximum number of uses. Ask the group members to generate a new invite.",
        }}
      />
    );
  }
  const callbackURL = `/invite/${classGroupId}/${token}`;
  if (!session) {
    redirect(`/sign-in?callbackURL=${callbackURL}`);
  }
  return (
    <div className="flex flex-col items-center justify-center">{children}</div>
  );
}
