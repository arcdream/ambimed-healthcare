/** Minimal route Suspense fallback — avoids heavy animation work during chunk load */
export function RouteFallback() {
  return (
    <div
      className="route-fallback"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      Loading…
    </div>
  )
}
