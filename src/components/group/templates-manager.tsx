"use client";

import type { RecurringEventTemplate } from "generated/prisma";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "#/components/ui";
import { AddRecurringEvent } from "#/components/event/add-recurring-event";
import {
  createRecurringEvent,
  deleteRecurringEventTemplate,
} from "#/components/event/actions";
import { EditRecurringEventTemplateDialog } from "#/components/event/edit-recurring-event-template";

const weekdayLabels: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function TemplatesManager({
  groupId,
  templates,
}: {
  groupId: string;
  templates: RecurringEventTemplate[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [templateToDelete, setTemplateToDelete] =
    useState<RecurringEventTemplate | null>(null);

  const handleDelete = () => {
    if (!templateToDelete) return;
    startTransition(async () => {
      const result = await deleteRecurringEventTemplate(
        templateToDelete.id,
        groupId,
      );
      if (result.success) {
        setTemplateToDelete(null);
        router.refresh();
      }
    });
  };

  const hasTemplates = templates.length > 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Recurring event templates</h1>
          <p className="text-muted-foreground text-sm">
            Manage recurring schedules for this group. Editing a template
            updates all its events. For overrides, only the date gets updated
            (override time stays the same).
          </p>
        </div>
        <AddRecurringEvent
          action={async (data) => {
            const result = await createRecurringEvent(data, groupId);
            return {
              success: result.success ?? false,
              errors: result.errors ?? {},
            };
          }}
        >
          <Button size="sm" disabled={isPending}>
            Add recurring event
          </Button>
        </AddRecurringEvent>
      </div>

      {hasTemplates ? (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription>{template.description}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <EditRecurringEventTemplateDialog
                    template={template}
                    onUpdated={() => router.refresh()}
                  >
                    <Button size="xs" variant="outline">
                      Edit
                    </Button>
                  </EditRecurringEventTemplateDialog>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => setTemplateToDelete(template)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                <div className="flex flex-col gap-1">
                  <span>
                    {template.weekday != null
                      ? (weekdayLabels[template.weekday] ?? "Custom")
                      : "One-off schedule"}
                  </span>
                  <span>
                    {dayjs(template.startTime).format("HH:mm")} –{" "}
                    {dayjs(template.endTime).format("HH:mm")}
                  </span>
                  <span>
                    From {dayjs(template.startDate).format("MMM D, YYYY")}
                    {template.endDate
                      ? ` to ${dayjs(template.endDate).format("MMM D, YYYY")}`
                      : " (no end date)"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-sm">
              No recurring templates yet. Create one to define a schedule for
              repeating events in this group.
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!templateToDelete}
        onOpenChange={(open) => {
          if (!open) setTemplateToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This will delete the template and all of its generated events. All
            events tied directly to this template will be removed, including
            overrides. This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setTemplateToDelete(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
