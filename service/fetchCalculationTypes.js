import { local_url, local_port } from '../composables/variables'
import axios from 'axios';

const getCalculationTypes = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${local_url + local_port}/form/calculation_types/${id}`
            : `${local_url + local_port}/form/calculation_types`;

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
    getCalculationTypes
}