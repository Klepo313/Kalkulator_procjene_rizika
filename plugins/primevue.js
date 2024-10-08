// plugins/primevue.ts
import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        ripple: true, // Ili druge opcije koje želite da koristite
    });
});
