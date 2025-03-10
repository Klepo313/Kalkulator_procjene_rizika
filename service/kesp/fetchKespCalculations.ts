// kespCalculationService.ts
import { useNuxtApp } from '#app';

export const getKespCalculations = async (): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header`;

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
