"use client";

import dayjs from "dayjs";
import { Card, CardContent } from "../../ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import type { eventRouter } from "#/server/api/routers/event";
import { cn, hexWithAlpha } from "#/lib/utils";

type Event = inferRouterOutputs<typeof eventRouter>["getVisibleEvents"][number];

export function CalendarItem({ event }: { event: Event }) {
  const timeRange = `${dayjs(event.startDateTime).format("HH:mm")} - ${dayjs(event.endDateTime).format("HH:mm")}`;
  const cardStyle = event.memberColor
    ? { backgroundColor: hexWithAlpha(event.memberColor, 0.1) }
    : undefined;

  return (
    <Card
      size="sm"
      className={cn(
        "rounded-md border-none shadow-none",
        !event.memberColor && "bg-accent/10",
      )}
      style={cardStyle}
    >
      <CardContent className="gap-1 rounded-md px-2 py-2 text-xs">
        <p className="text-foreground font-medium">{event.name}</p>
        <p className="text-muted-foreground text-[11px]">{timeRange}</p>
        {event.description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px]">
            {event.description}
          </p>
        )}
        <p className="text-muted-foreground text-[11px]">
          {event.classGroup.name}
        </p>
      </CardContent>
    </Card>
  );
}
