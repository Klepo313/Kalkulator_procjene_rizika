// co2Service.ts
import { useNuxtApp } from '#app';

export const getVehicles = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/header/${id}/items`;

    try {
        const response = await $api.get(url);
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const getEmmisionGroups = async (id?: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = id !== undefined ? `/CO2/emission_groups/${id}` : `/CO2/emission_groups`;

    try {
        const response = await $api.get(url);
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const getVehiclesForEmmisionGroups = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/emission_groups/${id}/vehicle_types`;

    try {
        const response = await $api.get(url);
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const getFuelTypes = async (
    p_uge_id: number | string,
    p_uvv_id?: number | string
): Promise<unknown> => {
    const { $api } = useNuxtApp();
    console.log("parametri: ", p_uge_id, ", ", p_uvv_id);
    const url = p_uvv_id
        ? `/CO2/fuel_types/by_filters/${p_uge_id}/${p_uvv_id}`
        : `/CO2/fuel_types/by_filters/${p_uge_id}`;

    try {
        const response = await $api.get(url);
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const getCoolingLosses = async (): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/cooling_losses`;

    try {
        const response = await $api.get(url);
        console.log("LOSSES: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const getCoolingCalculationItems = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = `/CO2/item/${id}/cooling_calculation`;

    try {
        const response = await $api.get(url);
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju izračuna: ', error);
        return null;
    }
};

export const saveCoolingCalculation = async (data): Promise<unknown> => {
    const { $api } = useNuxtApp();
    console.log("Primljeni podaci: ", data);

    if (!(
        data?.uir_ugr_id && data?.uir_brjed &&
        data?.uir_uvg_id && data?.uir_kapacitet && data?.uir_ugradnja &&
        data?.uir_rad && data?.uir_kraj
    )) {
        console.log("Invalid data");
        return null;
    } else {
        console.log("Valid data");
        const url = `/CO2/cooling_calculation`;

        try {
            const response = await $api.post(
                url,
                {
                    coolingCalculationId: data?.uir_usi_id,
                    calculationId: data?.uiz_id,
                    coolingLossesId: data?.uir_ugr_id,
                    itemsNum: data?.uir_brjed,
                    fuelTypeId: data?.uir_uvg_id,
                    capacity: data?.uir_kapacitet,
                    installation: data?.uir_ugradnja,
                    work: data?.uir_rad,
                    end: data?.uir_kraj,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log("Rezultat savea: ", response.data);
            return response;
        } catch (error) {
            console.error('Greška pri spremanju cooling calculation: ', error);
            return null;
        }
    }
};
