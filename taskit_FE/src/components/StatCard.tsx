import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10", iconClassName)}>
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
