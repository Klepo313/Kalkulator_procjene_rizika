// calculationService.ts
import { useNuxtApp } from '#app';

export const getCalculations = async (id?: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    // console.log("Entering id: ", id);
    const url = id ? `/calculation/${id}` : `/calculation/user`;
    // console.log("URL: ", url);

    try {
        const response = await $api.get(url);
        // console.log(response.data);

        if (response.status === 200) {
            return response;
        } else {
            // console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        // console.error('Greška pri dohvaćanju vrste izračuna: ', error);
        return null;
    }
};
