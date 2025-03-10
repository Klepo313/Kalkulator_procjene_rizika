// energyService.ts
import { useNuxtApp } from '#app';

export const getEnergySources = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header/${id}/energy_items`;

    try {
        const response = await $api.get(url);
        // console.log("energy_items: ", response.data);

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
