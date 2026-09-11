import Link from "next/link";
import { Input } from "@/components/ui/input";

export function PasswordFields({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          className="block text-[13px] font-medium leading-5 text-text"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            className="block text-[13px] font-medium leading-5 text-text"
            htmlFor="password"
          >
            Password
          </label>
          {mode === "sign-in" ? (
            <Link
              className="text-[13px] font-medium text-primary hover:text-primary-hover"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>
        <Input
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          id="password"
          minLength={mode === "sign-up" ? 10 : undefined}
          name="password"
          required
          type="password"
        />
        {mode === "sign-up" ? (
          <p className="text-xs leading-4 text-text-subtle">
            Use at least 10 characters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
