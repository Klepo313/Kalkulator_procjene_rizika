import { base_url } from '../composables/variables'
import axios from 'axios';

const checkLogin = async () => {
    try {
        const url = `${base_url}/user/is_loggedin`;

        const response = await axios.get(url, {
            withCredentials: true,
        });

        console.log("Logiran? ", response.data)

        if (response.status == 200) {
            return response.data;
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri provjeri logiranja: ' + error)
        return null;
    }
}

export {
    checkLogin
}