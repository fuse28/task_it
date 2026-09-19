"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mentionToken, parseMentions } from "@/lib/mentions";
import type { TeamMember } from "../types";

interface CommentComposerProps {
  team: TeamMember[];
  onSubmit: (content: string, mentionedUserIds: number[]) => void;
  onCancel?: () => void;
  initialValue?: string;
  submitLabel?: string;
  placeholder?: string;
  isPending?: boolean;
}

export function CommentComposer({
  team,
  onSubmit,
  onCancel,
  initialValue = "",
  submitLabel = "Comment",
  placeholder = "Write a comment… use @ to mention someone",
  isPending,
}: CommentComposerProps) {
  const [value, setValue] = useState(initialValue);
  const [suggestion, setSuggestion] = useState<{ query: string; start: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredTeam = suggestion
    ? team
        .filter((member) =>
          (member.name || member.email).toLowerCase().includes(suggestion.query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setValue(text);

    const cursor = e.target.selectionStart ?? text.length;
    const upToCursor = text.slice(0, cursor);
    const atIndex = upToCursor.lastIndexOf("@");

    if (atIndex === -1) {
      setSuggestion(null);
      return;
    }

    const query = upToCursor.slice(atIndex + 1);
    if (/[\s\]]/.test(query)) {
      setSuggestion(null);
      return;
    }

    setSuggestion({ query, start: atIndex });
  }

  function pickMention(member: TeamMember) {
    if (!suggestion) return;
    const name = member.name || member.email;
    const cursor = textareaRef.current?.selectionStart ?? value.length;
    const before = value.slice(0, suggestion.start);
    const after = value.slice(cursor);
    const inserted = `${mentionToken(name, member.id)} `;
    const next = `${before}${inserted}${after}`;
    setValue(next);
    setSuggestion(null);

    requestAnimationFrame(() => {
      const pos = before.length + inserted.length;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    });
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const mentionedUserIds = parseMentions(trimmed).map((m) => m.userId);
    onSubmit(trimmed, mentionedUserIds);
    setValue("");
    setSuggestion(null);
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape" && onCancel) onCancel();
        }}
      />

      {suggestion && filteredTeam.length > 0 && (
        <div className="absolute z-10 mt-1 w-64 rounded-md border border-border bg-popover p-1 shadow-md">
          {filteredTeam.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => pickMention(member)}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {member.name || member.email}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !value.trim()}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
