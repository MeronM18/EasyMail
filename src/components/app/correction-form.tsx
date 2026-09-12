"use client";

import { CircleCheck, RotateCcw } from "lucide-react";
import { useActionState, useState } from "react";
import {
  correctClassificationAction,
  type CorrectionState,
} from "@/app/actions/classification";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [intent, setIntent] = useState<Intent>(currentIntent);

  return (
    <form action={action} className="mt-4">
      <input name="messageId" type="hidden" value={messageId} />
      <input name="intent" type="hidden" value={intent} />
      <label className="text-[12px] font-medium text-text" htmlFor="intent-trigger">
        Move this message to
      </label>
      <Select onValueChange={(value) => setIntent(value as Intent)} value={intent}>
        <SelectTrigger className="mt-2 w-full" id="intent-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {intents.map((value) => (
            <SelectItem key={value} value={value}>
              {intentMeta[value].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
