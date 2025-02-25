// metricService.ts
import { useNuxtApp } from '#app';

export const getMetricTypes = async (id?: number | string): Promise<unknown> => {
    const { $api } = useNuxtApp();
    const url = id !== undefined
        ? `/calculation/${id}/metric_types`
        : `/form/metric_types`;

    try {
        const response = await $api.get(url);
        console.log(response.data);

        if (response.status === 200) {
            return response; // Vraća cjelokupni response ili prilagodite kako trebate
        } else {
            console.error('Došlo je do pogreške na serveru!');
            return null;
        }
    } catch (error) {
        console.error('Greška pri dohvaćanju vrste izračuna: ', error);
        return null;
    }
};

export const addMetricType = async (
    calculationId: number | string,
    metricTypeId: number | string
): Promise<number> => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.post(
            `/calculation/${calculationId}/metric_type`,
            { metricTypeId: parseInt(metricTypeId.toString(), 10) },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log(response.status);
        return response.status;
    } catch (error) {
        console.error('Saving error: ', error);
        return 0;
    }
};

export const removeMetricType = async (
    calculationId: number | string,
    metricTypeId: number | string
): Promise<number> => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.delete(
            `/calculation/${calculationId}/metric_type`,
            {
                data: { metricTypeId: parseInt(metricTypeId.toString(), 10) },
                headers: { 'Content-Type': 'application/json' }
            }
        );
        console.log(response.status);
        return response.status;
    } catch (error: any) {
        console.error('Error response:', error.response);
        console.error('Saving error: ', error);
        return 0;
    }
};
