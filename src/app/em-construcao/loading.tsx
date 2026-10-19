export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[40vh] w-full items-center justify-center"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-primary" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
