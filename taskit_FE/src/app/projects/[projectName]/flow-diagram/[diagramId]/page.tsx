"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineEditableText } from "@/components/InlineEditableText";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  useFlowDiagram,
  useUpdateFlowDiagram,
  useDeleteFlowDiagram,
} from "../hooks/useFlowDiagrams";
import FlowStepNode from "../components/FlowStepNode";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";

const nodeTypes = { step: FlowStepNode };

export default function FlowDiagramEditorPage() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const { projectName, diagramId } = useParams<{
    projectName: string;
    diagramId: string;
  }>();
  const id = Number(diagramId);

  const { data: diagram, isLoading } = useFlowDiagram(id);
  const updateDiagram = useUpdateFlowDiagram(id, diagram?.projectId ?? 0);
  const deleteDiagram = useDeleteFlowDiagram(diagram?.projectId ?? 0);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const hydrated = useRef(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLabelChange = useCallback(
    (nodeId: string, label: string) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label } } : n))
      );
    },
    [setNodes]
  );

  useEffect(() => {
    if (diagram && !hydrated.current) {
      hydrated.current = true;
      const loadedNodes = (diagram.data?.nodes ?? []).map((n) => ({
        ...n,
        type: n.type ?? "step",
        data: { ...n.data, onLabelChange: handleLabelChange },
      }));
      setNodes(loadedNodes);
      setEdges(diagram.data?.edges ?? []);
    }
  }, [diagram, handleLabelChange, setNodes, setEdges]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const serializableNodes = nodes.map(({ id: nodeId, type, position, data }) => ({
        id: nodeId,
        type,
        position,
        data: { label: (data as { label: string }).label },
      }));
      updateDiagram.mutate(
        { data: { nodes: serializableNodes as Node[], edges } },
        { onError: () => toast.error("Failed to save changes") }
      );
    }, 800);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  function addStep() {
    const newId = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: "step",
        position: { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 },
        data: { label: "New step", onLabelChange: handleLabelChange },
      },
    ]);
  }

  function handleDelete() {
    deleteDiagram.mutate(id, {
      onSuccess: () => router.push(`/projects/${projectName}/flow-diagram`),
      onError: () => toast.error("Failed to delete diagram"),
    });
  }

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="flex h-[75vh] min-h-[500px] flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/projects/${projectName}/flow-diagram`)}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            {isLoading || !diagram ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <InlineEditableText
                value={diagram.name}
                onSave={(next) => updateDiagram.mutate({ name: next })}
                allowEmpty={false}
                className="text-xl font-semibold text-foreground"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addStep} disabled={isLoading}>
              <PlusIcon className="size-4" />
              Add Step
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading || deleteDiagram.isPending}
            >
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-3/4 w-3/4 rounded-xl" />
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
