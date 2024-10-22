// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { initializeCookie } from '~/utils/initializeCookie';

const idIzracuna = ref('');

export default defineNuxtRouteMiddleware(async () => {

    idIzracuna.value = await initializeCookie('id-izracuna');

    if (idIzracuna.value == '/' || idIzracuna.value) {
        console.log('Valid id_izracuna found, continuing...');
        return;
    } else {
        console.log('No id_izracuna found, redirecting...');
        return navigateTo('/kpkr/predlosci');
    }
});