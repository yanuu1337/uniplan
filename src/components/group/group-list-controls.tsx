import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CreateGroupDialog } from "./create-group";

export function GroupListControls() {
  return (
    <div className="flex items-center gap-2">
      <CreateGroupDialog>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          Create a group
        </Button>
      </CreateGroupDialog>
    </div>
  );
}
