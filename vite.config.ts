// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'

export default defineConfig({
  base: '/plugins/',
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/pt-api': {
        target: 'http://localhost:9348',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pt-api/, ''),
        secure: false,
        // 启用 cookie 凭据
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  }
});