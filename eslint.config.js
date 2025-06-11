import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
	{
		files: ['**/*.{js,ts,vue}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	pluginVue.configs['flat/strongly-recommended'],
	prettier,
	{
		files: ['**/*.{js,ts,vue}'],
		rules: {
			'no-console': 'error',
			'vue/attribute-hyphenation': 'off',
			'vue/require-default-prop': 'off',
		},
	},
]);
