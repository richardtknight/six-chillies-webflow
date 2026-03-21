import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: 'src/js/main.js',
        styles: 'src/css/base.css'
      },
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: 'styles.css'
      }
    }
  }
})
