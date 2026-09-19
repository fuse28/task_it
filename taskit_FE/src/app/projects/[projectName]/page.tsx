import { redirect } from "next/navigation";

interface PageProps {
  params: {
    projectName: string;
  };
}

export default function ProjectPage({ params }: PageProps) {
  redirect(`/projects/${params.projectName}/tasks`);
}
