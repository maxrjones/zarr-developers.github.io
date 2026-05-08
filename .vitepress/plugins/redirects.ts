import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import yaml from 'js-yaml'
import type { Plugin } from 'vite'

interface RedirectEntry {
  from: string
  to: string
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
   .replace(/"/g, '&quot;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')

const renderRedirectHtml = (to: string): string => {
  const target = escapeHtml(to)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <link rel="canonical" href="${target}">
  <meta http-equiv="refresh" content="0; url=${target}">
  <meta name="robots" content="noindex">
</head>
<body>
  <p>Redirecting to <a href="${target}">${target}</a>...</p>
  <script>location.replace("${target}")</script>
</body>
</html>
`
}

const parseRedirectsYaml = (source: string): RedirectEntry[] => {
  const parsed = yaml.load(source)
  if (parsed === null || parsed === undefined) return []
  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('redirects.yml must be a YAML mapping at the top level')
  }
  const entries: RedirectEntry[] = []
  for (const [from, to] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof to !== 'string') {
      throw new Error(`redirect target for "${from}" must be a string, got ${typeof to}`)
    }
    if (!from.startsWith('/')) {
      throw new Error(`redirect source "${from}" must start with a leading slash`)
    }
    entries.push({ from, to })
  }
  return entries
}

const stripLeadingSlash = (p: string): string => (p.startsWith('/') ? p.slice(1) : p)
const stripTrailingSlash = (p: string): string => (p.endsWith('/') ? p.slice(0, -1) : p)

interface RedirectsPluginOptions {
  yamlPath: string
  outDir: string
}

export const redirectsPlugin = (options: RedirectsPluginOptions): Plugin => {
  // VitePress emits both SSR and client bundles, so closeBundle fires twice.
  // Only emit stubs on the first call.
  let written = false
  return {
    name: 'zarr-redirects',
    apply: 'build',
    closeBundle() {
      if (written) return
      written = true

      const yamlSource = readFileSync(options.yamlPath, 'utf8')
      const entries = parseRedirectsYaml(yamlSource)

      for (const { from, to } of entries) {
        const cleaned = stripTrailingSlash(stripLeadingSlash(from))
        const outPath = cleaned === ''
          ? join(options.outDir, 'index.html')
          : join(options.outDir, cleaned, 'index.html')

        if (existsSync(outPath)) {
          throw new Error(
            `Redirect "${from}" collides with an existing build output at ${outPath}. ` +
            `Either remove the redirect or rename the page that produced ${outPath}.`,
          )
        }

        mkdirSync(dirname(outPath), { recursive: true })
        writeFileSync(outPath, renderRedirectHtml(to), 'utf8')
      }

      console.log(`[zarr-redirects] wrote ${entries.length} redirect stubs`)
    },
  }
}

export const defaultPluginOptions = (rootDir: string): RedirectsPluginOptions => ({
  yamlPath: resolve(rootDir, '.vitepress/redirects.yml'),
  outDir: resolve(rootDir, '.vitepress/dist'),
})
