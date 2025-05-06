import { getCalculations } from '~/service/kpkr/calculations';
import { getHeader } from '~/service/kesp/fetchHeader';

export default defineNuxtPlugin(() => {
    const validateId = async (id: string, path: string): Promise<boolean> => {
        try {
            if (path.startsWith('/kpkr')) {
                const res = await getCalculations(id);
                if ((res as any)?.message) return false;
            } else if (path.startsWith('/kesp')) {
                const res = await getHeader(id);
                if ((res as any)?.message) return false;
            } else {
                return true; // ne diraj ako nije /kesp ili /kpkr
            }

            return true;
        } catch (error: any) {
            return !!error?.message ? false : true;
        }
    };

    return {
        provide: {
            validateId,
        },
    };
});
