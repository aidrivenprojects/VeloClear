import { ProjectDetail } from "@/components/projects/ProjectDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetail projectId={params.id} />;
}
