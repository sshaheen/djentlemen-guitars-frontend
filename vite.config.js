import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default ({ mode }) => {
  // load env file based on `mode` (development by default)
  const env = loadEnv(mode, process.cwd());
  const apiUrl = env.VITE_API_URL || 'http://localhost:8080';

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    define: {
      // expose to client code if needed (client can use import.meta.env.VITE_API_URL)
      'process.env': {},
    },
  });
};
