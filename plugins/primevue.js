// plugins/primevue.ts
import { defineNuxtPlugin } from '#app';
import { definePreset } from '@primevue/themes';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
    '--primary-color': '#13501b',
    '--primary-color-hover': '#176221',
    '--primary-color-focus': '#1a7225',
    '--text-color': '#1e1e1e',
    '--bg-color': 'white',
    '--bg-layout-color': '#f0faec',
});

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        ripple: true, // Ili druge opcije koje želite da koristite
    });
});
