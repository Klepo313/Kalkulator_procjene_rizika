import { base_url } from '../composables/variables'
import axios from 'axios';

const checkLogin = async () => {
    try {
        const url = `${base_url}/user/is_loggedin`;

        const response = await axios.get(url, {
            withCredentials: true,
            validateStatus: function (status) {
                console.log('is_loggedin: ', status)
                return status === 200 || status === 401;
            }
        });

        console.log("Logiran? ", response.data.isLoggedin, response.status);

        // Ako je status 200, vraćamo isLoggedin vrijednost
        if (response.status === 200) {
            return response.data.isLoggedin;
        }

        // Ako je status 401 (Unauthorized), tretiramo kao da korisnik nije prijavljen
        if (response.status === 401) {
            return 0;
        }

        // Ako dođe do drugih statusnih kodova, vraćamo null kao grešku
        return null;

    } catch (error) {
        // Ako se dogodi neka druga greška (npr. mrežna greška), vraćamo 0
        console.error('Greška pri provjeri logiranja: ' + error);
        return 0;
    }
};

export {
    checkLogin
};
