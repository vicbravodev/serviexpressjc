import { ServicesSection } from "my-v0-project"

// The section reveals its content via Reveal/whileInView, which never fires in a
// static capture, leaving everything at opacity 0. The components already have a
// reduced-motion branch that renders the settled, fully-visible frame; force it by
// seeding prefers-reduced-motion before motion's useReducedMotion reads matchMedia.
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

export const Vista = () => <ServicesSection />
