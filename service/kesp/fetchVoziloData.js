import { base_url } from '../composables/variables'
import axios from 'axios';

const getVehicles = async (id) => {
    try {

        const url = `${base_url}/CO2/header/${id}/items`;

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

const getEmmisionGroups = async (id) => {
    try {

        const url = id !== undefined
            ? `${base_url}/CO2/emission_groups/${id}`
            : `${base_url}/CO2/emission_groups`;

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

const getVehiclesForEmmisionGroups = async (id) => {
    try {

        const url = `${base_url}/CO2/emission_groups/${id}/vehicle_types`

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
const getFuelTypes = async () => {
    try {

        const url = `${base_url}/CO2/fuel_types`

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
    getVehicles,
    getEmmisionGroups,
    getVehiclesForEmmisionGroups,
    getFuelTypes,
}