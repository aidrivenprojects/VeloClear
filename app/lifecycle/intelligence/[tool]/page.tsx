import { ToolWorkspacePage } from "@/components/final/ToolWorkspacePage";

export default async function Page({
  params
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  return <ToolWorkspacePage phaseSlug="intelligence" toolSlug={tool} />;
}
