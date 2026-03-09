import dayjs from "dayjs";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { ScrollArea, ScrollBar } from "#/components/ui/scroll-area";
import { cn } from "#/lib/utils";
import { CalendarItem } from "../../event/calendar-event";
import type { inferRouterOutputs } from "@trpc/server";
import type { eventRouter } from "#/server/api/routers/event";

type CalendarEvent = inferRouterOutputs<
  typeof eventRouter
>["getVisibleEvents"][number];

const DAY_COUNT = 7;

/**
 * Put each event in the column for its actual date (weekStart + index).
 * Column 0 = first day of week, column 6 = last. So an event on March 11
 * only appears in the column that shows March 11, not in every "Wednesday" column.
 */
function groupEventsByDay(
  events: CalendarEvent[],
  weekStart: dayjs.Dayjs,
): CalendarEvent[][] {
  const byDay: CalendarEvent[][] = Array.from({ length: DAY_COUNT }, () => []);
  const weekStartDay = weekStart.startOf("day");

  for (const event of events) {
    const eventDay = dayjs(event.startDateTime).startOf("day");
    const dayIndex = eventDay.diff(weekStartDay, "day");
    if (dayIndex >= 0 && dayIndex < DAY_COUNT) {
      byDay[dayIndex]?.push(event);
    }
  }

  byDay.forEach((dayEvents) =>
    dayEvents.sort(
      (a, b) =>
        dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf(),
    ),
  );

  return byDay;
}

function DayColumn({
  date,
  events,
  isToday,
}: {
  date: dayjs.Dayjs;
  events: CalendarEvent[];
  isToday: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-border bg-background-secondary min-w-[180px] rounded-xl border",
        isToday && "bg-orange-400/20",
      )}
    >
      <CardHeader className="pb-2">
        <h3 className="text-foreground text-sm font-semibold">
          {date.format("dddd")} - {date.format("DD MMMM")}
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-xs">No events</p>
        ) : (
          events.map((event) => <CalendarItem key={event.id} event={event} />)
        )}
      </CardContent>
    </Card>
  );
}

export function CalendarView({
  events,
  weekStart,
}: {
  events: CalendarEvent[];
  weekStart: Date;
}) {
  const start = dayjs(weekStart);
  const eventsByDay = groupEventsByDay(events, start);

  return (
    <ScrollArea className="border-border bg-background-secondary w-full rounded-xl border p-2 whitespace-nowrap">
      <div className="grid min-w-max grid-cols-1 gap-4 md:grid-cols-7">
        {Array.from({ length: DAY_COUNT }, (_, i) => {
          const date = start.add(i, "day");
          return (
            <DayColumn
              key={date.format("YYYY-MM-DD")}
              date={date}
              events={eventsByDay[i] ?? []}
              isToday={dayjs().isSame(date, "day")}
            />
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
