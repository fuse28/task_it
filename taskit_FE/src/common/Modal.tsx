import {
  useAllUsers,
  useCreateProject,
} from "@/app/projects/hooks/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Controller, useForm } from "react-hook-form";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface TeamOption {
  value: string;
  label: string;
}

export default function CreateProjectModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { data: users = [], isLoading: usersLoading } = useAllUsers(visible);
  const { mutateAsync: createProject, isPending } = useCreateProject();
  const teamOptions: TeamOption[] = users.map((user: User) => ({
    value: user.id,
    label: user.name || user.email,
  }));

  type FormValues = {
    projectName: string;
    projectDescription: string;
    projectTeam: TeamOption[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      projectName: "",
      projectDescription: "",
      projectTeam: [],
    },
    mode: "onSubmit",
  });

  const onSave = async (values: FormValues) => {
    try {
      await createProject({
        name: values.projectName,
        description: values.projectDescription,
        teamMemberIds: values.projectTeam.map((item) => item.value),
      });
      setVisible(false);
      reset();
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  return (
    <div>
      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSave)}>
            <DialogHeader>
              <DialogTitle>Name Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3 mt-5">
                <Label htmlFor="projectName">Name</Label>
                <Input
                  id="projectName"
                  placeholder="Project Name"
                  {...register("projectName", {
                    required: "Project Name is required",
                  })}
                />
                {errors.projectName && (
                  <p className="text-sm text-destructive">
                    {errors.projectName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="projectDescription">Description</Label>
                <Input
                  id="projectDescription"
                  placeholder="project description"
                  {...register("projectDescription")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Team (optional)</Label>
                <Controller
                  control={control}
                  name="projectTeam"
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      options={teamOptions}
                      value={value ?? []}
                      onValueChange={onChange}
                      placeholder={usersLoading ? "Loading team members..." : "Add teammates"}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  You&apos;re added automatically. Only people on the team can see this project.
                </p>
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
