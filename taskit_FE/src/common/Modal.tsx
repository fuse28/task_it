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

  return (
    <div className="card flex  justify-content-center">
      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent className="sm:max-w-[425px]">
          <form>
            <DialogHeader>
              <DialogTitle>Name Project</DialogTitle>
              <DialogDescription>
                Name your project here, so that you can easily identify it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Project Name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Description</Label>
                <Input id="username-1" name="username" defaultValue="" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Team</Label>
                <MultiSelect
                  options={teamOptions}
                  value={selectedTeam}
                  onValueChange={setSelectedTeam}
                  placeholder="Choose team"
                />
              </div>
            </div>
            <DialogFooter>
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
