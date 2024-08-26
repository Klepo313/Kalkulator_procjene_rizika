// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useCookie } from '#imports';

export default defineNuxtRouteMiddleware((context) => {
    if (import.meta.server) {
        // Ako je na strani poslužitelja, koristite context.req za pristup kolačićima
        const authToken = context.req.headers.cookie
            ? context.req.headers.cookie.split('; ').find(row => row.startsWith('authToken='))
            : null;

        console.log('Server side authToken:', authToken);

        if (!authToken) {
            console.log('No authToken found, redirecting...');
            return navigateTo('/login');
        }
    } else {
        // Ako je na strani klijenta
        const authToken = useCookie('authToken');
        console.log('Client side authToken:', authToken);

        if (!authToken.value) {
            console.log('No authToken found, redirecting...');
            return navigateTo('/login');
        }
    }
});

