// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useCookie } from '#imports';

export default defineNuxtRouteMiddleware(() => {
    // Ako je na strani klijenta
    const idIzracuna = useCookie('id_izracuna');

    if (idIzracuna.value === '/') {
        console.log('No id_izracuna found, redirecting...');
        return navigateTo('/predlozak');
    } else {
        console.log('Valid id_izracuna found, continuing...');
        return;
    }
});

