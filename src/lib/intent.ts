export const intents = [
  "needs_reply",
  "needs_action",
  "matters",
  "can_ignore",
  "cleanup_candidate",
] as const;

export type Intent = (typeof intents)[number];

export const intentMeta: Record<
  Intent,
  { label: string; shortLabel: string; description: string }
> = {
  needs_reply: {
    label: "Needs reply",
    shortLabel: "Reply",
    description: "A response is expected from you.",
  },
  needs_action: {
    label: "Needs action",
    shortLabel: "Action",
    description: "There is a task, deadline, meeting, or decision for you.",
  },
  matters: {
    label: "Matters",
    shortLabel: "Matters",
    description: "Important awareness that should not be buried.",
  },
  can_ignore: {
    label: "Can ignore",
    shortLabel: "Ignore",
    description: "Low-value mail that is safe to skip for now.",
  },
  cleanup_candidate: {
    label: "Cleanup candidate",
    shortLabel: "Cleanup",
    description: "A recurring sender you may want to clean up later.",
  },
};

export function isIntent(value: unknown): value is Intent {
  return typeof value === "string" && intents.includes(value as Intent);
}
