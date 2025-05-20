import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', 
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].js',
        chunkFileNames: 'static/js/[name].js',
        assetFileNames: ({ name }) => {
          if (/\.(css|scss)$/.test(name ?? '')) {
            return 'static/css/[name][extname]';
          }
          return 'static/[name][extname]';
        },
      },
    },
  },
})
