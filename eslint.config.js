import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'mi-blog/**',
      'public/**',
      'design/**',
      '**/*.md',
      '**/*.mdx',
      'package-lock.json',
    ],
  },

  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        URL: 'readonly',
        process: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },

  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    rules: {
      'no-console': 'off',
    },
  },
];
