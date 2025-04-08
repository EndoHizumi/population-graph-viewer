// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

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
      stylistic
    },
    rules: {
      'stylistic/semi': ['error', 'never'],
      'stylistic/max-len': ['error', { 'code': 120 }],
      'stylistic/quotes': ['error', 'single']
    }
  }
)
