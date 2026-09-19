const MENTION_RE = /@\[([^\]]+)\]\((\d+)\)/g;

export interface MentionToken {
  name: string;
  userId: number;
}

export function parseMentions(content: string): MentionToken[] {
  const seen = new Map<number, MentionToken>();
  for (const match of content.matchAll(MENTION_RE)) {
    const userId = Number(match[2]);
    if (!seen.has(userId)) {
      seen.set(userId, { name: match[1], userId });
    }
  }
  return Array.from(seen.values());
}

export function mentionToken(name: string, userId: number) {
  return `@[${name}](${userId})`;
}

interface MentionSegment {
  type: "text" | "mention";
  value: string;
}

export function splitMentionSegments(content: string): MentionSegment[] {
  const segments: MentionSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MENTION_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, index) });
    }
    segments.push({ type: "mention", value: match[1] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments;
}
