import { base_url } from '../composables/variables'
import axios from 'axios';

const getO3categories = async (id) => {
    try {
        console.log("Id: " + id);
        const url = `${base_url}/CO2/item/${id}/categories`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        const data = await response.data

        console.log("categories: ", data)

        if (response.status == 200) {
            return data; // Vratite podatke ako je potrebno
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri dohvaćanju kategorija: ' + error)
        return null;
    }
}

const saveCategoryStatus = (data) => {
    try {
        console.log("Data: ", data);
        const url = `${base_url}/CO2/category/client`;

        // Pošaljite POST zahtjev sa withCredentials opcijom
        const response = axios.post(url, data, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        })

        console.log("Relevantnost saved: ", response.data)
        return response.data;

    } catch (error) {
        console.error('Greška pri spremanju kategorija: ' + error)
    }
}

export {
    getO3categories,
    saveCategoryStatus,
}