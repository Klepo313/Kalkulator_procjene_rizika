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
const getFuelTypes = async (p_uge_id, p_uvv_id) => {
    try {
        console.log("parametri: ", p_uge_id, ", ", p_uvv_id)
        const url = p_uvv_id
            ? `${base_url}/CO2/fuel_types/by_filters/${p_uge_id}/${p_uvv_id}`
            : `${base_url}/CO2/fuel_types/by_filters/${p_uge_id}`;

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

const getCoolingLosses = async () => {
    try {
        const url = `${base_url}/CO2/cooling_losses`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log("LOSSES: " + response.data)
        return response.data; // Vratite podatke ako je potrebno

    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ' + error)
        return null;
    }
}

const getCoolingCalculationItems = async (id) => {
    try {
        const url = `${base_url}/CO2/item/${id}/cooling_calculation`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        return response.data; // Vratite podatke ako je potrebno

    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ' + error)
        return null;
    }
}

const saveCoolingCalculation = async (data) => {
    console.log("Primljeni podaci: ", data)

    if (!(
        data?.uir_ugr_id && data?.uir_brjed &&
        data?.uir_uvg_id && data?.uir_kapacitet && data?.uir_ugradnja &&
        data?.uir_rad && data?.uir_kraj
    )
    ) {
        console.log("Invalid data")
        return null;
    } else {
        console.log("Valid data")

        try {
            const url = `${base_url}/CO2/cooling_calculation`;

            // Pošaljite POST zahtjev sa withCredentials opcijom
            const response = await axios.post(url, {
                coolingCalculationId: data?.uir_usi_id,
                calculationId: data?.uiz_id,
                coolingLossesId: data?.uir_ugr_id,
                itemsNum: data?.uir_brjed,
                fuelTypeId: data?.uir_uvg_id,
                capacity: data?.uir_kapacitet,
                installation: data?.uir_ugradnja,
                work: data?.uir_rad,
                end: data?.uir_kraj
            }, {
                withCredentials: true,
            })
            console.log("Rezultat savea: ", response.data)
            return response; // Vratite podatke ako je potrebno
        } catch (error) {
            console.error('Greška pri spremanju cooling calulation: ' + error)
        }
    }

}

export {
    getVehicles,
    getEmmisionGroups,
    getVehiclesForEmmisionGroups,
    getFuelTypes,
    getCoolingCalculationItems,
    getCoolingLosses,
    saveCoolingCalculation
}