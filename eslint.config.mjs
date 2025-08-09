import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';
import * as tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// eslint-disable-next-line import/no-default-export
export default [
  {
    ignores: [
      'src/graphql/codegen/graphql.ts',
      '.storybook/',
      'dist/',
      'storybook-static/',
      'public/new-relic-agent-*.js',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ),
  ),
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      react: fixupPluginRules(react),
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        fragment: 'Fragment',
        version: 'detect',
        flowVersion: '0.53',
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: true,
      },
    },

    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-children-prop': 'off',
      'react/no-unescaped-entities': 'off',
      'no-console': 1,

      // Allow unused variables that start with an underscore
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Function rules
      'arrow-body-style': ['error', 'as-needed'], // Require no braces for single expression arrow functions
      'prefer-arrow-callback': 'error', // Use arrow functions when anonyomous functions are needed
      'arrow-parens': ['error', 'always'], // Always require parens in arrow functions
      'no-param-reassign': ['error', { props: false }], // Don't allow reassigning function parameters

      // Prefer object shorthand
      // const obj = { a, b } instead of const obj = { a: a, b: b }
      // const objWithFunctions = { a() {}, b() {} } instead of { a: () => {}, b: () => {} }
      'object-shorthand': ['error', 'always'],
      'quote-props': ['error', 'as-needed'], // Don't allow quotes in object keys unless needed, eg: { 'key': value }
      'prefer-object-spread': 'error', // Use {..., } instead of Object.assign

      // https://eslint.org/docs/latest/rules/array-callback-return#rule-details
      // Ensure that array methods have return statements
      'array-callback-return': 'error',
      'no-iterator': 'error', // Prefer bulit-in methods over for/in & for/of

      // // Import/Export rules
      'import/first': 'error', // Ensure all imports appear before other statements
      'import/no-default-export': 'error', // Prefer named exports over default exports

      // TypeScript specific rules
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Prefer interfaces over type aliases

      // Disallow if statements that don't have a block
      'no-restricted-syntax': ['error', 'IfStatement[consequent.type!="BlockStatement"]'],
    },
  },
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx'],
    rules: {
      'import/no-default-export': 'off', // Disable no default export for stories
    },
  },
  {
    files: ['**/.eslintrc.{js,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',
    },
  },
];
