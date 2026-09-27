import API from "@/lib/interceptor";
import type { Edge, Node } from "@xyflow/react";

export interface FlowDiagramSummary {
  id: number;
  projectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlowDiagramData {
  nodes: Node[];
  edges: Edge[];
}

export interface FlowDiagramDetail extends FlowDiagramSummary {
  data: FlowDiagramData;
}

export async function getFlowDiagrams(projectId: number): Promise<FlowDiagramSummary[]> {
  const res = await API.get(`/flow-diagrams/project/${projectId}`);
  return res.data;
}

export async function getFlowDiagram(id: number): Promise<FlowDiagramDetail> {
  const res = await API.get(`/flow-diagrams/${id}`);
  return res.data;
}

export async function createFlowDiagram(
  projectId: number,
  name: string
): Promise<FlowDiagramDetail> {
  const res = await API.post(`/flow-diagrams`, { projectId, name });
  return res.data;
}

export async function updateFlowDiagram(
  id: number,
  data: { name?: string; data?: FlowDiagramData }
): Promise<FlowDiagramDetail> {
  const res = await API.put(`/flow-diagrams/${id}`, data);
  return res.data;
}

export async function deleteFlowDiagram(id: number) {
  const res = await API.delete(`/flow-diagrams/${id}`);
  return res.data;
}
