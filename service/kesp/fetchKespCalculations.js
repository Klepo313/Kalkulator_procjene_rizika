import { base_url } from '../composables/variables'
import axios from 'axios';

const getKespCalculations = async () => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${base_url}/CO2/header`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log(response.data)

        if (response.status == 200) {
            return response.data; // Vratite podatke ako je potrebno
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ' + error)
        return null;
    }
}

export {
    getKespCalculations
}