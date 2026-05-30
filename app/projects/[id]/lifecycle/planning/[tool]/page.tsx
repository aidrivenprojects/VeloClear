import { ToolWorkspacePage } from "@/components/final/ToolWorkspacePage";

export default async function Page({
  params
}: {
  params: Promise<{ id: string; tool: string }>;
}) {
  const { id, tool } = await params;
  return <ToolWorkspacePage projectId={id} phaseSlug="planning" toolSlug={tool} />;
}
