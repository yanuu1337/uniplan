import { GroupCard } from "#/components/group/group-card";
import { GroupListControls } from "#/components/group/group-list-controls";
import { api } from "#/trpc/server";

export default async function ManageCalendarsPage() {
  const userGroups = await api.user.getUserGroups();
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 md:px-16">
      <h1 className="text-4xl font-bold">Your Groups</h1>
      <GroupListControls />
      {userGroups?.classGroupMemberships.map((group) => (
        <GroupCard key={group.classGroupId + 1} group={group} />
      ))}
    </div>
  );
}
