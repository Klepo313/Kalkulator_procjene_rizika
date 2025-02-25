import axios from 'axios';
import { useCookie } from '#app';
import { base_url, generateCsrfToken } from '#imports';

export async function refresh_token() {
    try {
        const response = await axios.post(`${base_url}/user/refresh_token`, {
            withCredentials: true, // Omogućava slanje kolačića
        });
        
        console.log('Sesija je uspješno produljena');
        return response;
    } catch (error) {
        console.error('Greška pri produljenju tokena', error);
        throw error;
    }
}
