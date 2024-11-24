import { base_url } from '../composables/variables'
import axios from 'axios';
const postHeader = async (header) => {

    console.log("header: ", header)

    try {
        const response = await axios.post(`${base_url}/CO2/header`, {
            calculationId: null,
            date: header.l_datum,
            dateFrom: header.l_datod,
            dateTo: header.l_datdo,
            description: header.l_opis,
            remark: header.l_napomena
        }, {
            withCredentials: true, // Ensure cookies are included in requests
        });

        console.log(response.data)

        return {
            id: response.data.fn_spremi_ugo_izracun,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }

}

const addEmission = async (data) => {

    try {
        const response = await axios.post(`${base_url}/CO2/item`, {
            itemId: null,
            calculationId: data.p_uiz_id,
            emissionGroupId: data.p_uge_id,
            veichleTypeId: data.p_uvv_id,
            veichleTypeName: data.p_uvv_naziv,
            fuelTypeId: data.p_uvg_id,
            quantity: data.p_kolicina
        }, {
            withCredentials: true, // Ensure cookies are included in requests
        });

        console.log(response.data)

        return {
            id: response.data.fn_spremi_ugo_stavku_o1,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }

}

const deleteEmission = async (id) => {
    try {
        const response = await axios.delete(`${base_url}/CO2/item/${id}`, {
            withCredentials: true, // Ensure cookies are included in requests
        });

        console.log(response)

        return response;
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }
}

const updateEnergyItem = async (data) => {
    console.log("data: ",
        {
            energyItemId: data.p_use_id,
            calculationId: data.p_uiz_id,
            energyTypeId: data.p_uvn_id,
            nonrenewable: data.p_neobnovljivo,
            renewable: data.p_obnovljivo
        }
    )
    try {
        const response = await axios.post(`${base_url}/CO2/energy_item`, {
            energyItemId: data.p_use_id,
            calculationId: data.p_uiz_id,
            energyTypeId: data.p_uvn_id,
            nonrenewable: data.p_neobnovljivo,
            renewable: data.p_obnovljivo,
        }, {
            withCredentials: true, // Ensure cookies are included in requests
        });

        // {   
        //     "p_use_id": 214,
        //     "p_uiz_id": 212,
        //     "p_uvn_id": 76,
        //     "p_neobnovljivo": 5000,
        //     "p_obnovljivo": 999
        // }

        // p_use_id: data.p_use_id,
        // p_uiz_id: data.p_uiz_id,
        // p_uvn_id: data.p_uvn_id,
        // p_neobnovljivo: data.p_neobnovljivo,
        // p_obnovljivo: data.p_obnovljivo

        console.log(response.data)

        return {
            id: response.data.fn_spremi_ugo_energiju_o2,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ' + error)
        return 0;
    }
}

export {
    postHeader,
    addEmission,
    deleteEmission,
    updateEnergyItem
}