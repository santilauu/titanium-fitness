import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Publicada en GitHub Pages: https://santilauu.github.io/titanium-fitness/
export default defineConfig({
  site: 'https://santilauu.github.io',
  base: '/titanium-fitness',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
