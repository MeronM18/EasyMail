import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-8 lg:py-16"
    >
      <Skeleton className="h-5 w-28" />
      <Skeleton className="mt-4 h-8 w-64" />
      <Skeleton className="mt-4 h-5 w-full max-w-lg" />
    </main>
  );
}
