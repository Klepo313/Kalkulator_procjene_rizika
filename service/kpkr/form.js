import { base_url } from '../composables/variables'
import axios from 'axios';

const getCalculationTypes = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/form/calculation_types/${id}`
            : `${base_url}/form/calculation_types`;

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

const getActivities = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/form/activities/${id}`
            : `${base_url}/form/activities`;

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

const getMunicipalities = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/cadastre/municipality/${id}`
            : `${base_url}/cadastre/municipality`;

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log("cestice", response.data)

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

const getObjectTypes = async (id) => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = id !== undefined
            ? `${base_url}/form/object_types/${id}`
            : `${base_url}/form/object_types`;

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

const getParticlesForMunicipalities = async (id) => {
    if (id) {
        try {
            // Postavite URL na osnovu prisustva id-a
            const url = `${base_url}/cadastre/municipality/${id}/particle`;
            console.log(url);
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
    } else {
        console.log("Nije prosljeđen ID")
        return null;
    }
}

const getScenarios = async () => {
    try {
        // Postavite URL na osnovu prisustva id-a
        const url = `${base_url}/form/scenario_types`

        // Pošaljite GET zahtjev sa withCredentials opcijom
        const response = await axios.get(url, {
            withCredentials: true, // Ovo omogućava slanje kolačića
        });

        console.log("scenariji: ", response.data)

        if (response.status == 200) {
            return response; // Vratite podatke ako je potrebno
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null; // Vratite null ako je greška
        }

    } catch (error) {
        console.error('Greška pri dohvaćanju scenarija:  ' + error)
        return null;
    }
}

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
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }

}

export {
    getCalculationTypes,
    getActivities,
    getMunicipalities,
    getObjectTypes,
    getParticlesForMunicipalities,
    getScenarios,
    saveForm
}