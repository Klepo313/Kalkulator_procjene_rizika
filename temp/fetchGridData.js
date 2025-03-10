// /process/:id/:type

import { base_url } from '../composables/variables'
import axios from 'axios';

const getProcessGridData = async (id, type) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${base_url}/calculation/process/${id}/${type}`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        // console.log("Proces response: ", response)

        return response; // Vratite podatke ako je potrebno
        // if (response.status == 200) {
        // } else {
        //     // console.error('Došlo je do pogreške na serveru!');
        //     return null; // Vratite null ako je greška
        // }

    } catch (error) {
        // console.error('Greška pri dohvaćanju grid podataka ' + error)
        return null;
    }
}

const getPropertyGridData = async (id, type) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${base_url}/calculation/property/${id}/${type}`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        // console.log("Imovina response: ", response)

        return response; // Vratite podatke ako je potrebno
        // if (response.status == 200) {
        // } else {
        //     // console.error('Došlo je do pogreške na serveru!');
        //     return null; // Vratite null ako je greška
        // }

    } catch (error) {
        // console.error('Greška pri dohvaćanju grid podataka ' + error)
        return null;
    }
}
export {
    getProcessGridData,
    getPropertyGridData
}
