// emissionService.ts
import { useNuxtApp } from '#app';

export const postHeader = async (
    header: { l_datum: string; l_datod: string; l_datdo: string; l_opis: string; l_napomena: string }
): Promise<{ id: number; status: number } | number> => {
    const { $api } = useNuxtApp();
    console.log("header: ", header);

    try {
        const response = await $api.post(
            '/CO2/header',
            {
                calculationId: null,
                date: header.l_datum,
                dateFrom: header.l_datod,
                dateTo: header.l_datdo,
                description: header.l_opis,
                remark: header.l_napomena
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log(response.data);

        return {
            id: response.data.calculationId,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ', error);
        return 0;
    }
};

export const addEmission = async (
    data: { itemId: number; calculationId: number; emissionGroupId: number; veichleTypeId: number; veichleTypeName: string; fuelTypeId: number; quantity: number }
): Promise<{ id: number; status: number; message: string } | number> => {
    const { $api } = useNuxtApp();

    try {
        const response = await $api.post(
            '/CO2/item',
            {
                itemId: data.itemId,
                calculationId: data.calculationId,
                emissionGroupId: data.emissionGroupId,
                veichleTypeId: data.veichleTypeId,
                veichleTypeName: data.veichleTypeName,
                fuelTypeId: data.fuelTypeId,
                quantity: data.quantity
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log(response.data);

        return {
            id: response.data.fn_spremi_ugo_stavku_o1,
            status: response.status,
            message: response.data.message
        };
    } catch (error) {
        console.error('Saving error: ', error);
        return 0;
    }
};

export const deleteEmission = async (id: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    console.log("id brisajući: ", id);

    try {
        const response = await $api.delete(`/CO2/item/${id}`);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Saving error: ', error);
        return 0;
    }
};

export const updateEnergyItem = async (
    data: { p_use_id: number; p_uiz_id: number; p_uvn_id: number; p_neobnovljivo: number; p_obnovljivo: number }
): Promise<{ id: number; status: number } | number> => {
    const { $api } = useNuxtApp();
    console.log("data: ", {
        energyItemId: data.p_use_id,
        calculationId: data.p_uiz_id,
        energyTypeId: data.p_uvn_id,
        nonrenewable: data.p_neobnovljivo,
        renewable: data.p_obnovljivo
    });

    try {
        const response = await $api.post(
            '/CO2/energy_item',
            {
                energyItemId: data.p_use_id,
                calculationId: data.p_uiz_id,
                energyTypeId: data.p_uvn_id,
                nonrenewable: data.p_neobnovljivo,
                renewable: data.p_obnovljivo
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log(response.data);

        return {
            id: response.data.fn_spremi_ugo_energiju_o2,
            status: response.status
        };
    } catch (error) {
        console.error('Saving error: ', error);
        return 0;
    }
};
