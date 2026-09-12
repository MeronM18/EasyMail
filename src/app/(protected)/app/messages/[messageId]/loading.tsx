import { Skeleton } from "@/components/ui/skeleton";

export default function MessageLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-4xl px-6 py-10 lg:px-8 lg:py-14"
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-10 h-8 w-3/4" />
      <Skeleton className="mt-8 h-24" />
    </main>
  );
}
