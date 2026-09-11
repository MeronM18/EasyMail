export default function MessageLoading() {
  return (
    <main
      className="mx-auto w-full max-w-4xl px-6 py-10 lg:px-8 lg:py-14"
      aria-busy="true"
    >
      <div className="h-4 w-28 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-10 h-8 w-3/4 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-8 h-24 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
    </main>
  );
}
