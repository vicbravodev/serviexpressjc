// Browser shim for the DS preview bundle: Next.js client internals
// (next/link, next/image) and lib/site.ts read process.env at module init,
// which throws in a plain browser. This module is imported first from
// ds-extras.ts — extraEntries execute before the main package in the
// synthesized bundle entry, so `process` exists before anything reads it.
const g = globalThis as Record<string, any>
if (typeof g.process === "undefined") g.process = {}
g.process.env ??= {}
g.process.platform ??= "browser"
g.process.nextTick ??= (fn: (...a: unknown[]) => void, ...args: unknown[]) =>
  setTimeout(() => fn(...args), 0)
export {}
