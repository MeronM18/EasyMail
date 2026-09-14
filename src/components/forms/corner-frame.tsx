/** Shared hover treatment: four corner brackets that grow on hover of the wrapped button. */
export function CornerFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      {children}
    </div>
  );
}
