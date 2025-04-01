import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  rules: {
    'ts/consistent-type-imports': 'off',
    'ts/no-namespace': 'off'
  }
})
