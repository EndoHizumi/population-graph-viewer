// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'
import jsdoc from 'eslint-plugin-jsdoc'
import unicorn from 'eslint-plugin-unicorn'
import tsParser from '@typescript-eslint/parser'

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    plugins: {
      stylistic,
      unicorn,
      jsdoc,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
    },
    rules: {
      'stylistic/semi': ['error', 'never'],
      'stylistic/max-len': ['error', { code: 120 }],
      'stylistic/quotes': ['error', 'single'],
      // コーディングスタイルルール
      'unicorn/catch-error-name': 'warn',
      eqeqeq: ['error', 'smart'],
      'vue/multi-word-component-names': 'warn',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      // 命名規則
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'typeProperty', format: ['PascalCase'] },
        { selector: 'interface', format: ['camelCase'] },
        {
          selector: 'variable',
          types: ['array'],
          format: ['camelCase'],
          suffix: ['List'],
        },
        {
          selector: 'variable',
          modifiers: ['destructured'],
          format: null,
          leadingUnderscore: 'allow',
        },
      ],
      // JSDocルール
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-description': [
        'error',
        {
          contexts: [
            'ArrowFunctionExpression',
            'ClassDeclaration',
            'FunctionDeclaration',
            'FunctionExpression',
            'MethodDefinition',
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.nuxt/**', '.output/**','vitest*','*.spec.ts'],
  },
)
