import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { z } from 'zod';
import path from 'path';

const PORT = z.coerce.number().parse(process.env.FRONTEND_PORT);

// https://vite.dev/config/
export default defineConfig({
	root: 'app',
	plugins: [vue()],
	server: {
		port: PORT,
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './app'),
		},
	},
});
