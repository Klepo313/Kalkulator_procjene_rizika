// headerService.ts
import { useNuxtApp } from '#app';

export const getHeader = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header/${id}`;

    try {
        const response = await $api.get(url);
        // console.log(response.data[0]);

        if (response.status === 200) {
            return response.data[0];
        } else {
            // console.error('Došlo je do pogreške na serveru!');
            return response;
        }
    } catch (error) {
        // console.error('Greška pri dohvaćanju izračuna: ', error);
        return error;
    }
};

export const getCoolingLossesHeader = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header/${id}/cooling_losses`;

    try {
        const response = await $api.get(url);
        // console.log(response.data);

        if (response.status === 200) {
            return response.data;
        } else {
            // console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        // console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export async function getReport(id: number | string): Promise<Blob | null> {
    if (!id) return null;

    const { $api } = useNuxtApp();
    const url = `CO2/header/${id}/report`;

    try {
        const response = await $api.get(url, {
            Headers: { 'Content-Type': 'application/pdf' },
            responseType: 'blob', // Dohvaćamo kao binarni podatak
        });

        if (response.status === 200) {
            return response.data; // Vraćamo Blob
        } else {
            // console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        // console.error('Greška pri dohvaćanju izvještaja:', error);
        return null;
    }
}

