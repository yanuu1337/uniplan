"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
  DateRangePicker,
  TimePicker,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { AddRecurringEventSchema } from "./schema";
import { Loader2 } from "lucide-react";

export function AddRecurringEvent({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (
    data: z.infer<typeof AddRecurringEventSchema>,
  ) => Promise<{ success: boolean; errors: Record<string, string[]> }>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof AddRecurringEventSchema>>({
    resolver: zodResolver(AddRecurringEventSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      weekday: 0,
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof AddRecurringEventSchema>) => {
    setIsLoading(true);
    await action(data);
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recurring Event</DialogTitle>
          <DialogDescription>
            Add a recurring event to your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input id="name" {...field} />
                  <FieldError />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea id="description" {...field} />
                  <FieldError />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState, formState }) => {
                const endDate = form.watch("endDate");
                const startError = fieldState.error?.message
                  ? { message: fieldState.error.message }
                  : undefined;
                const endFieldError = formState.errors.endDate;
                const endError =
                  endFieldError &&
                  "message" in endFieldError &&
                  endFieldError.message
                    ? { message: endFieldError.message }
                    : undefined;

                return (
                  <Field
                    data-invalid={
                      fieldState.invalid || !!formState.errors.endDate
                    }
                  >
                    <FieldLabel>Date Range</FieldLabel>
                    <DateRangePicker
                      value={{
                        from: field.value,
                        to: endDate,
                      }}
                      onChange={(range) => {
                        if (range?.from) {
                          field.onChange(range.from);
                        }
                        if (range?.to) {
                          form.setValue("endDate", range.to, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                    <FieldError errors={[startError, endError]} />
                  </Field>
                );
              }}
            />
            <Controller
              control={form.control}
              name="weekday"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Weekday</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a weekday" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                      <SelectItem value="0">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Start Time</FieldLabel>
                  <TimePicker
                    id="startTime"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>End Time</FieldLabel>
                  <TimePicker
                    id="endTime"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError />
                </Field>
              )}
            />
            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Recurring Event"
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
