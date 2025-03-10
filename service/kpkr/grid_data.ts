// gridService.ts
import { useNuxtApp } from '#app';

export const getProcessGridData = async (
    id: number | string,
    type: string
): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/calculation/process/${id}/${type}`;

    try {
        const response = await $api.get(url);
        // console.log("Proces response: ", response);
        return response;
    } catch (error) {
        // console.error("Greška pri dohvaćanju grid podataka: ", error);
        return null;
    }
};

export const getPropertyGridData = async (
    id: number | string,
    type: string
): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/calculation/property/${id}/${type}`;

    try {
        const response = await $api.get(url);
        // console.log("Imovina response: ", response);
        return response;
    } catch (error) {
        // console.error("Greška pri dohvaćanju grid podataka: ", error);
        return null;
    }
};
