import { base_url } from '../composables/variables'
import axios from 'axios';

const getCalculation = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${base_url}/calculation/${id}`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log(response)

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
    getCalculation
}