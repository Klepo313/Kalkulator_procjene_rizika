// headerService.ts
import { useNuxtApp } from '#app';

export const getHeader = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header/${id}`;

    try {
        const response = await $api.get(url);
        console.log(response.data[0]);

        if (response.status === 200) {
            return response.data[0];
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};
