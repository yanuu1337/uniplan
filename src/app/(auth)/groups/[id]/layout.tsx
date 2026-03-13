import ErrorPage from "#/components/error-page";
import { api } from "#/trpc/server";

export default async function GroupLayout({
  children,
  params,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const group = await api.group.getGroup({ id });
  if (!group) {
    return (
      <ErrorPage
        error={{
          title: "Group not found",
          code: "404",
          description: "The group you are looking for does not exist.",
        }}
      />
    );
  }
  return <>{children}</>;
}
