// import { useAuthCookie } from '../composables/useAuthCookie'
import { base_url } from '../composables/variables'
import axios from 'axios';
//import { formatDMYtoYMD, formatDateToISO } from '~/utils/dateFormatter';

const saveForm = async (calculationId, date, calculationTypeId, cadastreMunicipalityId, cadastreParticleId, objectTypeId, activityId, description, remark, scenarij) => {
    try {
        const response = await axios.post(`${base_url}/calculation`, {
            calculationId: calculationId,
            date: date,
            calculationTypeId: parseInt(calculationTypeId),
            cadastreMunicipalityId: parseInt(cadastreMunicipalityId),
            cadastreParticleId: parseInt(cadastreParticleId),
            objectTypeId: objectTypeId == null ? null : parseInt(objectTypeId),
            activityId: activityId == null ? null : parseInt(activityId),
            scenarioTypeId: scenarij,
            description: description,
            remark: remark,
        }, {
            withCredentials: true, // Ensure cookies are included in requests
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.status)

        return {
            data: response.data,
            resId: response.data.aiz_id,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }

}

export {
    saveForm,
}