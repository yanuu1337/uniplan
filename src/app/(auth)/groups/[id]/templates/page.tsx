import { api } from "#/trpc/server";
import { TemplatesManager } from "#/components/group/templates-manager";

export default async function GroupTemplatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const templates = await api.event.getEventTemplates({ groupId: id });

  return <TemplatesManager groupId={id} templates={templates} />;
}
