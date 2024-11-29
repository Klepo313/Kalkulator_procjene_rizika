// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app';

export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('userToken');

    // Ako korisnik nije prijavljen
    if (!token.value) {
        // Sačuvaj trenutnu rutu u query parametar `redirectTo`
        return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`);
    }

    console.log("User logged in");
});
