// middleware/auth.js

export default defineNuxtRouteMiddleware(() => {
    try {
        const csrfToken = useCookie('csrfToken').value;

        if (!csrfToken) return navigateTo('/login');

        console.log("User logged in");
        return;
    } catch (error) {
        console.error('Error during login check:', error.message || error); // Uhvatljena i ispisana greška ako je došlo do pogreške pri provjeravanju prijave
        return navigateTo('/login'); // Ako je greška, također preusmjeravamo na login
    }
});

