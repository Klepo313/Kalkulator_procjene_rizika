export const useUsers = () => {
    const { $api } = useNuxtApp()

    const getPravneOsobe = async () => {
        try {
            const url = `/partner/legal`;

            const response = await $api.get(url);
            const data = await response.data;

            console.log("Pravne osobe: ", data)
            return data;
        } catch (error) {
            console.error('Greška pri dohvaćanju pravne osobe: ' + error)
            return null;
        }
    }

    return {
        getPravneOsobe
    };
}