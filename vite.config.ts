import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { z } from 'zod';
import path from 'path';
import ui from '@nuxt/ui/vite';

const FRONTEND_PORT = z.coerce.number().parse(process.env.FRONTEND_PORT);
const BACKEND_PORT = z.coerce.number().parse(process.env.BACKEND_PORT);

// https://vite.dev/config/
export default defineConfig({
  root: 'app',
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'indigo',
        },
        badge: {
          slots: {
            base: 'Badge',
          },
        },
        formField: {
          slots: {
            container: 'w-full',
          },
        },
        input: {
          slots: {
            root: 'w-full',
          },
        },
        inputMenu: {
          slots: {
            root: 'w-full',
          },
        },
        textarea: {
          slots: {
            root: 'w-full',
          },
        },
      },
    }),
  ],
  server: {
    port: FRONTEND_PORT,
    allowedHosts: ['.ts.net'],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './app'),
      '@shared': path.resolve(__dirname, './shared'),
      '@db': path.resolve(__dirname, './backend/db'),
      '@api': path.resolve(__dirname, './backend/api'),
      '@integrations': path.resolve(__dirname, './backend/integrations'),
    },
  },
  define: {
    'import.meta.env.BACKEND_PORT': BACKEND_PORT,
  },
});
