"use client";

import dayjs from "dayjs";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";

import type { eventRouter } from "#/server/api/routers/event";
import { cn, hexWithAlpha } from "#/lib/utils";
import { useMediaQuery } from "#/lib/media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
  Card,
  CardContent,
} from "../ui";
import { EventOverrideDialog } from "./event-override-dialog";
import { EventStatus } from "generated/prisma";

type Event = inferRouterOutputs<typeof eventRouter>["getVisibleEvents"][number];

export function CalendarItem({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const displayName = event.overrideName ?? event.name;
  const displayDescription = event.overrideDescription ?? event.description;
  const displayStart = event.overrideStartTime ?? event.startDateTime;
  const displayEnd = event.overrideEndTime ?? event.endDateTime;
  const isCancelled = event.status === EventStatus.CANCELLED;
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <EventCard event={event} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={cn(isCancelled && "line-through")}>
              {displayName}
            </DialogTitle>
            <DialogDescription>
              {dayjs(displayStart).format("HH:mm")} -{" "}
              {dayjs(displayEnd).format("HH:mm")}
            </DialogDescription>
            {displayDescription && (
              <DialogDescription>{displayDescription}</DialogDescription>
            )}
            <DialogDescription>{event.classGroup.name}</DialogDescription>
          </DialogHeader>
          <EventOverrideDialog event={event} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      direction="bottom"
      onOpenChange={setOpen}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        <div>
          <EventCard event={event} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="overflow-auto">
        <DrawerHeader>
          <DrawerTitle className={cn(isCancelled && "line-through")}>
            -{displayName}
          </DrawerTitle>
          <DrawerDescription>
            {dayjs(displayStart).format("HH:mm")} -{" "}
            {dayjs(displayEnd).format("HH:mm")}
          </DrawerDescription>
          {displayDescription && (
            <DrawerDescription>{displayDescription}</DrawerDescription>
          )}
          <DrawerDescription>{event.classGroup.name}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <EventOverrideDialog event={event} />
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function EventCard({ event }: { event: Event }) {
  const displayName = event.overrideName ?? event.name;
  const displayDescription = event.overrideDescription ?? event.description;
  const displayStart = event.overrideStartTime ?? event.startDateTime;
  const displayEnd = event.overrideEndTime ?? event.endDateTime;
  const isCancelled = event.status === EventStatus.CANCELLED;

  const timeRange = `${dayjs(displayStart).format("HH:mm")} - ${dayjs(
    displayEnd,
  ).format("HH:mm")}`;
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
        <p
          className={cn(
            isCancelled && "line-through",
            "text-foreground font-medium",
          )}
        >
          {displayName}
        </p>
        <p
          className={cn(
            isCancelled && "line-through",
            "text-muted-foreground text-[11px]",
          )}
        >
          {timeRange}
        </p>
        {displayDescription && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px]">
            {displayDescription}
          </p>
        )}
        <p className="text-muted-foreground text-[11px]">
          {event.classGroup.name}
        </p>
      </CardContent>
    </Card>
  );
}
