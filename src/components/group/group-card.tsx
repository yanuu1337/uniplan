import { Button } from "#/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
  CardContent,
} from "#/components/ui/card";
import type { groupRouter } from "#/server/api/routers/group";
import type { inferRouterOutputs } from "@trpc/server";
import { ClassGroupType } from "generated/prisma";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { TooltipContent, TooltipTrigger, Tooltip } from "../ui/tooltip";

type UserGroup = NonNullable<
  inferRouterOutputs<typeof groupRouter>["getUserGroups"]
>["classGroupMemberships"][number];

export function GroupCard({ group }: { group: UserGroup }) {
  const isPersonal = group.classGroup.type === ClassGroupType.PERSONAL;
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
                disabled={isPersonal}
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
        <Button variant="outline" size="sm" className="gap-1">
          <CalendarIcon className="h-4 w-4" />
          Add Recurring Event
        </Button>
      </CardFooter>
    </Card>
  );
}
