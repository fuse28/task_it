"use client";

import { useState, useCallback } from "react";
import MainLayout from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { WorkflowIcon, UploadIcon } from "lucide-react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Edge,
  type Node,
  type Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function FlowDiagramPage() {
  const [showFlow, setShowFlow] = useState(false);

  const [nodes] = useState<Node[]>([
    {
      id: "1",
      position: { x: 250, y: 20 },
      data: { label: "Start Node" },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Flow Diagram"
          description="Create and manage process flow diagrams"
          actions={
            <>
              <Button onClick={() => setShowFlow(true)}>
                <WorkflowIcon className="size-4" />
                New Flow
              </Button>
              <Button variant="secondary">
                <UploadIcon className="size-4" />
                Import
              </Button>
            </>
          }
        />

        <div className="h-[600px] rounded-lg border border-border bg-card">
          {showFlow ? (
            <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          ) : (
            <EmptyState
              icon={WorkflowIcon}
              title="No flow diagram"
              description="Get started by creating a new flow diagram."
              className="h-full justify-center"
              action={
                <Button onClick={() => setShowFlow(true)}>Create Flow Diagram</Button>
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
