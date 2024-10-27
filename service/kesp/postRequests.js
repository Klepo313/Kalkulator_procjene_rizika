import { base_url } from '../composables/variables'
import axios from 'axios';
const postHeader = async (header) => {

    console.log("header: ", header)

    try {
        const response = await axios.post(`${base_url}/CO2/header`, {
            l_uiz_id: null,
            l_datum: header.l_datum,
            l_datod: header.l_datod,
            l_datdo: header.l_datdo,
            l_opis: header.l_opis,
            l_napomena: header.l_napomena
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
            p_usi_id: null,
            p_uiz_id: data.p_uiz_id,
            p_uge_id: data.p_uge_id,
            p_uvv_id: data.p_uvv_id,
            p_uvv_naziv: data.p_uvv_naziv,
            p_uvg_id: data.p_uvg_id,
            p_kolicina: data.p_kolicina
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

const updateEnergyItem = async (data) => {
    console.log("data: ", data)
    try {
        const response = await axios.post(`${base_url}/CO2/energy_item`, {
            p_use_id: data.p_use_id,
            p_uiz_id: data.p_uiz_id,
            p_uvn_id: data.p_uvn_id,
            p_neobnovljivo: data.p_neobnovljivo,
            p_obnovljivo: data.p_obnovljivo
        }, {
            withCredentials: true, // Ensure cookies are included in requests
        });

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
    updateEnergyItem
}