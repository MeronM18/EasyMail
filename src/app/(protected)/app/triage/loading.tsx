import { Skeleton } from "@/components/ui/skeleton";

export default function TriageLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8 lg:py-14"
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-40" />
      <div className="mt-10 space-y-4 border-t border-border pt-8">
        {[0, 1, 2].map((item) => (
          <Skeleton className="h-16" key={item} />
        ))}
      </div>
    </main>
  );
}
