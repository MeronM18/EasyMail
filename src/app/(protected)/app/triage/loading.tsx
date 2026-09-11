export default function TriageLoading() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8 lg:py-14"
      aria-busy="true"
    >
      <div className="h-4 w-24 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-4 h-8 w-40 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted" />
      <div className="mt-10 space-y-4 border-t border-border pt-8">
        {[0, 1, 2].map((item) => (
          <div
            className="h-16 animate-pulse rounded-[var(--radius-sm)] bg-surface-muted"
            key={item}
          />
        ))}
      </div>
    </main>
  );
}
