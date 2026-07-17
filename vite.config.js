import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/signup': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/register': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/profile': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/assessment': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/generate-path': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/dashboard': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/update-progress': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/submit-feedback': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/feedbacks': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/analytics-data': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
});
