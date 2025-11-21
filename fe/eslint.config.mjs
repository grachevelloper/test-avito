import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: {
            js,
            'simple-import-sort': simpleImportSort,
            import: importPlugin,
            prettier: prettierPlugin,
            'react-hooks': reactHooks,
            react: reactPlugin,
        },
        extends: [js.configs.recommended],
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                alias: {
                    map: [['@', './src']],
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
            },
        },
        languageOptions: {
            globals: {...globals.browser, ...globals.node, ...globals.jest},
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.config.*', 'vite.config.*', 'jest.config.*', 'eslint.config.*'],
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.recommended,
    ...(Array.isArray(reactPlugin.configs.flat.recommended) 
        ? reactPlugin.configs.flat.recommended 
        : [reactPlugin.configs.flat.recommended]
    ),
    {
        rules: {
            'indent': ['error', 4], 
            'quotes': ['error', 'single'], 
            'semi': ['error', 'always'], 
            'comma-dangle': ['error', 'always-multiline'], 
            'object-curly-spacing': ['error', 'never'], 
            'array-bracket-spacing': ['error', 'never'], 
      
            'no-case-declarations': 'off',
            '@typescript-eslint/only-throw-error': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'react/display-name': 'off',
            'react/jsx-key': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off', 
            '@typescript-eslint/no-unsafe-call': 'off', 
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off', 
      
            'prefer-const': 'error',
            'no-console': 'warn',
            'simple-import-sort/imports': 'off',
            'simple-import-sort/exports': 'off',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['internal'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
    {
        files: ['**/*.{jsx,tsx}'],
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/jsx-uses-react': 'off',
            'react/jsx-key': 'error',
            'react/jsx-no-duplicate-props': 'error',
            'jsx-quotes': ['error', 'prefer-single'],
        },
    },
    {
        files: ['**/*.config.*', '**/scripts/**', 'vite.config.*', 'jest.config.*'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-var-requires': 'off',
        },
    },
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/unbound-method': 'off', 
        },
    },
    {
        files: ['**/__tests__/setup.ts', '**/__tests__/setup/**'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-require-imports': 'off', 
        },
    },
    {
        files: ['**/__test__/mocks/**', '**/__test__/utils/**'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
        },
    },
    {
        files: ['**/*.config.*'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/await-thenable': 'off', 
        },
    },
]);