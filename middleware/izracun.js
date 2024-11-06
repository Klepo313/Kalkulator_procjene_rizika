// // middleware/auth.js
// import { defineNuxtRouteMiddleware, navigateTo } from '#app';
// import { initializeCookie } from '~/utils/initializeCookie';

// const idIzracuna = ref('');

// export default defineNuxtRouteMiddleware(async () => {
//     // Ako je na strani klijenta
//     // const idIzracuna = useCookie('id_izracuna');

//     idIzracuna.value = await initializeCookie('id-izracuna');

//     if (idIzracuna.value === '/' || idIzracuna.value) {
//         console.log('Valid id_izracuna found, continuing...');
//         return;
//     } else {
//         console.log('No id_izracuna found, redirecting...');
//         return navigateTo('/kpkr/predlosci');
//     }
// });

// middleware/checkIzracun.js
import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from '#app';
import { initializeCookie } from "~/utils/initializeCookie";

export default defineNuxtRouteMiddleware(async () => {
    // Pristupi zaglavljima zahtjeva ako smo na serveru (SSR)
    const headers = useRequestHeaders(['cookie']); // Dohvati kolačiće iz request headera
    let idIzracuna;

    // Ako smo na serveru (SSR), dohvaćamo kolačiće iz zaglavlja
    if (import.meta.server) {
        console.log("server");
        const cookies = headers.cookie || '';  // Zaglavlje koje sadrži kolačiće
        const izracunMatch = cookies.match(/id-izracuna=([^;]+)/); // Regex za pronalazak vrijednosti kolačića
        idIzracuna = izracunMatch ? izracunMatch[1] : null; // Ako je pronađen kolačić
    } else {
        console.log("client");
        // Ako smo na klijentu, koristimo Nuxtov `useCookie` hook za dohvaćanje kolačića
        idIzracuna = await initializeCookie('id-izracuna');
    }

    // Ako nema id-izracuna, preusmjeravamo na odgovarajuću stranicu
    if (!idIzracuna) {
        console.log('No id_izracuna found, redirecting...');
        return navigateTo('/kpkr/predlosci');
    }

    console.log('Valid id_izracuna found, continuing:', idIzracuna);
});


// // middleware/izracun.js
// import { defineNuxtRouteMiddleware, navigateTo } from '#app';
// import { base_url } from '#imports';
// import axios from 'axios';

// export default defineNuxtRouteMiddleware(async () => {
//     try {
//         // Poziv prema udaljenom serveru na '/get-cookie' za provjeru postojanja kolačića
//         const response = await axios.get(`${base_url}/user/get-cookie`, {
//             params: {
//                 names: 'id-izracuna' // Send as a comma-separated string
//             },
//             withCredentials: true, // Omogućuje slanje kolačića s zahtjevom
//         });

//         console.log("response data:", response.data);
//         const idIzracuna = response.data['id-izracuna'];
//         console.log('id_izracuna:', idIzracuna);

//         // Ako je `idIzracuna` undefined ili null, preusmjeri na /kpkr/predlosci
//         if (!idIzracuna) {
//             console.log('No id_izracuna found, redirecting...');
//             return navigateTo('/kpkr/predlosci');
//         }

//         console.log('Valid id_izracuna found, continuing:', idIzracuna);
//         return;
//     } catch (error) {
//         console.error('Error fetching cookie from remote server:', error);
//         return navigateTo('/kpkr/predlosci');
//     }
// });
