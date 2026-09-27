"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { InlineEditableText } from "@/components/InlineEditableText";

export interface FlowStepNodeData {
  label: string;
  onLabelChange: (nodeId: string, label: string) => void;
  [key: string]: unknown;
}

function FlowStepNode({ id, data, selected }: NodeProps) {
  const nodeData = data as FlowStepNodeData;

  return (
    <div
      className={`min-w-[160px] rounded-lg border-2 bg-card px-4 py-2.5 shadow-sm transition-colors ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="nodrag nopan cursor-text">
        <InlineEditableText
          value={nodeData.label}
          onSave={(next) => nodeData.onLabelChange(id, next)}
          allowEmpty={false}
          className="text-sm font-medium text-foreground"
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
}

export default memo(FlowStepNode);
