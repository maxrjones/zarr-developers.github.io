<script setup lang="ts">
// The SVG is loaded as a raw string (Vite `?raw` import) and rendered
// via v-html so that the inline <style> tag inside the SVG (which
// carries the @keyframes for the chunked-cube reveal) survives Vue's
// template compiler. v-pre alone does NOT prevent the compiler from
// stripping <style>/<script> tags from templates, so we have to bypass
// template compilation entirely.
//
// Reveal: ~3s one-shot. Each chunk has class="c cN"; the cN class drives
// its individual chunkIn_N keyframe (opacity 0 → 1) and a SMIL translate
// (off-screen → in-place). After the reveal, chunks settle.
//
// Interactivity: hovering a chunk dims the rest of the cube and shows
// a small callout giving that chunk's address (chunk[x,y,z], derived
// from its index in the 3×3×3 grid) and a deterministic 4×4 mini-grid
// representing its "data". Conveys Zarr's value: chunks are
// independently addressable and each one carries its own contents.
//
// Click/tap selects the chunk; tapping outside the cube dismisses.
// SSR-safe: handlers attach only on mount.

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import svg from './zarr-hero.svg?raw'

interface Hovered {
  index: number
  rect: DOMRect
}

const wrap = ref<HTMLDivElement | null>(null)
const hovered = ref<Hovered | null>(null)

let currentChunk: Element | null = null
let cleanup: (() => void) | null = null

// Visual-rank map: built lazily on first hover. The SVG's `cN` indices
// are arbitrary (whatever iteration order the author used), so we sort
// chunks by screen position so the visually top-left chunk gets rank 0
// → coords [0, 0, 0]. Coord order is (z, y, x) per zarr/numpy C-order.
let visualRank = new WeakMap<Element, number>()
let visualRankBuilt = false

function buildVisualRank(root: HTMLElement): void {
  const chunks = Array.from(root.querySelectorAll<Element>('.c'))
  const sorted = chunks
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)
  visualRank = new WeakMap()
  sorted.forEach((p, i) => visualRank.set(p.el, i))
  visualRankBuilt = true
}

function rankCoords(rank: number): [number, number, number] {
  // (z, y, x) — zarr / numpy C-order. Top-left visible chunk → [0,0,0].
  return [Math.floor(rank / 9), Math.floor(rank / 3) % 3, rank % 3]
}

// Deterministic per-chunk compression stats. Same seed each hover, so
// the same chunk shows the same numbers — emphasizes that chunks are
// independent units with their own compressed payloads, and that
// compression ratios vary with the data each chunk happens to hold.
function chunkStats(rank: number): { ratio: string } {
  let seed = (rank + 1) * 16807
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  // 4× – 12×: typical for scientific arrays with zstd + shuffle, the
  // pattern used by ARCO-ERA5, CMIP6 cloud archives, and most production
  // Zarr stores. Conservative end of what's actually seen in practice;
  // sparse / quantized data routinely hits 20×+ but we keep the range
  // tight so the popup reads as a credible default, not a brag.
  const r = 4 + ((seed % 1000) / 1000) * 8
  return { ratio: r.toFixed(1) }
}

const coords = computed(() =>
  hovered.value ? rankCoords(hovered.value.index).join(', ') : '',
)
const stats = computed(() =>
  hovered.value ? chunkStats(hovered.value.index) : { ratio: '' },
)

const calloutStyle = computed(() => {
  if (!hovered.value || !wrap.value) return {}
  const w = wrap.value.getBoundingClientRect()
  const r = hovered.value.rect
  return {
    left: `${r.right - w.left + 14}px`,
    top: `${r.top - w.top - 8}px`,
  }
})

