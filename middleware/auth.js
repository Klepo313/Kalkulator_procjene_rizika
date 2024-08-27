// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useCookie } from '#imports';

export default defineNuxtRouteMiddleware(() => {
    // Ako je na strani klijenta
    const authToken = useCookie('accessToken');

    if (authToken.value === '/') {
        console.log('No accessToken found, redirecting...');
        return navigateTo('/login');
    } else {
        console.log('Valid accessToken found, continuing...');
        return;
    }
});

