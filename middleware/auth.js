// // middleware/auth.js
// import { defineNuxtRouteMiddleware, navigateTo } from '#app';
// import { initializeCookie } from "~/utils/initializeCookie";

// export default defineNuxtRouteMiddleware(async () => {
//     try {
//         // const csrfToken = await initializeCookie('accessToken');
//         const csrfToken = useCookie('accessToken').value;
//         console.log("csrf token: ", csrfToken);

//         if (!csrfToken) return navigateTo('/login');

//         console.log("User logged in");
//         return;
//     } catch (error) {
//         console.error('Error during login check:', error.message || error); // Uhvatljena i ispisana greška ako je došlo do pogreške pri provjeravanju prijave
//         return navigateTo('/login'); // Ako je greška, također preusmjeravamo na login
//     }
// });


// middleware/auth.js
import { defineNuxtRouteMiddleware, navigateTo, useCookie, useRequestHeaders } from '#app';
import { checkLogin } from '~/temp/checkLogin';
import { initializeCookie } from "~/utils/initializeCookie";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = useCookie('userToken');
    if (!token.value) {
        return navigateTo('/login');
    }

    console.log("User logged in");
});

// export default defineNuxtRouteMiddleware(async (to, from) => {
//     // Pristupi zaglavljima zahtjeva ako smo na serveru (SSR)
//     const headers = useRequestHeaders(['cookie']); // Dohvati kolačiće iz request headera
//     let csrfToken;
//     // Ako smo na serveru (SSR), dohvaćamo kolačiće iz zaglavlja
//     if (import.meta.server) {
//         console.log("server");
//         const cookies = headers.cookie || '';  // Zaglavlje koje sadrži kolačiće
//         const csrfMatch = cookies.match(/accessToken=([^;]+)/); // Regex za pronalazak vrijednosti kolačića
//         csrfToken = csrfMatch ? csrfMatch[1] : null; // Ako je pronađen kolačić
//     } else {
//         console.log("client");
//         // Ako smo na klijentu, koristimo Nuxtov `useCookie` hook za dohvaćanje kolačića
//         // csrfToken = await initializeCookie('accessToken');
//         csrfToken = await checkLogin();
//     }

//     // Ako nema tokena, preusmjeravamo na login
//     if (!csrfToken) {
//         return navigateTo('/login');
//     }

//     console.log("Authenticated, token found:", csrfToken);
// });
