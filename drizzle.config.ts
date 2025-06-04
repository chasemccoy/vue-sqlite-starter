import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './backend/db/schema',
	out: './backend/db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'file:enchiridion.db',
	},
	casing: 'snake_case',
});
