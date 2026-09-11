export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-8 lg:py-16"
      aria-busy="true"
    >
      <div className="h-5 w-28 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-4 h-8 w-64 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-lg animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
    </main>
  );
}
