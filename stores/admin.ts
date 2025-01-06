import { defineStore } from 'pinia';
import { getFizickeOsobe, getPravneOsobe, getUsersForLegalPartner } from '~/service/admin/users';

export const useKorisniciStore = defineStore('korisnici', {
    state: () => ({
        pravneOsobe: [],
        fizickeOsobe: [],
    }),
    actions: {
        async fetchPravneOsobe() {
            try {
                const data = await getPravneOsobe();
                this.pravneOsobe = await Promise.all(
                    data.map(async (po) => {
                        if (parseInt(po.employees_num) > 0) {
                            const users = await this.fetchKorisniciForLegalPartner(po.epr_id);
                            return { ...po, users }; // Dodaj korisnike u pravnu osobu
                        }
                        return { ...po, users: [] }; // Ako nema zaposlenih, postavi prazan niz
                    })
                );
            } catch (error) {
                console.error('Error fetching pravne osobe:', error);
            }
        },
        async fetchFizickeOsobe() {
            try {
                const data = await getFizickeOsobe();
                this.fizickeOsobe = data;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchKorisniciForLegalPartner(id) {
            try {
                return await getUsersForLegalPartner(id);
            } catch (error) {
                console.error(`Error fetching korisnici for legal partner ${id}:`, error);
                return [];
            }
        },
    }
})