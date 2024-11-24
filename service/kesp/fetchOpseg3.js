import { base_url } from '../composables/variables'
import axios from 'axios';

const getO3categories = async () => {
    try {

        const url = `${base_url}/CO2/categories`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log("categories: ", response.data)

        if (response.status == 200) {
            return response.data; // Vratite podatke ako je potrebno
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri dohvaćanju kategorija: ' + error)
        return null;
    }
}

export {
    getO3categories
}