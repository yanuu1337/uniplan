"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import dayjs from "dayjs";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "#/trpc/react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { FieldError } from "#/components/ui/field";

import { createEvent } from "./calendar-actions";
import { AddEventSchema } from "../schemas";

function fieldError(
  errors: Record<string, { message?: string } | undefined>,
  name: string,
) {
  const msg = errors[name]?.message;
  return msg ? [{ message: msg }] : undefined;
}

function FormField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: { message: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-foreground text-sm font-medium">
        {label}
      </label>
      {children}
      <FieldError className="text-xs" errors={error} />
    </div>
  );
}

function calendarUrlForWeek(
  start: Date,
  end: Date,
  weekOffset: number,
): string {
  const d = (x: Date) => dayjs(x).add(weekOffset, "week").format("YYYY-MM-DD");
  return `/calendar?startDate=${d(start)}&endDate=${d(end)}`;
}

export function CalendarMoveControls({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const router = useRouter();

  const goToPreviousWeek = () => {
    router.push(calendarUrlForWeek(startDate, endDate, -1));
  };
  const goToNextWeek = () => {
    router.push(calendarUrlForWeek(startDate, endDate, 1));
  };

  return (
    <>
      <Button onClick={goToPreviousWeek} variant="ghost" size="icon-sm">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button onClick={goToNextWeek} variant="ghost" size="icon-sm">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}

export function CalendarAddEvent() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof AddEventSchema>>({
    resolver: zodResolver(AddEventSchema),
    defaultValues: {
      name: "",
      description: "",
      start: new Date(),
      end: new Date(),
      groupId: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: userWithGroups } = api.user.getUserGroups.useQuery();

  const onSubmit = async (data: z.infer<typeof AddEventSchema>) => {
    setIsLoading(true);
    const start = dayjs(data.start);
    const end = dayjs(data.end);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) return;

    await createEvent({
      name: data.name,
      description: data.description,
      start: start.toDate(),
      end: end.toDate(),
      groupId: data.groupId,
    });
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:inline-flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void router.push("/groups");
          }}
        >
          Groups
          <CalendarIcon className="ml-1.5 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1"
        >
          {isOpen ? "Close" : "Add One-Time Event"}
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold">Add One-Time Event</DialogTitle>
          </DialogHeader>

          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormField
                  label="Event name"
                  id="event-name"
                  error={fieldError(errors, "name")}
                >
                  <Input
                    id="event-name"
                    placeholder="Enter a name"
                    {...field}
                  />
                </FormField>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <FormField
                  label="Description"
                  id="event-description"
                  error={fieldError(errors, "description")}
                >
                  <Textarea
                    id="event-description"
                    placeholder="Enter a description"
                    {...field}
                  />
                </FormField>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <FormField
                    label="Start"
                    id="event-start"
                    error={fieldError(errors, "start")}
                  >
                    <Input
                      id="event-start"
                      type="datetime-local"
                      value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? new Date(e.target.value)
                            : field.value,
                        )
                      }
                    />
                  </FormField>
                )}
              />
              <Controller
                control={control}
                name="end"
                render={({ field }) => (
                  <FormField
                    label="End"
                    id="event-end"
                    error={fieldError(errors, "end")}
                  >
                    <Input
                      id="event-end"
                      type="datetime-local"
                      value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? new Date(e.target.value)
                            : field.value,
                        )
                      }
                    />
                  </FormField>
                )}
              />
            </div>

            <Controller
              control={control}
              name="groupId"
              render={({ field }) => (
                <FormField
                  label="Group"
                  id="event-group"
                  error={fieldError(errors, "groupId")}
                >
                  <select
                    id="event-group"
                    className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border px-2 py-1 text-sm outline-none focus-visible:ring-2"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select a group</option>
                    {userWithGroups?.classGroupMemberships.map((m) => (
                      <option key={m.classGroupId} value={m.classGroupId}>
                        {m.classGroup.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}
            />

            <DialogFooter className="mt-2">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding event...
                  </>
                ) : (
                  "Add One-Time Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
