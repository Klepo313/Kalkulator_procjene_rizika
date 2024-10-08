import axios from 'axios';
import { useCookie } from '#app';
import { base_url, generateCsrfToken } from '#imports';

export async function refreshToken() {
    try {
        const response = await axios.post(`${base_url}/user/refresh_token`, {}, {
            withCredentials: true, // Omogućava slanje kolačića
        });

        // Osvježavanje CSRF tokena
        const csrfToken = useCookie('csrfToken', {
            maxAge: 24 * 60 * 60, // 1 dan
            path: '/',
            secure: true,
        });

        // Generiraj novi CSRF token
        const newCsrfToken = generateCsrfToken();
        csrfToken.value = newCsrfToken; // Ažuriraj novi token

        console.log('Sesija je uspješno produljena');
        return response.data;
    } catch (error) {
        console.error('Greška pri produljenju tokena', error);
        throw error;
    }
}
