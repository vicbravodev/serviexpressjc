import { StatsSection } from "my-v0-project"

// Two capture problems, both solved at the preview layer:
// 1. MetricCell gates opacity on useInView (IntersectionObserver), which a
//    static capture may not settle — the reduced-motion seed only skips the
//    count-up. The style override below pins every animated node at its FINAL
//    frame (opacity 1, no transform), which is exactly the settled visual.
// 2. Reduced motion also makes useCountUp jump straight to the target values.
if (typeof window !== "undefined") {
  const real = window.matchMedia?.bind(window)
  window.matchMedia = (query: string) =>
    /prefers-reduced-motion/.test(query)
      ? ({
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as MediaQueryList)
      : real
        ? real(query)
        : ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} } as unknown as MediaQueryList)
}

// The section uses -mt-24/-mt-28 to overlap the hero above it; in isolation
// that clips its top, so give it top room for a self-contained still.
export const Vista = () => (
  <div className="stats-preview pt-4">
    <style>{`.stats-preview [style*="opacity"] { opacity: 1 !important; transform: none !important; }
.stats-preview section { margin-top: 0 !important; }`}</style>
    <StatsSection />
  </div>
)
