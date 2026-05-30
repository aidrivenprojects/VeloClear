import { PhaseWorkspacePage } from "@/components/final/PhaseWorkspacePage";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PhaseWorkspacePage projectId={id} phaseSlug="stakeholders" />;
}
