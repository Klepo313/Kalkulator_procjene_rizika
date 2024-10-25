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
        idIzracuna = await initializeCookie('kesp-id');
    }

    // Ako nema id-izracuna, preusmjeravamo na odgovarajuću stranicu
    if (!idIzracuna) {
        console.log('No id_izracuna found, redirecting...');
        return navigateTo('/kesp/predlosci');
    }

    console.log('Valid id_izracuna found, continuing:', idIzracuna);
});