import { base_url } from '../composables/variables'
import axios from 'axios';

const checkLogin = async () => {
    try {
        const url = `${base_url}/user/is_loggedin`;

        const response = await axios.get(url, {
            withCredentials: true,
        });

        console.log("Logiran? ", response.data.isLoggedin, response.status);

        // Ako je status 200, vraćamo isLoggedin vrijednost
        if (response.status == 200) {
            return response.data.isLoggedin;
        } else {
            return false;
        }

    } catch (error) {
        // Ako se dogodi neka druga greška (npr. mrežna greška), vraćamo 0
        console.error('Greška pri provjeri logiranja: ' + error);
        return 0;
    }
};

export {
    checkLogin
};
