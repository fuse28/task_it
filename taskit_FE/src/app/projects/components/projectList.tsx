import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAllProjects, useDeleteProject } from "../hooks/project";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

interface Member {
  id: string;
  name?: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  team: Member[];
  createdAt: string;
}

function ProjectList({ projectListData }: { projectListData: Project[] }) {
  const router = useRouter();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { refetch } = useAllProjects();
  const handleDeleteProject = async (projectId: number) => {
    await deleteProject(projectId);
    refetch();
  };
  const handleNavigate = (name: string) => {
    const slug = slugify(name);
    router.push(`/projects/${slug}/tasks`);
  };
  return (
    <>
      {projectListData.map((project) => (
        <Card
          key={project.id}
          className="w-full transition hover:shadow-md"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center justify-between gap-2">
              <div
                className="cursor-pointer text-foreground hover:underline"
                onClick={() => handleNavigate(project.name)}
              >
                {project.name}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <TrashIcon className="w-4 h-4 text-white" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the project.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <div className="mt-2">
              <p className="text-sm font-medium">Team Members:</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {member.name?.[0] || member.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {member.name || member.email}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default ProjectList;
