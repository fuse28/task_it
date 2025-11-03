import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAllProjects } from "../hooks/project";

function ProjectList() {
  const { data: projects, isLoading } = useAllProjects();
  if (isLoading) return <div>Loading...</div>;
  console.log(projects);

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition cursor-pointer">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">ABSLI</CardTitle>
        {project.description && (
          <p className="text-sm text-muted-foreground mt-1">jsdhjsdjhsdjs</p>
        )}
      </CardHeader>

      <CardContent>
        <div className="mt-2">
          <p className="text-sm font-medium">Team Members:</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.team.map((member: any) => (
              <div key={member.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.name?.[0] || member.email[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.name || member.email}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}

export default ProjectList;
