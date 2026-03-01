// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://victor-muthomi.vercel.app', // Update with your actual domain
  
  // Performance optimizations
  compressHTML: true,
  
  build: {
    // Inline small CSS files for better performance
    inlineStylesheets: 'auto',
    // Asset optimization
    assets: '_assets',
  },
  
  // Vite configuration for build optimization
  vite: {
    build: {
      // Enable CSS minification
      cssMinify: true,
      // Enable JavaScript minification
      minify: 'terser',
      // Terser options for better compression
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: undefined,
        },
      },
    },
    // Server options for development
    server: {
      port: 4321,
    },
  },
  
  // Prefetch configuration for better navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
