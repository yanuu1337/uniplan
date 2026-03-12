import type { APISession } from "#/server/better-auth/server";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenuSeparator,
} from "./ui";
import { auth } from "#/server/better-auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Calendar, LogOut, Users } from "lucide-react";

export const NavProfile = ({ session }: { session: APISession }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-border border-spacing-2 rounded-full border p-1">
        <Avatar className="">
          <AvatarImage src={session?.user?.image ?? ""} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Calendar className="size-4" />
          <Link href="/calendar">Calendar</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users className="size-4" />
          <Link href="/groups">Groups</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            revalidatePath("/");
            revalidatePath("/", "layout");
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
