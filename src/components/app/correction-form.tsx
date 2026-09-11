"use client";

import { CircleCheck, RotateCcw } from "lucide-react";
import { useActionState } from "react";
import {
  correctClassificationAction,
  type CorrectionState,
} from "@/app/actions/classification";
import { Button } from "@/components/ui/button";
import { intentMeta, intents, type Intent } from "@/lib/intent";

const initialCorrectionState: CorrectionState = {
  status: "idle",
  message: "",
};

export function CorrectionForm({
  messageId,
  currentIntent,
}: {
  messageId: string;
  currentIntent: Intent;
}) {
  const [state, action, pending] = useActionState(
    correctClassificationAction,
    initialCorrectionState,
  );

  return (
    <form action={action} className="mt-4">
      <input name="messageId" type="hidden" value={messageId} />
      <label className="text-[12px] font-medium text-text" htmlFor="intent">
        Move this message to
      </label>
      <select
        className="mt-2 h-10 w-full min-w-[220px] rounded-[var(--radius-md)] border border-border-strong bg-background px-3 text-[13px] text-text outline-none focus:border-primary"
        defaultValue={currentIntent}
        id="intent"
        name="intent"
      >
        {intents.map((intent) => (
          <option key={intent} value={intent}>
            {intentMeta[intent].label}
          </option>
        ))}
      </select>
      <Button className="mt-3 w-full" disabled={pending} type="submit">
        <RotateCcw aria-hidden="true" className="size-3.5" />
        {pending ? "Updating recap…" : "Update recap"}
      </Button>
      <div aria-live="polite" className="min-h-7 pt-2">
        {state.message ? (
          <p
            className={`flex gap-1.5 text-[12px] leading-5 ${
              state.status === "error" ? "text-error" : "text-success"
            }`}
          >
            {state.status === "success" ? (
              <CircleCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            ) : null}
            {state.message}
          </p>
        ) : (
          <p className="text-[11px] leading-5 text-text-subtle">
            This records your override and leaves the original model suggestion intact.
          </p>
        )}
      </div>
    </form>
  );
}
