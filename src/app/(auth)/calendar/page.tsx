"use server";

import dayjs from "dayjs";
import { HydrateClient, api } from "#/trpc/server";
import {
  CalendarAddEvent,
  CalendarMoveControls,
} from "#/components/calendar/view/calendar-controls";
import { CalendarView } from "#/components/calendar/view/calendar-view";

async function getWeekRange(
  searchParams: Promise<{ startDate?: string; endDate?: string }>,
) {
  const { startDate, endDate } = await searchParams;

  const today = dayjs();
  const weekday = today.day();
  const daysSinceMonday = (weekday + 6) % 7;
  const defaultStart = today.subtract(daysSinceMonday, "day").startOf("day");

  const start = startDate ? dayjs(startDate).startOf("day") : defaultStart;
  const end = endDate
    ? dayjs(endDate).endOf("day")
    : start.add(6, "day").endOf("day");

  return { start, end };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const { start, end } = await getWeekRange(searchParams);
  const events = await api.event.getVisibleEvents({
    startDate: start.toDate(),
    endDate: end.toDate(),
  });

  return (
    <HydrateClient>
      <main className="border-background-secondary shadow-foreground/10 flex flex-col gap-4 rounded-xl border p-8 shadow-md md:items-center md:justify-center">
        <h1 className="text-4xl font-bold">Weekly Calendar</h1>
        <div className="flex w-full justify-between">
          <div>
            <CalendarMoveControls
              startDate={start.toDate()}
              endDate={end.toDate()}
            />
          </div>
          <div>
            <CalendarAddEvent />
          </div>
        </div>
        <CalendarView events={events} weekStart={start.toDate()} />
      </main>
    </HydrateClient>
  );
}
