import { useState } from "react";
import { TrashIcon } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";

import type { eventRouter } from "#/server/api/routers/event";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "../ui";
import { deleteEvent } from "./actions";

type Event = inferRouterOutputs<typeof eventRouter>["getVisibleEvents"][number];

export const DeleteEvent = ({ event }: { event: Event }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const isTemplateBacked = !!event.templateId;

  if (isTemplateBacked) {
    return (
      <div className="flex flex-col gap-1">
        <Button
          variant="destructive"
          size="sm"
          className="gap-1"
          disabled
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </Button>
        <p className="text-muted-foreground text-xs">
          This event is part of a recurring series and can&apos;t be deleted
          directly. Update or delete the template instead.
        </p>
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteEvent(event.id);
    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1">
          <TrashIcon className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this event?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this one-time event from the calendar.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="default"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
