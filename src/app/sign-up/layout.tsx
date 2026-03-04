import { getSession } from "#/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function SignUpLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (session) {
        redirect("/");
    }
    return (
        <div className="">
            {children}
        </div>
    )
}