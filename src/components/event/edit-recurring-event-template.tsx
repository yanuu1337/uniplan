"use client";

import type { RecurringEventTemplate } from "generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import type { z } from "zod";

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
} from "#/components/ui";
import { AddRecurringEventSchema } from "./schema";
import { updateRecurringEventTemplate } from "./actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type FormValues = z.infer<typeof AddRecurringEventSchema>;

const weekdayOptions = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

function templateToDefaults(template: RecurringEventTemplate): FormValues {
  return {
    name: template.name,
    description: template.description ?? "",
    startDate: template.startDate,
    endDate: template.endDate ?? template.startDate,
    weekday: template.weekday ?? 0,
    startTime: template.startTime,
    endTime: template.endTime,
  };
}

export function EditRecurringEventTemplateDialog({
  template,
  onUpdated,
  children,
}: {
  template: RecurringEventTemplate;
  onUpdated?: () => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(AddRecurringEventSchema),
    defaultValues: templateToDefaults(template),
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset(templateToDefaults(template));
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const result = await updateRecurringEventTemplate(
      template.id,
      template.classGroupId,
      values,
    );
    setIsLoading(false);

    if (!result.success && "generic" in result.errors) {
      const generic = result.errors?.generic;
      if (generic?.length) {
        toast.error(generic.join(", "));
      } else {
        toast.error("Failed to update recurring event");
      }
      return;
    }

    toast.success("Recurring event updated");
    setIsOpen(false);
    if (onUpdated) onUpdated();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit recurring event</DialogTitle>
          <DialogDescription>
            Changes will apply to all occurrences in this series that do not
            have overrides.
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
                      {weekdayOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
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
                "Save changes"
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
