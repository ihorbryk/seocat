import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// Два проходи збірки в один dist/:
//   `vite build`                 -> попап (index.html + ресурси)
//   `vite build --mode extract`  -> extract.js (IIFE), обидва не очищають dist/ (це робить задача mise: rm -rf dist)
// Окремо `vite --mode showcase` (mise run showcase) віддає dev/showcase/ лише з dev-сервера; у dist/ він не потрапляє.
export default defineConfig(({ mode }) => {
  if (mode === 'extract') {
    return {
      publicDir: false,
      plugins: [stripIifeAssignment()],
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        lib: {
          entry: resolve(import.meta.dirname, 'src/extract/entry.ts'),
          formats: ['iife' as const],
          name: '__seocatExtract',
          fileName: () => 'extract.js',
        },
        rollupOptions: { output: { exports: 'default' as const } },
      },
    };
  }
  if (mode === 'showcase') {
    return {
      root: resolve(import.meta.dirname, 'dev/showcase'),
      plugins: [preact(), tailwindcss()],
      server: { port: 5180, strictPort: true },
    };
  }
  return {
    root: resolve(import.meta.dirname, 'src/popup'),
    base: './',
    publicDir: resolve(import.meta.dirname, 'public'),
    plugins: [preact(), tailwindcss()],
    build: { outDir: resolve(import.meta.dirname, 'dist'), emptyOutDir: false },
  };
});

// Rollup загортає IIFE у `var __seocatExtract = (function(){...})();`. Для executeScript
// потрібен скрипт, чий ОСТАННІЙ ВИРАЗ дає конверт, а `var`-присвоєння значення скрипта не дає.
// Прибираємо присвоєння, лишається `(function(){...})();` зі значенням конверта.
function stripIifeAssignment() {
  return {
    name: 'seocat-strip-iife-assignment',
    renderChunk(code: string) {
      return code.replace(/^var __seocatExtract = /m, '');
    },
  };
}
