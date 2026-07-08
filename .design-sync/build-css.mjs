// Compiles .design-sync/tw-entry.css (Tailwind v4) into a static stylesheet
// the design-sync converter ships as cssEntry. Source scanning runs from the
// repo root, so every class used in components/, app/, and
// .design-sync/previews/ lands in the output.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

const here = dirname(fileURLToPath(import.meta.url))
const entry = resolve(here, 'tw-entry.css')
const outFile = resolve(here, '.cache/compiled.css')

const css = readFileSync(entry, 'utf8')
const result = await postcss([tailwindcss()]).process(css, {
  from: entry,
  to: outFile,
})
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, result.css)
console.log(`wrote ${outFile} (${(result.css.length / 1024).toFixed(0)} KiB)`)
