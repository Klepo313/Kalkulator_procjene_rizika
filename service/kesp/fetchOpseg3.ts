// categoryService.ts
import { useNuxtApp } from '#app';

export const getO3categories = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    console.log("Id: ", id);
    const url = `/CO2/header/${id}/categories`;

    try {
        const response = await $api.get(url);
        const data = response.data;
        console.log("categories: ", data);

        if (response.status === 200) {
            return data; // Vraćamo podatke ako je zahtjev uspješan
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju kategorija: ', error);
        return null;
    }
};

export const saveCategoryStatus = async (data: unknown): Promise<unknown> => {
    const { $api } = useNuxtApp();
    try {
        console.log("Data: ", data);
        const url = `/CO2/category/client`;

        // Šaljemo POST zahtjev s JSON podacima
        const response = await $api.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log("Relevantnost saved: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Greška pri spremanju kategorija: ', error);
        return null;
    }
};
