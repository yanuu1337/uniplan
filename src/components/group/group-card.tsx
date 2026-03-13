"use client";
import type { userRouter } from "#/server/api/routers/user";
import type { inferRouterOutputs } from "@trpc/server";
import { ClassGroupType } from "generated/prisma";
import {
  CalendarIcon,
  EllipsisIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
  Settings2Icon,
} from "lucide-react";
// import { AddRecurringEvent } from "#/components/event/add-recurring-event";
// import { createRecurringEvent } from "../event/actions";
import { InviteToGroup } from "./group-invite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
  CardContent,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui";
import { LeaveGroupDialog } from "./leave-group-dialog";
import Link from "next/link";
import { GroupPreferencesDialog } from "./group-preferences-dialog";

type UserGroup = NonNullable<
  inferRouterOutputs<typeof userRouter>["getUserGroups"]
>["classGroupMemberships"][number];

export function GroupCard({ group }: { group: UserGroup }) {
  const isPersonal = group.classGroup.type === ClassGroupType.PERSONAL;
  const isOwner = group.role === "OWNER";
  return (
    <Card className="w-full min-w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {group.classGroup.name}
          <CalendarIcon className="h-5 w-5" />
        </CardTitle>
        <CardDescription>
          {group.classGroup.description ?? "No description"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1 text-sm">
        <p>{group.classGroup.members.length} members</p>
        <p>{group.classGroup.events.length} events</p>
      </CardContent>

      <CardFooter className="gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisIcon className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Tooltip>
              <TooltipTrigger className="w-full cursor-pointer">
                <InviteToGroup group={group}>
                  <DropdownMenuItem
                    disabled={isPersonal}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <UserPlusIcon />
                    Invite
                  </DropdownMenuItem>
                </InviteToGroup>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isPersonal
                    ? "You cannot invite to a personal group"
                    : "Invite to group"}
                </p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuItem disabled>
              <UsersIcon className="h-4 w-4" />
              Manage members
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/groups/${group.classGroup.id}/templates`}>
                <CalendarIcon className="h-4 w-4" />
                Manage recurring events
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <GroupPreferencesDialog
              classGroupId={group.classGroup.id}
              initialIsVisible={group.isVisible}
              initialColor={group.color}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Settings2Icon className="h-4 w-4" />
                Preferences
              </DropdownMenuItem>
            </GroupPreferencesDialog>

            <DropdownMenuSeparator />
            <Tooltip>
              <TooltipTrigger className="w-full cursor-pointer">
                <LeaveGroupDialog classGroupId={group.classGroup.id}>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isPersonal || isOwner}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Leave
                  </DropdownMenuItem>
                </LeaveGroupDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isPersonal
                    ? "You cannot leave a personal group"
                    : isOwner
                      ? "You cannot leave a group you are the owner of"
                      : "Leave group"}
                </p>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
