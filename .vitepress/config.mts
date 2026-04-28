import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Zarr',
  description: 'Zarr is a community project to develop specifications and software for storage of large N-dimensional typed arrays, also commonly known as tensors.',
  cleanUrls: true,
  srcExclude: [
    '_posts/**',
    '_includes/**',
    '_data/**',
    'numcodecs_redirects/**',
    'docs/**',
    'slides/**',
    'office_hours/**',
    'adopters/index.md',
    'conventions/index.md',
    'datasets/index.md',
    'implementations/index.md',
    'slides.md',
    'README.md',
    'vitepress-migration-issue.md',
  ],
  themeConfig: {
    search: { provider: 'local' },
  },
})
