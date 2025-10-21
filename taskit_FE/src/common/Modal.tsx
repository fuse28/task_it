import { useAllUsers } from "@/app/projects/hooks/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Modal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState([]);

  const { data: user = [], isLoading } = useAllUsers();

  const teamOptions = user.map((user: any) => ({
    value: user.id,
    label: user.name || user.email,
  }));

  type FormValues = {
    projectName: string;
    projectDescription: string;
    projectTeam: string[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
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

  const onSave = (values: FormValues) => {
    console.log("submit", values);
  };

  return (
    <div className="card flex  justify-content-center">
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
                  <p className="text-sm text-red-600">
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
                <Label htmlFor="username-1">Team</Label>
                <Controller
                  control={control}
                  name="projectTeam"
                  rules={{
                    validate: (v) =>
                      (Array.isArray(v) && v.length > 0) ||
                      "Select at least one team member",
                  }}
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      options={teamOptions}
                      value={value ?? []}
                      onValueChange={onChange}
                      placeholder="Choose team"
                    />
                  )}
                />
                {errors.projectTeam && (
                  <p className="text-sm text-red-600">
                    {errors.projectTeam.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
