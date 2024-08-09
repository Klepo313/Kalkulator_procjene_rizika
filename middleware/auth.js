// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useCookie } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
    const authToken = useCookie('authToken').value;

    if (!authToken) {
        console.log('No authToken found, redirecting...');
        return navigateTo('/login');
    }
});
