"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { intents } from "@/lib/intent";
import { createClient } from "@/lib/supabase/server";

const correctionSchema = z.object({
  messageId: z.uuid(),
  intent: z.enum(intents),
});

export type CorrectionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function correctClassificationAction(
  _previousState: CorrectionState,
  formData: FormData,
): Promise<CorrectionState> {
  await requireUser();
  const parsed = correctionSchema.safeParse({
    messageId: formData.get("messageId"),
    intent: formData.get("intent"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Choose a valid classification." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("correct_message_classification", {
    p_message_id: parsed.data.messageId,
    p_to_intent: parsed.data.intent,
  });

  if (error) {
    return {
      status: "error",
      message:
        "We could not save that correction. Your current classification is unchanged.",
    };
  }

  revalidatePath("/app", "layout");
  return { status: "success", message: "Classification updated." };
}