onMounted(() => {
  const root = wrap.value
  if (!root) return

  const set = (chunk: Element) => {
    if (!visualRankBuilt) buildVisualRank(root)
    if (currentChunk && currentChunk !== chunk) {
      currentChunk.classList.remove('is-hovered')
    }
    currentChunk = chunk
    chunk.classList.add('is-hovered')
    hovered.value = {
      index: visualRank.get(chunk) ?? 0,
      rect: chunk.getBoundingClientRect(),
    }
  }
  const clear = () => {
    if (currentChunk) {
      currentChunk.classList.remove('is-hovered')
      currentChunk = null
    }
    hovered.value = null
  }

  const onOver = (e: PointerEvent) => {
    const target = e.target as Element | null
    const chunk = target?.closest?.('.c')
    if (chunk && root.contains(chunk)) set(chunk)
  }
  const onOut = (e: PointerEvent) => {
    // Only clear when leaving the entire wrapper (not when sliding
    // between chunks).
    const related = e.relatedTarget as Element | null
    if (related && root.contains(related)) return
    clear()
  }
  const onClick = (e: Event) => {
    const target = e.target as Element | null
    const chunk = target?.closest?.('.c')
    if (chunk && root.contains(chunk)) set(chunk)
    else clear()
  }

  root.addEventListener('pointerover', onOver)
  root.addEventListener('pointerout', onOut)
  root.addEventListener('click', onClick)
  cleanup = () => {
    root.removeEventListener('pointerover', onOver)
    root.removeEventListener('pointerout', onOut)
    root.removeEventListener('click', onClick)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div
    ref="wrap"
    class="zarr-hero"
    :class="{ 'has-hover': hovered }"
  >
    <div class="zarr-hero__svg" v-html="svg" />
    <Transition name="callout">
      <div v-if="hovered" class="zarr-callout" :style="calloutStyle">
        <div class="zarr-callout__addr">chunk[{{ coords }}]</div>
        <dl class="zarr-callout__meta">
          <div>
            <dt>shape</dt>
            <dd>(4, 4, 4) · 64 elements</dd>
          </div>
          <div>
            <dt>codec</dt>
            <dd>zstd · <strong>{{ stats.ratio }}×</strong> compressed</dd>
          </div>
        </dl>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.zarr-hero {
  position: relative;
  /* Light-theme palette — strong value contrast across the three iso
     faces so the cube reads as 3D. Top = rose blush; right = rose;
     front = wine. On-brand but calmer than saturated brand magenta. */
  --zarr-coral-1: #f5c5d0;
  --zarr-coral-2: #d4709a;
  --zarr-coral-3: #8a2c6a;
  --zarr-stroke: #1a1a1a;
  --zarr-grid: rgba(0, 0, 0, 0.08);
  --zarr-glow: rgba(212, 112, 154, 0.65);
}

/* Dark theme — VitePress toggles `.dark` on <html>. */
:global(.dark) .zarr-hero {
  --zarr-coral-1: #f5d2dc;
  --zarr-coral-2: #e89bb8;
  --zarr-coral-3: #c25e92;
  --zarr-stroke: #faf7f2;
  --zarr-grid: rgba(255, 255, 255, 0.12);
  --zarr-glow: rgba(232, 155, 184, 0.7);
}

.zarr-hero :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

/* Each chunk is interactive — hover/tap to reveal its address and a
   data preview in the floating callout. */
.zarr-hero :deep(.c) {
  cursor: pointer;
  transition: opacity 200ms ease, filter 200ms ease;
}

/* When ANY chunk is hovered/selected, dim the rest so the focused
   chunk reads clearly. !important is needed because each chunk has
   `animation-fill-mode: forwards` holding its post-reveal opacity. */
.zarr-hero.has-hover :deep(.c:not(.is-hovered)) {
  opacity: 0.32 !important;
}

.zarr-hero :deep(.c.is-hovered) {
  filter: drop-shadow(0 0 6px var(--zarr-glow))
          drop-shadow(0 0 14px var(--zarr-glow));
}

/* Floating callout */
.zarr-callout {
  position: absolute;
  z-index: 10;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 6px 22px -6px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  min-width: 180px;
}
.zarr-callout__addr {
  font-family: ui-monospace, SFMono-Regular, 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
  letter-spacing: 0.02em;
}
.zarr-callout__meta {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.zarr-callout__meta > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.zarr-callout__meta dt {
  font-size: 9.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--vp-c-text-3);
}
.zarr-callout__meta dd {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
.zarr-callout__meta dd strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.callout-enter-active,
.callout-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.callout-enter-from,
.callout-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Reduced motion: disable the reveal stagger and the callout's
   scale-in. Hover/tap behaviour stays. */
@media (prefers-reduced-motion: reduce) {
  .zarr-hero :deep(.c) {
    animation: none !important;
    opacity: 1;
  }
  .callout-enter-active,
  .callout-leave-active {
    transition: opacity 120ms ease;
  }
  .callout-enter-from,
  .callout-leave-to {
    transform: none;
  }
}
</style>
