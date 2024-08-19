// import { useAuthCookie } from '../composables/useAuthCookie'
import { local_url, local_port } from '../composables/variables'
import axios from 'axios';
//import { formatDMYtoYMD, formatDateToISO } from '~/utils/dateFormatter';

const addMetricType = async (calculationId, metricTypeId) => {
    try {
        const response = await axios.post(`${local_url + local_port}/calculation/${calculationId}/metric_type`, {
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
        const response = await axios.delete(`${local_url + local_port}/calculation/${calculationId}/metric_type`, {
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
    addMetricType,
    removeMetricType
}