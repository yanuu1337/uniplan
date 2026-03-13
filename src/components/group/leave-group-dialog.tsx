import {
  Button,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "#/components/ui";
import { useState } from "react";
import { leaveGroup } from "./actions";

export const LeaveGroupDialog = ({
  children,
  classGroupId,
}: {
  children: React.ReactNode;
  classGroupId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave group</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to leave this group? This action cannot be
          undone. You will need to be invited back to join again. You will also
          lose access to any events you have created.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              const result = await leaveGroup({ classGroupId });
              if (result.success) {
                setIsOpen(false);
              } else {
                return result.errors;
              }
            }}
          >
            Leave
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
