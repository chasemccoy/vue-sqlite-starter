import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { z } from 'zod';
import path from 'path';

const FRONTEND_PORT = z.coerce.number().parse(process.env.FRONTEND_PORT);
const BACKEND_PORT = z.coerce.number().parse(process.env.BACKEND_PORT);

// https://vite.dev/config/
export default defineConfig({
	root: 'app',
	plugins: [vue()],
	server: {
		port: FRONTEND_PORT,
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './app'),
			'@shared': path.resolve(__dirname, './shared'),
		},
	},
	define: {
		'import.meta.env.BACKEND_PORT': BACKEND_PORT,
	},
});
