import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";

export function GroupListControls() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">
        <PlusIcon className="h-4 w-4" />
        Create a group
      </Button>
      <Button variant="secondary">
        <UserPlusIcon className="h-4 w-4" />
        Join a group
      </Button>
    </div>
  );
}
