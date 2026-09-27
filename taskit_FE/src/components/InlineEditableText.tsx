"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InlineEditableTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  as?: "input" | "textarea";
  rows?: number;
  className?: string;
  allowEmpty?: boolean;
}

export function InlineEditableText({
  value,
  onSave,
  placeholder = "Click to add...",
  as = "input",
  rows = 3,
  className,
  allowEmpty = true,
}: InlineEditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
    setEditing(false);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      const len = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(len, len);
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (!allowEmpty && !trimmed) {
      setDraft(value);
      return;
    }
    if (trimmed === value) return;
    onSave(trimmed);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  const sharedClassName = cn(
    "w-full rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors",
    className
  );

  if (editing) {
    const editClassName = cn(
      sharedClassName,
      "resize-none border-none bg-transparent outline-none ring-0 shadow-none field-sizing-content"
    );

    if (as === "textarea") {
      return (
        <textarea
          ref={inputRef}
          rows={rows}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          placeholder={placeholder}
          className={editClassName}
        />
      );
    }

    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") cancel();
        }}
        placeholder={placeholder}
        className={editClassName}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        sharedClassName,
        "block cursor-text text-left hover:bg-accent/60",
        !value && "text-muted-foreground"
      )}
    >
      {value || placeholder}
    </button>
  );
}
