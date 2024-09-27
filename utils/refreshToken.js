import axios from 'axios';
import { useCookie } from '#app';
import { generateCsrfToken } from '~/utils/generateCSRFtoken';
import { base_url } from '../composables/variables';

export function setupTokenRefresh() {
    const csrfTokenCookie = useCookie('csrfToken', {
        maxAge: 24 * 60 * 60, // 1 dan
        path: '/',
        secure: true,
    });

    const csrfToken = csrfTokenCookie.value;

    if (csrfToken) {
        // Vrijeme trajanja CSRF tokena (24h)
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 sata u milisekundama
        const refreshThreshold = 2 * 60 * 1000; // 2 minute prije isteka

        // Izračunaj koliko vremena preostaje do osvježavanja
        const timeUntilRefresh = expirationTime - Date.now() - refreshThreshold;

        if (timeUntilRefresh > 0) {
            setTimeout(async () => {
                try {
                    // Pošalji zahtjev za generiranje novog CSRF tokena
                    const response = await axios.post(`${base_url}/refresh_token`, {}, {
                        withCredentials: true,
                    });

                    console.log("Uspješno osvježen CSRF token:", response);

                    // Generiraj novi CSRF token
                    const newCsrfToken = generateCsrfToken();

                    // Ažuriraj CSRF token u kolačiću
                    csrfTokenCookie.value = newCsrfToken;
                    console.log("Novi CSRF token postavljen:", newCsrfToken);
                } catch (error) {
                    console.error('Greška prilikom osvježavanja CSRF tokena:', error);
                }
            }, timeUntilRefresh);
        }
    } else {
        console.warn('CSRF token nije pronađen u kolačićima.');
    }
}
