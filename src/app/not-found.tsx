import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-[13px] font-medium text-text-subtle">404</p>
      <h1 className="mt-2 text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-[22px] text-text-muted">
        The page may have moved or the address may be incorrect.
      </p>
      <div className="mt-6">
        <Link className={buttonVariants()} href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
