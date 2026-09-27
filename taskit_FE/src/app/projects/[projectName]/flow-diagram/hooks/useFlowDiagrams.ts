import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFlowDiagrams,
  getFlowDiagram,
  createFlowDiagram,
  updateFlowDiagram,
  deleteFlowDiagram,
  type FlowDiagramData,
} from "../service/flowDiagram.service";

export function useFlowDiagrams(projectId: number) {
  return useQuery({
    queryKey: ["flow-diagrams", projectId],
    queryFn: () => getFlowDiagrams(projectId),
    enabled: !!projectId,
  });
}

export function useFlowDiagram(id: number | null) {
  return useQuery({
    queryKey: ["flow-diagram", id],
    queryFn: () => getFlowDiagram(id as number),
    enabled: !!id,
  });
}

export function useCreateFlowDiagram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: number; name: string }) =>
      createFlowDiagram(projectId, name),
    onSuccess: (diagram) => {
      qc.invalidateQueries({ queryKey: ["flow-diagrams", diagram.projectId] });
    },
  });
}

export function useUpdateFlowDiagram(id: number, projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; data?: FlowDiagramData }) =>
      updateFlowDiagram(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flow-diagram", id] });
      qc.invalidateQueries({ queryKey: ["flow-diagrams", projectId] });
    },
  });
}

export function useDeleteFlowDiagram(projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFlowDiagram(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flow-diagrams", projectId] });
    },
  });
}
