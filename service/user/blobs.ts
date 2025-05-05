export const getLogo = async (blobName: string): Promise<Blob | null> => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.get(`/user/logo/${blobName.toUpperCase()}`, {
            responseType: 'blob', // 👈 OVO JE KLJUČNO!
        });
        return response.data as Blob;
    } catch (error) {
        console.error('Greška pri dohvaćanju bloba: ', error);
        return null;
    }
};
