// checkLogin.js
import { base_url } from '../composables/variables';
import axios from 'axios';

const checkLogin = async () => {
    try {
        const url = `${base_url}/user/is_loggedin`;

        const response = await axios.get(url, {
            withCredentials: true,
        });

        // console.log("Logiran?", response.data.isLoggedin, response.status);

        return response.status === 200 && response.data.isLoggedin === true;

    } catch (error) {
        // console.error('Greška pri provjeri logiranja:', error);
        return false; // Uvijek vraćamo `false` umjesto `0` radi konzistentnosti
    }
};

export { checkLogin };
