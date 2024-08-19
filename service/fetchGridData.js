// /process/:id/:type

import { local_url, local_port } from '../composables/variables'
import axios from 'axios';

const getProcessGridData = async (id, type) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${local_url + local_port}/calculation/process/${id}/${type}`;

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
        console.error('Greška pri dohvaćanju grid podataka ' + error)
        return null;
    }
}

const getPropertyGridData = async (id, type) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${local_url + local_port}/calculation/property/${id}/${type}`;

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
        console.error('Greška pri dohvaćanju grid podataka ' + error)
        return null;
    }
}
export {
    getProcessGridData,
    getPropertyGridData
}
