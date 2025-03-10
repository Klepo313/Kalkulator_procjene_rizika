// middleware/kesp.js

export default defineNuxtRouteMiddleware((to) => {
    try {
        const id = to.query.id;
        
        console.log(to.query, id, !id, id !== 'null'); // Debug log za provjeru vrijednosti

        if (!id || (id.length < 60 && id !== 'null')) {
            return navigateTo('/kesp/predlosci');
        }
    } catch (error) {
        console.error('Middleware error:', error);
        return navigateTo('/kesp/predlosci');
    }
});


// import { jwtDecode } from "jwt-decode";
// export default defineNuxtRouteMiddleware((to) => {
//     try {
//         const id = to.query.id;

//         console.log("Provjera ID-a:", id);

//         // Ako ID ne postoji ili je prekratak, preusmjeri
//         if (!id || id.length < 50) {
//             console.warn("Nevažeći JWT, preusmjeravam na /kesp/predlosci");
//             return navigateTo('/kesp/predlosci');
//         }

//         try {
//             // Dekodiranje JWT tokena
//             const decoded = jwtDecode(id);

//             // Osnovna validacija
//             if (!decoded || typeof decoded !== "object") {
//                 throw new Error("Nevažeći JWT format");
//             }

//             console.log("Dekodirani JWT:", decoded);
//         } catch (error) {
//             console.error("Neuspjelo dekodiranje JWT-a:", error);
//             return navigateTo('/kesp/predlosci');
//         }

//     } catch (error) {
//         console.error('Middleware error:', error);
//         return navigateTo('/kesp/predlosci');
//     }
// });




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