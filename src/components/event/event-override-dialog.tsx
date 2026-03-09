import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { EventOverrideSchema } from "./schema";
import type { eventRouter } from "#/server/api/routers/event";
import type { inferRouterOutputs } from "@trpc/server";
import type z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Textarea,
  TimePicker,
  Button,
  DialogFooter,
  Checkbox,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "../ui";

import { Input } from "../ui/input";
import { EventStatus } from "generated/prisma";
import { overrideEvent } from "./actions";
import { DeleteEvent } from "./delete-event";
type Event = inferRouterOutputs<typeof eventRouter>["getVisibleEvents"][number];

export function EventOverrideDialog({ event }: { event: Event }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof EventOverrideSchema>>({
    resolver: zodResolver(EventOverrideSchema),
    defaultValues: {
      name: event.overrideName ?? event.name,
      description: event.overrideDescription ?? event.description ?? "",
      startTime: event.overrideStartTime ?? event.startDateTime,
      endTime: event.overrideEndTime ?? event.endDateTime,
      cancelEvent: event.status === EventStatus.CANCELLED || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof EventOverrideSchema>) => {
    setIsSubmitting(true);
    const result = await overrideEvent(event.id, values);
    setIsSubmitting(false);

    if (result.success) {
      setIsOpen(false);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage Overrides
        </Button>
      </DialogTrigger>
      <DialogContent className={"max-h-full overflow-y-scroll"}>
        <DialogHeader>
          <DialogTitle>Override this occurrence</DialogTitle>
          <DialogDescription>
            Changes here affect only this single event instance. The recurring
            template and other occurrences will not be modified.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="override-name">Name</FieldLabel>
                  <Input id="override-name" {...field} />
                  <FieldError errors={[errors.name]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="override-description">
                    Description
                  </FieldLabel>
                  <Textarea id="override-description" rows={3} {...field} />
                  <FieldError errors={[errors.description]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="override-start-time">
                      Start time
                    </FieldLabel>
                    <TimePicker
                      id="override-start-time"
                      value={field.value}
                      disabled={form.watch("cancelEvent")}
                      onChange={field.onChange}
                    />
                    <FieldError errors={[errors.startTime]} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="override-end-time">
                      End time
                    </FieldLabel>
                    <TimePicker
                      disabled={form.watch("cancelEvent")}
                      id="override-end-time"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FieldError errors={[errors.endTime]} />
                  </Field>
                )}
              />
            </div>
            <FieldLabel>
              <Field orientation="horizontal">
                <Checkbox
                  id="override-cancel-event"
                  checked={form.watch("cancelEvent")}
                  onCheckedChange={(checked) =>
                    form.setValue(
                      "cancelEvent",
                      checked === "indeterminate" ? undefined : checked,
                    )
                  }
                />
                <FieldContent>
                  <FieldTitle>Cancel Event</FieldTitle>
                  <FieldDescription>
                    This will cancel the event for this occurrence.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <DeleteEvent event={event} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="mt-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save override"
                )}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
