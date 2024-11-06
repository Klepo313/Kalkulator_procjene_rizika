import { base_url } from '../composables/variables'
import axios from 'axios';

const getMetricTypes = async (id) => {
    try {
        console.log("IDID: ", id);
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/calculation/${id}/metric_types`
            : `${base_url}/form/metric_types`;

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

const addMetricType = async (calculationId, metricTypeId) => {
    try {
        const response = await axios.post(`${base_url}/calculation/${calculationId}/metric_type`, {
            metricTypeId: parseInt(metricTypeId),
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.status)

        return response.status;
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }
}

const removeMetricType = async (calculationId, metricTypeId) => {
    try {
        const response = await axios.delete(`${base_url}/calculation/${calculationId}/metric_type`, {
            data: {
                metricTypeId: parseInt(metricTypeId)
            },
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.status)

        return response.status;
    } catch (error) {
        console.error('Error response:', error.response);
        console.error('Saving error: ' + error)
        return 0;
    }
}

export {
    getMetricTypes,
    addMetricType,
    removeMetricType
}