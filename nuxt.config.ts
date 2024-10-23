// https://nuxt.com/docs/api/configuration/nuxt-config

// import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

// const MyPreset = definePreset(Aura, {
//   '--primary-color': '#13501b',
//   '--primary-color-hover': '#176221',
//   '--primary-color-focus': '#1a7225',
//   '--text-color': '#1e1e1e',
//   '--bg-color': 'white',
//   '--bg-layout-color': '#f0faec',
// });

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },
  runtimeConfig: {
    secretKey: process.env.SECRET_KEY, // Ovdje dodaješ ključ iz .env datoteke
    public: {
      baseUrl: process.env.BASE_URL, // Primjer javno dostupne varijable
    },
  },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    "@nuxt/eslint",
    '@sidebase/nuxt-pdf',
    '@nuxtjs/leaflet'
  ],
  primevue: {
    options: {
      components: {
        include: '*'
      },
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'app-light',
          prefix: 'p',
        }
      },
      ripple: true, // Ili druge opcije koje želite da koristite
    },
  },
  css: [
    '@/styles.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  plugins: [
    '@/plugins/fontawesome.js',
    // '@/plugins/primevue.js',
    // '~/plugins/encryptCookies.js',
  ],
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  devtools: { enabled: true }
})