import { defineConfig } from 'vitepress'
import { redirectsPlugin, defaultPluginOptions } from './plugins/redirects'

export default defineConfig({
  title: 'Zarr',
  description: 'Zarr is a community project to develop specifications and software for storage of large N-dimensional typed arrays, also commonly known as tensors.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Zarr' }],
    ['meta', { name: 'application-name', content: 'Zarr' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-BCRR9QE7Z0' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-BCRR9QE7Z0');`],
  ],
  srcExclude: [
    'docs/**',
    'office_hours/**',
    'adopters/index.md',
    'conventions/index.md',
    'implementations/index.md',
    'slides.md',
    'README.md',
  ],
  vite: {
    plugins: [redirectsPlugin(defaultPluginOptions(process.cwd()))],
  },
  themeConfig: {
    search: { provider: 'local' },
  },
})
