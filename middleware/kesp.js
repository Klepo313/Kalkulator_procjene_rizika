// middleware/izracun.js
export default defineNuxtRouteMiddleware((to) => {
    const urlParams = new URLSearchParams(to.query);
    const id = urlParams.get('id');

    console.log(urlParams, id, !id, id != 'null'); // Debug log za provjeru vrijednosti

    // Provjeri postoji li ID i je li u validnom formatu (npr. duljina > 10 znakova)
    if (!id || (id.length < 60 && id != 'null')) {
        // Ako ID ne postoji ili nije validan, preusmjeri na predloške
        return navigateTo('/kesp/predlosci');
    }

    // Ako je ID validan, dozvoli nastavak
});