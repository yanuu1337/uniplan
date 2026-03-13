import { api } from "#/trpc/server";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "#/components/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function InvitePage({
  params,
}: {
  params: Promise<{ classGroupId: string; token: string }>;
}) {
  const { classGroupId, token } = await params;
  const isInGroupAlready = await api.user.getUserGroups();
  const group = await api.group.getGroup({ id: classGroupId });
  if (
    isInGroupAlready?.classGroupMemberships.some(
      (group) => group.classGroupId === classGroupId,
    )
  ) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent>
            <CardHeader>
              <CardTitle>You are already in this group.</CardTitle>
              <CardDescription>
                Perhaps you opened this page again by mistake. You can see your
                groups{" "}
                <Link href="/groups" className="text-primary underline">
                  here
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="lg" asChild>
                <Link href="/groups">Go to groups</Link>
              </Button>
            </CardContent>
            <CardFooter></CardFooter>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <CardHeader>
            <CardTitle>Accept Invitation</CardTitle>
            <CardDescription>
              Are you sure you want to join{" "}
              <span className="font-extrabold">&quot;{group?.name}&quot;</span>?
            </CardDescription>
          </CardHeader>
          Joining this group will give you access to the events and recurring
          event templates in the group.
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="cursor-pointer"
            onClick={async () => {
              "use server";
              await api.user.joinGroup({
                token,
                groupId: classGroupId,
              });
              redirect(`/groups`);
            }}
          >
            Accept Invitation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
