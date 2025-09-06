import eslintPlugin from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig} */
export default [
    eslintPlugin.configs.recommended,
    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        languageOptions: {
            globals: {
                ...tsParser.languageOptions?.globals,
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
            },
        },
    },
    {
        files: ['**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs['recommended-type-checked'].rules,
            // Puedes personalizar reglas aquí
        },
    },
    prettier,
];
