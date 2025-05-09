import { defineStore } from 'pinia';
import { useUsers } from '~/composables/users/useUsers';
import { getContracts, getFizickeOsobe, getPartners, getPravneOsobe, getUsersForLegalPartner } from '~/service/admin/users';

export const useKorisniciStore = defineStore('korisnici', {
    state: () => ({
        pravneOsobe: [],
        fizickeOsobe: [],
        searchFizickeOsobe: [],
        expandedRows: [],
        ugovori: [],
        selectedPrava: [],
    }),
    actions: {
        async fetchOsobe(): Promise<void> {
            try {
                const partners: { epr_tip: string; epr_id?: number; eko_par_id_za?: number }[] = await getPartners() || [];
                if (!partners || !Array.isArray(partners)) return;

                this.fizickeOsobe = partners.filter((partner) => partner?.epr_tip === 'FO');
                this.pravneOsobe = partners.filter((partner) => partner?.epr_tip === 'PO');

                this.fizickeOsobe = this.fizickeOsobe.map((fizicka) => {
                    return {
                        ...fizicka,
                        tvrtka_usluge: "ATD Solucije",
                    };
                })

                // Povezivanje fizičkih osoba s pravnim osobama
                this.pravneOsobe = this.pravneOsobe.map((pravnaOsoba) => {
                    return {
                        ...pravnaOsoba,
                        users: this.fizickeOsobe.filter((fizickaOsoba) => fizickaOsoba.eko_par_id_za === pravnaOsoba.epr_id) as typeof this.fizickeOsobe || []
                    };
                });

                // console.log("PRAVNE I FIZICKE OSOBE: ", this.pravneOsobe, this.fizickeOsobe);
            } catch (error) {
                // console.error('Error fetching osobe:', error);
            }
        },
        async fetchPravneOsobe(): Promise<void> {
            try {
                this.pravneOsobe = await getPravneOsobe();

                this.pravneOsobe = this.pravneOsobe.map((pravnaOsoba) => {
                    return {
                        ...pravnaOsoba,
                        users: []
                    };
                });
            } catch (error) {
                // console.error('Error fetching pravne osobe:', error);
            }
        },
        async fetchFizickeOsobe(): Promise<void> {
            try {
                this.searchFizickeOsobe = await getFizickeOsobe();
            } catch (error) {
                // console.error('Error fetching fizicke osobe:', error);
            }
        },
        async fetchKorisniciForLegalPartner(id: string | number): Promise<void> {
            try {
                const data = await getUsersForLegalPartner(id);
                // console.log("data: ", data);

                if (data?.status === 404) {
                    return {
                        message: data?.response?.data?.message || 'Not found'
                    };
                }
                if (!Array.isArray(data)) {
                    console.warn(`Neispravan format podataka za pravnu osobu ${id}.`);
                    return;
                }

                // Mapiranje dohvaćenih korisnika na fizickeOsobe pod ključem id-ja pravne osobe
                this.fizickeOsobe = {
                    ...this.fizickeOsobe,
                    [id]: data
                };

                // Ažuriranje pravneOsobe tako da se zamijeni postojeći users niz s novim podacima
                this.pravneOsobe = this.pravneOsobe.map(pravnaOsoba => {
                    if (pravnaOsoba?.epr_id === id) {
                        return {
                            ...pravnaOsoba,
                            users: data  // zamijenite umjesto spajanja nizova
                        };
                    }
                    return pravnaOsoba;
                });
            } catch (error) {
                // Error handling
                return;
            }
        },
        async fetchUgovori(id): Promise<void> {
            try {
                this.ugovori = await getContracts(id);
            } catch (error) {
                // console.error('Error fetching ugovori:', error);
                return error?.message
            }
        },
    }
})