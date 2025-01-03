// middleware/izracun.js
export default defineNuxtRouteMiddleware((to) => {
    try {
        const id = to.query.id;

        console.log(to.query, id, !id, id !== 'null'); // Debug log za provjeru vrijednosti

        if (!id || (id.length < 60 && id !== 'null')) {
            return navigateTo('/kpkr/predlosci');
        }
    } catch (error) {
        console.error('Middleware error:', error);
        return navigateTo('/kpkr/predlosci');
    }
});
