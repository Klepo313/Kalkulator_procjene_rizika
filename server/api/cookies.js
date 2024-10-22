import { parse } from 'cookie';
import { defineEventHandler, setCookie, deleteCookie, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    if (method === 'GET') {
        // Učitaj naziv kolačića iz query parametara
        const { name } = getQuery(event); // Promijenjeno na getQuery za GET parametre
        const cookies = parse(event.node.req.headers.cookie || '');
        // Dohvati kolačić prema imenu
        const cookieValue = cookies[name] || null;

        return {
            [name]: cookieValue,
        };
    }

    if (method === 'POST') {
        const body = await readBody(event);
        const { name, value } = body; // POST zahtjevi koriste body za ime i vrijednost

        setCookie(event, name, value, {
            httpOnly: true, // Kolačić nije dostupan na klijentskoj strani
            secure: true, // Samo preko HTTPS-a
            maxAge: 60 * 60 * 24, // Vrijeme trajanja kolačića (1 dan)
            path: '/', // Putanja kolačića
        });

        return { message: `Kolačić ${name} je postavljen` };
    }

    if (method === 'DELETE') {
        const body = await readBody(event);
        const { name } = body; // DELETE zahtjevi koriste body za ime

        deleteCookie(event, name);

        return { message: `Kolačić ${name} je obrisan` };
    }

    return { message: 'Nepoznata metoda' };
});
