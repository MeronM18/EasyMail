"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { PasswordFields } from "@/components/auth/password-fields";
import { CornerFrame } from "@/components/forms/corner-frame";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { EASE } from "@/components/marketing/motion";

/**
 * Progressive-disclosure sign-in/sign-up form: starts as a single
 * "Continue with Email" trigger, and reveals the real email+password
 * fields (height/opacity, Framer Motion) on click — no separate step,
 * same <form> and server action throughout. EasyMail has no social
 * login provider, so there is no OAuth row above this; the reveal
 * pattern is applied to the product's actual auth fields instead of a
 * decorative single-field mockup.
 */
export function AuthForm({
  action,
  mode,
  submitLabel,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  mode: "sign-in" | "sign-up";
  submitLabel: string;
  children?: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <form action={action} className="space-y-6">
      <AnimatePresence initial={false}>
        {revealed ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="space-y-5 pb-1">
              <PasswordFields mode={mode} />
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {revealed ? (
        <SubmitButton>{submitLabel}</SubmitButton>
      ) : (
        <CornerFrame>
          <Button className="w-full" onClick={() => setRevealed(true)} type="button">
            Continue with email
          </Button>
        </CornerFrame>
      )}
    </form>
  );
}
