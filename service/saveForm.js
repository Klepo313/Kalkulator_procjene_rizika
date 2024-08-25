// import { useAuthCookie } from '../composables/useAuthCookie'
import { local_url, local_port } from '../composables/variables'
import axios from 'axios';
//import { formatDMYtoYMD, formatDateToISO } from '~/utils/dateFormatter';

const saveForm = async (calculationId, date, calculationTypeId, cadastreMunicipalityId, cadastreParticleId, objectTypeId, activityId, description, remark) => {

    console.log("calc save: ", calculationId)

    try {
        const response = await axios.post(`${local_url + local_port}/calculation`, {
            calculationId: calculationId,
            date: date,
            calculationTypeId: parseInt(calculationTypeId),
            cadastreMunicipalityId: parseInt(cadastreMunicipalityId),
            cadastreParticleId: parseInt(cadastreParticleId),
            objectTypeId: parseInt(objectTypeId),
            activityId: parseInt(activityId),
            description: description,
            remark: remark
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.status)

        return response.data;
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }

}

export {
    saveForm,
}