"use client";
import type { inferRouterOutputs } from "@trpc/server";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  Copy,
  Label,
} from "../ui";
import { useState } from "react";
import { LinkIcon, Loader2, UserPlusIcon } from "lucide-react";
import { createGroupInvite } from "./actions";
import type { userRouter } from "#/server/api/routers/user";
import dayjs from "dayjs";
type UserGroup = NonNullable<
  inferRouterOutputs<typeof userRouter>["getUserGroups"]
>["classGroupMemberships"][number];

export const InviteToGroup = ({
  children,
  group,
}: {
  children: React.ReactNode;
  group: UserGroup;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to group</DialogTitle>
          <DialogDescription>
            Invite user(s) to {group.classGroup.name}, so they can view events.
          </DialogDescription>
        </DialogHeader>
        <h1 className="text-lg font-medium">Send e-mail invite:</h1>
        <InviteToGroupByEmail group={group} />
        <Separator />
        <h1 className="text-lg font-medium">Or generate a link:</h1>
        <InviteToGroupByLink group={group} />
      </DialogContent>
    </Dialog>
  );
};

export const InviteToGroupByLink = ({ group }: { group: UserGroup }) => {
  const [duration, setDuration] = useState<"1" | "7" | "30" | "90" | "none">(
    "1",
  );
  const [usageLimit, setUsageLimit] = useState(0);
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ generic?: string[] }>({});
  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);
    const durationNumber = duration === "none" ? undefined : parseInt(duration);

    const result = await createGroupInvite({
      classGroupId: group.classGroup.id,
      expiresAt: durationNumber
        ? dayjs().add(durationNumber, "day").toDate()
        : undefined,
      maxUses: usageLimit > 0 ? usageLimit : 0,
    });
    if (result.success) {
      setLink(result.url);
    } else if (!result.success && result.errors) {
      if ("generic" in result.errors && result.errors.generic) {
        setErrors({ generic: result.errors.generic });
      }
    }

    setIsLoading(false);
  };
  return (
    <div className="flex flex-col space-y-2 rounded-lg p-4">
      <Label>Link duration</Label>
      <Select
        value={duration}
        onValueChange={(value) =>
          setDuration(value as "1" | "7" | "30" | "90" | "none")
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select link duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 day</SelectItem>
          <SelectItem value="7">7 days</SelectItem>
          <SelectItem value="30">30 days</SelectItem>
          <SelectItem value="none">No expiration (dangerous!)</SelectItem>
        </SelectContent>
      </Select>
      <Label>Link usage limit</Label>
      <Input
        type="number"
        placeholder="0"
        value={usageLimit}
        onChange={(e) => setUsageLimit(parseInt(e.target.value))}
      />
      <Copy
        disabled={!(link.length > 0)}
        disabledMessage="Link will be generated when you click the button"
        value={link}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
        {isLoading ? "Generating..." : "Generate"}
      </Button>
      {errors.generic && (
        <p className="text-destructive text-xs">{errors.generic.join(", ")}</p>
      )}
    </div>
  );
};

export const InviteToGroupByEmail = ({ group }: { group: UserGroup }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ generic?: string[] }>({});
  const handleSubmit = async () => {
    setSuccess(false);
    setErrors({});
    setIsLoading(true);
    const result = await createGroupInvite({
      email,
      classGroupId: group.classGroup.id,
      maxUses: 1,
    });
    if (!result.success && result.errors) {
      if ("generic" in result.errors && result.errors.generic) {
        setErrors({ generic: result.errors.generic });
      }
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="border-border flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <UserPlusIcon className="h-4 w-4" />
          Invite
        </Button>
      </div>
      <p>
        {success && (
          <p className="text-xs text-green-500">Invite sent to {email}</p>
        )}
      </p>
      {errors.generic && (
        <p className="text-destructive text-xs">{errors.generic.join(", ")}</p>
      )}
    </div>
  );
};
