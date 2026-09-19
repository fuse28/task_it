"use client";

import MainLayout from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PencilRulerIcon,
  UploadIcon,
  PenLineIcon,
  ShapesIcon,
  TypeIcon,
  EraserIcon,
  PaletteIcon,
  LayersIcon,
  MoreVerticalIcon,
} from "lucide-react";

const tools = [
  { name: "Pen Tool", icon: PenLineIcon, description: "Freehand drawing" },
  { name: "Shape Tool", icon: ShapesIcon, description: "Geometric shapes" },
  { name: "Text Tool", icon: TypeIcon, description: "Add text annotations" },
  { name: "Eraser", icon: EraserIcon, description: "Remove elements" },
  { name: "Color Picker", icon: PaletteIcon, description: "Select colors" },
  { name: "Layers", icon: LayersIcon, description: "Manage layers" },
];

const recentDrawings = [
  { name: "UI Wireframe v1", date: "2 hours ago" },
  { name: "User Flow Sketch", date: "1 day ago" },
  { name: "Logo Concepts", date: "3 days ago" },
  { name: "Dashboard Layout", date: "1 week ago" },
  { name: "Mobile App Design", date: "2 weeks ago" },
  { name: "Website Mockup", date: "3 weeks ago" },
];

export default function DrawingBoardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader
          title="Drawing Board"
          description="Create sketches, wireframes, and visual designs"
          actions={
            <>
              <Button>
                <PencilRulerIcon className="size-4" />
                New Drawing
              </Button>
              <Button variant="secondary">
                <UploadIcon className="size-4" />
                Upload Image
              </Button>
            </>
          }
        />

        <div className="h-96 rounded-lg border border-border bg-card">
          <EmptyState
            icon={PencilRulerIcon}
            title="No drawing board"
            description="Start creating by opening a new drawing board."
            className="h-full justify-center"
            action={<Button>Create Drawing Board</Button>}
          />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Drawing Tools</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool) => (
              <Card key={tool.name} className="cursor-pointer text-center transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-2">
                  <tool.icon className="size-6 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">{tool.name}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Drawings</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentDrawings.map((drawing) => (
              <Card key={drawing.name} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <PencilRulerIcon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{drawing.name}</h4>
                    <p className="text-sm text-muted-foreground">{drawing.date}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVerticalIcon className="size-5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
