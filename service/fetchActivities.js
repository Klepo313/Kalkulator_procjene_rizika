import { base_url } from '../composables/variables'
import axios from 'axios';

const getActivities = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/form/activities/${id}`
            : `${base_url}/form/activities`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log(response.data)

        if (response.status == 200) {
            return response; // Vratite podatke ako je potrebno
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri dohvaćanju vrste izračuna: ' + error)
        return null;
    }
}

export {
    getActivities
}