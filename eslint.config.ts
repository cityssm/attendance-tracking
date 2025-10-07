import { configWebApp, cspellWords, defineConfig } from 'eslint-config-cityssm'

export const config = defineConfig(configWebApp, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.json', './public/javascripts/tsconfig.json']
    }
  },
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        cspell: {
          words: [
            ...cspellWords,
            'avanti',
            'favourite',
            'javascripts',
          ]
        }
      }
    ],
    '@typescript-eslint/no-unsafe-type-assertion': 'off'
  }
})

export default config