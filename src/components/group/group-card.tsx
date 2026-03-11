"use client";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
  CardContent,
} from "#/components/ui/card";
import type { userRouter } from "#/server/api/routers/user";
import type { inferRouterOutputs } from "@trpc/server";
import { ClassGroupType } from "generated/prisma";
import { CalendarIcon, TrashIcon, UserPlusIcon } from "lucide-react";
import { TooltipContent, TooltipTrigger, Tooltip } from "../ui/tooltip";
import { AddRecurringEvent } from "#/components/event/add-recurring-event";
import { createRecurringEvent } from "../event/actions";
import { InviteToGroup } from "./group-invite";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-fit">
              <Button
                variant="destructive"
                disabled={isPersonal || isOwner}
                size="sm"
                className="gap-1"
              >
                <TrashIcon className="h-4 w-4" />
                Leave
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isPersonal ? "You cannot leave a personal group" : "Leave group"}
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-fit">
              <InviteToGroup group={group}>
                <Button
                  disabled={isPersonal}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Invite
                </Button>
              </InviteToGroup>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isPersonal
                ? "You cannot invite to a personal group"
                : "Invite to group"}
            </p>
          </TooltipContent>
        </Tooltip>
        <AddRecurringEvent
          action={async (data) => {
            const result = await createRecurringEvent(
              data,
              group.classGroup.id,
            );
            return {
              success: result.success ?? false,
              errors: result.errors ?? {},
            };
          }}
        >
          <Button variant="outline" size="sm" className="gap-1">
            <CalendarIcon className="h-4 w-4" />
            Add Recurring Event
          </Button>
        </AddRecurringEvent>
      </CardFooter>
    </Card>
  );
}
