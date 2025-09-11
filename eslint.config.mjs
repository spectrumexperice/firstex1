import { defineFlatConfig } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';

export default defineFlatConfig([
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // قواعد Next.js الأساسية
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
      
      // قواعد إضافية
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
    },
  },
]);