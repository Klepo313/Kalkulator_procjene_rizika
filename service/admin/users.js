import axios from "axios"
import { base_url } from "#build/imports"

const getPartner = async (id) => {
    if (!id) {
        console.error("Nije prosljeđen ID partnera!");
        return null;
    }

    try {
        const url = id ? `${base_url}/partner/${id}` : `${base_url}/partner`;

        const response = await axios.get(url, { withCredentials: true });
        console.log("Partneri: ", response.data)

        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju partnera: ' + error)
        return null;
    }
}

const getPravneOsobe = async () => {
    try {
        const url = `${base_url}/partner/legal`;

        const response = await axios.get(url, { withCredentials: true });
        console.log("Pravne osobe: ", response.data)

        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju pravne osobe: ' + error)
        return null;
    }
}

const getFizickeOsobe = async () => {
    try {
        const url = `${base_url}/partner/physical`;

        const response = await axios.get(url, { withCredentials: true });
        console.log("Fizicke osobe: ", response.data)

        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju fizicke osobe: ' + error)
        return null;
    }
}

const getUsersForLegalPartner = async (id) => {
    if (!id) {
        console.error("Nije prosljeđen ID partnera!");
        return null;
    }

    try {
        const url = `${base_url}/partner/legal/${id}/users`;

        const response = await axios.get(url, { withCredentials: true });
        // console.log("Korisnici za pravnu osobu: ", response.data)

        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju fizicke osobe: ' + error)
        return null;
    }
}

const savePartner = async (data) => {
    if (!data.epr_tip) {
        console.error("Tip pravne osobe nije unesen!");
        return null;
    }

    const partner = {
        type: data.epr_tip,
        oib: data.epr_oib,
        firstName: data?.epr_ime || null,
        lastName: data?.epr_prezime || null,
        name: data?.epr_naziv || null,
        municipality: data?.epr_mjesto || null,
        address: data?.epr_adresa || null,
        email: data?.epr_email || null,
    }
    console.log("partner za spremanje: ", partner);

    try {
        const response = await axios.post(`${base_url}/partner`, partner,
            { withCredentials: true }
        );
        console.log(response.data);

        return response;
    } catch (error) {
        console.error('Greška pri spremanju osobe: ' + error)
        return null;
    }
}

export {
    getPartner,
    getPravneOsobe,
    getFizickeOsobe,
    getUsersForLegalPartner,
    savePartner,
}