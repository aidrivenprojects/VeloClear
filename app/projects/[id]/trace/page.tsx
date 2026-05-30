import { TracePage } from "@/components/graph/TracePage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TracePage projectId={id} />;
}
