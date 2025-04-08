// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint','@pinia/nuxt'],
  plugins: [
    { src: '~/plugins/highcharts.ts', mode: 'client' }
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    RESAS_API_KEY: process.env.API_KEY,
    RESAS_API_ENDPOINT: process.env.API_ENDPOINT,
  },
})
