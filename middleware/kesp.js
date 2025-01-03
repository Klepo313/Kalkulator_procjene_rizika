// middleware/kesp.js
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

// export default defineNuxtRouteMiddleware((to) => {
//     const urlParams = new URLSearchParams(to.query);
//     const id = urlParams.get('id');

//     console.log(urlParams, id, !id, id != 'null'); // Debug log za provjeru vrijednosti

//     // Provjeri postoji li ID i je li u validnom formatu (npr. duljina > 10 znakova)
//     if (!id || (id.length < 60 && id != 'null')) {
//         // Ako ID ne postoji ili nije validan, preusmjeri na predloške
//         return navigateTo('/kesp/predlosci');
//     }

//     // Ako je ID validan, dozvoli nastavak
// });