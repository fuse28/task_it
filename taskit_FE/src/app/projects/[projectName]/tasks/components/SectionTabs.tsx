"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: number;
  title: string;
}

interface Props {
  sections: Section[];
  activeSectionId: number | null;
  onSelect: (id: number) => void;
  onAdd: (title: string) => void;
}

export default function SectionTabs({ sections, activeSectionId, onSelect, onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  function submit() {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      setAdding(false);
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSelect(section.id)}
          className={cn(
            "whitespace-nowrap px-3 py-2 text-sm transition-colors",
            activeSectionId === section.id
              ? "border-b-2 border-primary font-semibold text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {section.title}
        </button>
      ))}

      {adding ? (
        <div className="ml-2 flex items-center gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") { setAdding(false); setTitle(""); }
            }}
            placeholder="Section name..."
            className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={submit}
            className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setTitle(""); }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="ml-2 flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:text-primary/80"
        >
          <PlusIcon className="size-4" />
          Section
        </button>
      )}
    </div>
  );
}
