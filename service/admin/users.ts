// partnerService.ts
import { useNuxtApp } from '#app';

export const getPartner = async (id: number | string): Promise<unknown> => {
    if (!id) {
        console.error("Nije prosljeđen ID partnera!");
        return null;
    }
    const { $api } = useNuxtApp();
    try {
        const url = `/partner/${id}`;
        const response = await $api.get(url);
        console.log("Partneri: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju partnera: ', error);
        return null;
    }
};

export const getPravneOsobe = async (): Promise<unknown> => {
    const { $api } = useNuxtApp();
    try {
        const url = `/partner/legal`;
        const response = await $api.get(url);
        console.log("Pravne osobe: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju pravne osobe: ', error);
        return null;
    }
};

export const getFizickeOsobe = async (): Promise<unknown> => {
    const { $api } = useNuxtApp();
    try {
        const url = `/partner/physical`;
        const response = await $api.get(url);
        console.log("Fizicke osobe: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju fizicke osobe: ', error);
        return null;
    }
};

export const getUsersForLegalPartner = async (id: number | string): Promise<unknown> => {
    if (!id) {
        console.error("Nije prosljeđen ID partnera!");
        return null;
    }
    const { $api } = useNuxtApp();
    try {
        const url = `/partner/legal/${id}/users`;
        const response = await $api.get(url);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju korisnika za pravnu osobu: ', error);
        return null;
    }
};

export const savePartner = async (data: {
    epr_tip: string;
    epr_oib: string;
    epr_ime?: string;
    epr_prezime?: string;
    epr_naziv?: string;
    epr_mjesto?: string;
    epr_adresa?: string;
    epr_email?: string;
}): Promise<unknown> => {
    if (!data.epr_tip) {
        console.error("Tip pravne osobe nije unesen!");
        return null;
    }
    const partner = {
        type: data.epr_tip,
        oib: data.epr_oib,
        firstName: data.epr_ime || null,
        lastName: data.epr_prezime || null,
        name: data.epr_naziv || null,
        municipality: data.epr_mjesto || null,
        address: data.epr_adresa || null,
        email: data.epr_email || null,
    };
    console.log("partner za spremanje: ", partner);
    const { $api } = useNuxtApp();
    try {
        const response = await $api.post('/partner', partner, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Greška pri spremanju osobe: ', error);
        return null;
    }
};

export const saveUser = async (data: unknown): Promise<unknown> => {
    console.log("Primljena osoba: ", data);
    const { $api } = useNuxtApp();
    try {
        const response = await $api.post('/user', data, {
            headers: { 'Content-Type': 'application/json' }
        });
        const resData = response.data;
        console.log(resData);
        return resData;
    } catch (error) {
        console.error('Greška pri spremanju osobe: ', error);
        return null;
    }
};
