import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  router: {
    middleware: ['auth.global', 'loading'],
  },
  runtimeConfig: {
    secretKey: process.env.SECRET_KEY,
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@sidebase/nuxt-pdf',
    '@nuxtjs/leaflet',
    'nuxt-auth-utils',
  ],
  primevue: {
    options: {
      components: {
        include: '*',
      },
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'app-light',
          prefix: 'p',
        },
      },
      ripple: true,
    },
  },
  css: [
    '@/styles.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  // plugins: [
  //   '@/plugins/fontawesome.js',
  // ],
  vite: {
    build: {
      rollupOptions: {
        external: [], // Ako želite, ovde možete dodati dodatne eksterne module
      },
    },
    optimizeDeps: {
      include: ['xlsx'], // Uključivanje xlsx modula
    },
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
    },
  },
  devtools: { enabled: true },
});