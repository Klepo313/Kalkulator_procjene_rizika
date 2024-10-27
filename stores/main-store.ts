// stores/main-store.ts
import { defineStore } from 'pinia';
import { getCalculationTypes } from '@/service/fetchCalculationTypes'
import { getObjectTypes } from '~/service/fetchObjectTypes';
import { getActivities } from '~/service/fetchActivities';
import { getMunicipalities } from '~/service/fetchMunicipalities';
import { getParticlesForMunicipalities } from '~/service/fetchParticlesForMunicipalities';
import { getCalculation } from '~/service/fetchCalculation';
import { getMetricTypes } from '~/service/fetchMetrictypes';
import { saveForm } from '~/service/saveForm';
import { addMetricType, removeMetricType } from '~/service/alterMetrictypes';
import { getHeader } from '~/service/kesp/fetchHeader';

import { getCookie, setCookie, deleteCookie } from '#imports';
import { getEmmisionGroups, getFuelTypes, getVehicles, getVehiclesForEmmisionGroups } from '~/service/kesp/fetchVoziloData';
import { getEnergySources } from '~/service/kesp/fetchOpseg2';
import { postHeader, updateEnergyItem } from '~/service/kesp/postRequests';
import { getKespCalculations } from '~/service/kesp/fetchKespCalculations';

//import { formatDateToISO } from '~/utils/dateFormatter';

export const useIzracunStore = defineStore('izracun-store', {
    state: () => ({
        idIzracuna: '',
        vrstaIzracuna: '',
        scenarij: '',
    }),
    actions: {
        updateIdIzracuna(newValue: string) {
            this.idIzracuna = newValue;
            setCookie({ name: 'id-izracuna', value: newValue });
        },
        updateVrstaIzracuna(newValue: string) {
            this.vrstaIzracuna = newValue;
            setCookie({ name: 'vrsta-izracuna', value: newValue });
        },
        updateScenarij(newValue: string) {
            this.scenarij = newValue;
            setCookie({ name: 'scenarij', value: newValue });
        },
        updateAll(newValue: { idIzracuna: number, vrstaIzracuna: string, scenarij: string }) {
            this.idIzracuna = newValue.idIzracuna;
            this.vrstaIzracuna = newValue.vrstaIzracuna;
            this.scenarij = newValue.scenarij;
            setCookie([
                { name: 'id-izracuna', value: newValue.idIzracuna },
                { name: 'vrsta-izracuna', value: newValue.vrstaIzracuna },
                { name: 'scenarij', value: newValue.scenarij },
            ])

        },
        async initializeIzracun() {
            const response = await getCookie(
                ['id-izracuna', 'vrsta-izracuna', 'scenarij']
            );
            this.idIzracuna = response['id-izracuna'] || 0;
            this.vrstaIzracuna = response['vrsta-izracuna'] || '';
            this.scenarij = response['scenarij'] || '';
        },
        clearStore() {
            deleteCookie(['id-izracuna', 'vrsta-izracuna', 'scenarij']);
            this.idIzracuna = 0;
            this.vrstaIzracuna = '';
            this.scenarij = '';
        }
    }
})

export const useUserStore = defineStore('user-store', {
    state: () => ({
        name: '',
        surname: '',
        username: '',
        email: '',
        roles: []
    }),
    actions: {
        updateName(newValue: string) {
            this.name = newValue;
            setCookie({ name: 'name', value: newValue });
        },
        updateSurname(newValue: string) {
            this.surname = newValue;
            setCookie({ name: 'surname', value: newValue });
        },
        updateUsername(newValue: string) {
            this.username = newValue;
            setCookie({ name: 'username', value: newValue });
        },
        updateEmail(newValue: string) {
            this.email = newValue;
            if (newValue) setCookie({ name: 'email', value: newValue });
        },
        updateRoles(newValue: any) {
            this.roles = newValue;
            setCookie({ name: 'roles', value: newValue });
        },
        updateAll(newValue: { name: string, surname: string, username: string, roles: any }) {
            this.name = newValue.name;
            this.surname = newValue.surname;
            this.username = newValue.username;
            this.roles = newValue.roles;
            // this.email = newValue.email;
            setCookie([
                { name: 'name', value: newValue.name },
                { name: 'surname', value: newValue.surname },
                { name: 'username', value: newValue.username },
                { name: 'roles', value: newValue.roles },
                // { name: 'email', value: newValue.email },
            ])
        },
        async initializeUser() {
            const response = await getCookie(['name', 'surname', 'username', 'email', 'roles']);
            this.name = response['name'] || '';
            this.surname = response['surname'] || '';
            this.username = response['username'] || '';
            this.email = response['email'] || null;
            this.roles = response['roles'] || [];
        },
        clearStore() {
            deleteCookie(['name', 'surname', 'username', 'email', 'roles']);
            this.name = '';
            this.surname = '';
            this.username = '';
            this.email = '';
            this.roles = [];
        }
    },
    getters: {
        getName: async (state) => {
            if (state.name) return state.name;
            const res = await getCookie('name');
            return res['name'] || '';
        },
        getSurname: async (state) => {
            if (state.surname) return state.surname;
            const res = await getCookie('surname');
            return res['surname'] || '';
        },
        getUsername: async (state) => {
            if (state.username) return state.username;
            const res = await getCookie('username');
            return res['username'] || '';
        },
        getEmail: async (state) => {
            if (state.email) return state.email;
            const res = await getCookie('email');
            return res['email'] || null;
        },
        getAll: async (state) => {
            if (state.name && state.surname && state.username && state.roles) return {
                name: state.name,
                surname: state.surname,
                username: state.username,
                email: state.email,
                roles: state.roles
            };
            const response = await getCookie(['name', 'surname', 'username', 'email', 'roles']);
            return {
                name: response['name'] || '',
                surname: response['surname'] || '',
                username: response['username'] || '',
                email: response['email'] || null,
                roles: response['roles'] || []
            };
        }
    }
});

export const useOpciStore = defineStore('opci-podaci', {
    state: () => ({
        opci_podaci: {
            aiz_datum: "",

            aiz_djl_id: 0,

            aiz_djl_id_sk: 0,

            aiz_id: 0,

            aiz_kcs_id: 0,

            aiz_kop_id: 0,

            aiz_status: 0,

            aiz_tvo_id: 0,

            aiz_tvz_id: 0,

            aiz_opis: '',

            aiz_napomena: '',

            djl_naziv: "",

            djl_naziv_sk: "",

            djl_sif: "",

            isp_naziv: "",

            kcs_sif: "",

            kop_naziv: "",

            kop_sif: "",

            puk_naziv: "",

            tvo_naziv: "",

            tvz_naziv: "",
        },

        vrste_izracuna: [],

        katastarske_opcine: [],

        katastarske_cestice: [],

        vrste_objekta: [],

        djelatnosti: [],

        skupina_djelatnosti: []

    }),
    actions: {
        clearOpciPodaci() {
            this.opci_podaci.aiz_datum = '';
            this.opci_podaci.aiz_djl_id = 0;
            this.opci_podaci.aiz_djl_id_sk = 0;
            this.opci_podaci.aiz_id = 0;
            this.opci_podaci.aiz_kcs_id = 0;
            this.opci_podaci.aiz_kop_id = 0;
            this.opci_podaci.aiz_status = 0;
            this.opci_podaci.aiz_tvo_id = 0;
            this.opci_podaci.aiz_tvz_id = 0;
            this.opci_podaci.aiz_opis = '';
            this.opci_podaci.aiz_napomena = '';
            this.opci_podaci.djl_naziv = '';
            this.opci_podaci.djl_naziv_sk = '';
            this.opci_podaci.djl_sif = '';
            this.opci_podaci.isp_naziv = '';
            this.opci_podaci.kcs_sif = '';
            this.opci_podaci.kop_naziv = '';
            this.opci_podaci.kop_sif = '';
            this.opci_podaci.puk_naziv = '';
            this.opci_podaci.tvo_naziv = '';
            this.opci_podaci.tvz_naziv = '';
        },

        async fetchCalculationTypes() {
            const items = await getCalculationTypes();

            if (items?.status == 200) {
                this.vrste_izracuna = items.data;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchCalculation(id: number) {
            const items = await getCalculation(id);
            if (items?.status == 200 && items.data) {
                const data = items.data[0];
                this.opci_podaci.aiz_datum = data.aiz_datum || this.opci_podaci.aiz_datum;
                this.opci_podaci.aiz_djl_id = data.aiz_djl_id || this.opci_podaci.aiz_djl_id;
                this.opci_podaci.aiz_djl_id_sk = data.aiz_djl_id_sk || this.opci_podaci.aiz_djl_id_sk;
                this.opci_podaci.aiz_id = data.aiz_id || this.opci_podaci.aiz_id;
                this.opci_podaci.aiz_kcs_id = data.aiz_kcs_id || this.opci_podaci.aiz_kcs_id;
                this.opci_podaci.aiz_kop_id = data.aiz_kop_id || this.opci_podaci.aiz_kop_id;
                this.opci_podaci.aiz_status = data.aiz_status || this.opci_podaci.aiz_status;
                this.opci_podaci.aiz_tvo_id = data.aiz_tvo_id || this.opci_podaci.aiz_tvo_id;
                this.opci_podaci.aiz_tvz_id = data.aiz_tvz_id || this.opci_podaci.aiz_tvz_id;
                this.opci_podaci.aiz_opis = data.aiz_opis || this.opci_podaci.aiz_opis;
                this.opci_podaci.aiz_napomena = data.aiz_napomena || this.opci_podaci.aiz_napomena;
                this.opci_podaci.djl_naziv = data.djl_naziv || this.opci_podaci.djl_naziv;
                this.opci_podaci.djl_naziv_sk = data.djl_naziv_sk || this.opci_podaci.djl_naziv_sk;
                this.opci_podaci.djl_sif = data.djl_sif || this.opci_podaci.djl_sif;
                this.opci_podaci.isp_naziv = data.isp_naziv || this.opci_podaci.isp_naziv;
                this.opci_podaci.kcs_sif = data.kcs_sif || this.opci_podaci.kcs_sif;
                this.opci_podaci.kop_naziv = data.kop_naziv || this.opci_podaci.kop_naziv;
                this.opci_podaci.kop_sif = data.kop_sif || this.opci_podaci.kop_sif;
                this.opci_podaci.puk_naziv = data.puk_naziv || this.opci_podaci.puk_naziv;
                this.opci_podaci.tvo_naziv = data.tvo_naziv || this.opci_podaci.tvo_naziv;
                this.opci_podaci.tvz_naziv = data.tvz_naziv || this.opci_podaci.tvz_naziv;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchObjectTypes() {
            const items = await getObjectTypes();

            if (items?.status == 200) {
                this.vrste_objekta = items.data;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchActivities() {
            const items = await getActivities();

            if (items?.status == 200) {
                this.djelatnosti = items.data;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchMunicipalities() {
            const items = await getMunicipalities();

            if (items?.status == 200) {
                this.katastarske_opcine = items.data;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        // async fetchParticlesForMunicipalities(id: number) {
        //     const items = await getParticlesForMunicipalities(id);

        //     if (items?.status == 200) {
        //         if (items?.data.message) {
        //             return items.data.message;
        //         } else {
        //             this.katastarske_cestice = items.data;
        //         }
        //     } else {
        //         console.error('Error fetching calculation types:', items?.status);
        //     }
        // },
        async fetchParticlesForMunicipalities(id: number) {
            try {
                const items = await getParticlesForMunicipalities(id);

                console.log("status: " + items?.status);
                console.log("items: ", items?.data)

                if (items?.status == 200) {
                    if (items?.data.message) {
                        console.log("Postoji poruka");
                        return { message: items.data.message };
                    } else {
                        console.log("Nema poruke");
                        this.katastarske_cestice = items.data;
                        return { particles: items.data };
                    }
                } else {
                    console.error('Error fetching calculation types:', items?.status);
                    return { message: 'Greška pri dohvaćanju podataka' }; // Vraćamo poruku o grešci
                }
            } catch (error) {
                console.error('Error fetching particles:', error);
                return { message: 'Došlo je do greške prilikom dohvaćanja podataka' };
            }
        },
        async saveData() {

            console.log("Prije savea: ",
                this.opci_podaci.aiz_id === 0 ? null : this.opci_podaci.aiz_id,
                this.opci_podaci.aiz_datum,
                this.opci_podaci.aiz_tvz_id,
                this.opci_podaci.aiz_kop_id,
                this.opci_podaci.aiz_kcs_id === 0 || this.opci_podaci.aiz_kcs_id == undefined ? null : this.opci_podaci.aiz_kcs_id,
                this.opci_podaci.aiz_tvo_id === 0 ? null : this.opci_podaci.aiz_tvo_id,
                this.opci_podaci.aiz_djl_id === 0 ? null : this.opci_podaci.aiz_djl_id,
                this.opci_podaci.aiz_opis === '' || this.opci_podaci.aiz_opis === undefined ? null : this.opci_podaci.aiz_opis,
                this.opci_podaci.aiz_napomena === '' ? null : this.opci_podaci.aiz_napomena
            )

            const response = await saveForm(
                this.opci_podaci.aiz_id === 0 ? null : this.opci_podaci.aiz_id,
                this.opci_podaci.aiz_datum,
                this.opci_podaci.aiz_tvz_id,
                this.opci_podaci.aiz_kop_id,
                this.opci_podaci.aiz_kcs_id === 0 || this.opci_podaci.aiz_kcs_id == undefined ? null : this.opci_podaci.aiz_kcs_id,
                this.opci_podaci.aiz_tvo_id === 0 ? null : this.opci_podaci.aiz_tvo_id,
                this.opci_podaci.aiz_djl_id === 0 ? null : this.opci_podaci.aiz_djl_id,
                this.opci_podaci.aiz_opis === '' || this.opci_podaci.aiz_opis === undefined ? null : this.opci_podaci.aiz_opis,
                this.opci_podaci.aiz_napomena === '' ? null : this.opci_podaci.aiz_napomena
            )

            console.log("Response savea: ", response)
            return response;
        }

    },
});

export const useAdaptStore = defineStore('adaptacijske-mjere', {
    state: () => ({
        odabrane_mjere: [],
        adaptacijske_mjere: []
    }),
    actions: {
        async fetchMetrictypes(id: number) {
            const items = await getMetricTypes(id);

            if (items?.status == 200) {
                if (id) {
                    if (!items.data.message) {
                        this.odabrane_mjere = items.data
                        console.log("odabrane: ", this.odabrane_mjere)
                    }
                } else {
                    console.log("sve: ", items.data)
                    this.adaptacijske_mjere = items.data
                }
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
        async addMetrictype(calculationId: number, metricTypeId: number) {
            const status = await addMetricType(calculationId, metricTypeId);
            return status;
        },
        async deleteMetrictype(calculationId: number, metricTypeId: number) {
            const status = await removeMetricType(calculationId, metricTypeId);
            return status;
        }
    },
});

export const useStructuredGridDataStore = defineStore('structured-grid-data', {
    state: () => ({
        structuredDataBezMjera: {},
        structuredDataSaMjerama: {}
    }),
    actions: {
        setStructuredDataBezMjera(data: object) {
            this.structuredDataBezMjera = data
        },
        setStructuredDataSaMjerama(data: object) {
            this.structuredDataSaMjerama = data
        },
        clearStructureDataBezMjera() {
            this.structuredDataBezMjera = {}
        },
        clearStructureDataSaMjerama() {
            this.structuredDataSaMjerama = {}
        }
    },
});

export const useKespStore = defineStore('kespStore', {
    state: () => ({
        predlosci: [],
        naziv: '',
        napomena: '',
        godina: new Date(2022, 0, 1),
        datumOd: new Date(2022, 0, 1), // January 1st, 2022
        datumDo: new Date(2022, 11, 31), // December 31st, 2022
    }),
    actions: {
        async fetchPredlosci() {
            try {
                const data = await getKespCalculations();
                if (data) {
                    if (data.message) {
                        this.predlosci = [];
                    } else {
                        this.predlosci = data;
                    }
                } else {
                    this.predlosci = [];
                    console.log('Error fetching calculations:', data);
                }

            } catch (error) {
                console.error('Error fetching calculations:', error);
            }
        },
        async addPredlozak(header) {
            try {
                const response = await postHeader(header);
                const { id, status } = response;

                if (status === 200) {
                    const kespId = parseInt(id);
                    if (kespId && !isNaN(kespId)) {
                        // Kreiraj novi objekt u traženoj strukturi
                        const newPredlozak = {
                            uiz_id: kespId,
                            uiz_datum: header.l_datum,
                            uiz_datod: header.l_datod,
                            uiz_datdo: header.l_datdo,
                            uiz_opis: header.l_opis,
                            uiz_napomena: header.l_napomena
                        };

                        // Dodaj u predloške
                        await setCookie({ name: 'kesp-id', value: kespId });
                        this.predlosci.push(newPredlozak);
                    } else {
                        console.log("Kesp ID nije validan.");
                    }

                    return 1;
                } else {
                    console.log("Greška pri dodavanju izračuna.");
                    return 0;
                }

            } catch (error) {
                console.log("Greška pri dodavanju izračuna.", error);
                return 0;
            }
        },

        setGodina(godina: number) {
            this.godina = new Date(godina, 0, 1);
            this.setDatumOd(godina);
            this.setDatumDo(godina);
        },
        setDatumOd(godina: number) {
            this.datumOd = new Date(godina, 0, 1); // January 1st
        },
        setDatumDo(godina: number) {
            this.datumDo = new Date(godina, 11, 31); // December 31st
        },
        async fetchHeader(id: number) {
            console.log("id: ", id)
            try {
                const response = await getHeader(id);
                if (response) {
                    this.naziv = response.uiz_opis;
                    this.napomena = response.uiz_napomena || '';
                    this.datumOd = response.uiz_datod;
                    this.datumDo = response.uiz_datdo;
                }
                return response;
            } catch (error) {
                console.error('Error fetching header:', error);
            }
        },
        clearStore() {
            this.naziv = '';
            this.napomena = '';
            this.godina = new Date(2022, 0, 1);
            this.datumOd = new Date(2022, 0, 1);
            this.datumDo = new Date(2022, 11, 31);
        }
    },
    getters: {
        getGodina: (state) => state.godina,
        getDatumOd: (state) => state.datumOd,
        getDatumDo: (state) => state.datumDo,
    }
});

export const useVehicleStore = defineStore('vehicleStore', {
    // State: definisanje početnog stanja
    state: () => ({
        vozila: [],
        vrsteVozila: [],
        vrsteGoriva: [],
        filteredVrsteGoriva: [],
        vozilo: {
            id: null,
            uiz_id: null,
            uge_id: null,
            vozilo: {
                id: null,
                skupina: '',
                vrsta: ''
            },
            gorivo: {
                id: null,
                uvg_id: null,
                label: '',
                value: '',
                metric: '',
            },
            potrosnjaGoriva: 0.00,
            emisije: 0.00
        },
        voziloDialogVisible: false,
        deleteVoziloDialog: false,
    }),

    // Getters: za obračunate vrednosti
    getters: {
        totalEmissionsFromVehicles(state) {
            return state.vozila.reduce((total, v) => total + v.emisije, 0);
        },
    },

    // Actions: za funkcije koje manipulišu stanjem
    actions: {
        async fetchVehicles(id: number) {
            const vozila = await getVehicles(id);

            if (!vozila.message) {
                for (const vozilo of vozila) {
                    this.vozila.push({
                        id: parseInt(vozilo.usi_id),
                        uiz_id: parseInt(vozilo.usi_uiz_id),
                        uge_id: parseInt(vozilo.usi_uge_id),
                        vozilo: {
                            id: vozilo.usi_uvv_id,
                            skupina: vozilo.uge_naziv,
                            vrsta: vozilo.usi_uvv_naziv
                        },
                        gorivo: {
                            id: vozilo.usi_uvg_id,
                            label: vozilo.uvg_knaziv,
                            value: vozilo.uvg_naziv,
                            metric: vozilo.usi_jmj,
                        },
                        potrosnjaGoriva: parseFloat(vozilo.usi_kolicina),
                        emisije: parseFloat(vozilo.usi_emisija)
                    })
                    // vozilo: {
                    //     id: null,
                    //     uiz_id: null,
                    //     uge_id: null,
                    //     vozilo: {
                    //         uvv_id: null,
                    //         skupina: '',
                    //         vrsta: ''
                    //     },
                    //     gorivo: {
                    //         id: null,
                    //         uvg_id: null,
                    //         label: '',
                    //         value: '',
                    //         metric: '',
                    //     },
                    //     potrosnjaGoriva: 0.00,
                    //     emisije: 0.00
                    // },
                }
            } else {
                this.vozila = [];
                console.log("Nema vozila");
            }
        },
        async fetchEmissions() {
            const vrste_vozila = await getEmmisionGroups();

            // Iteriramo kroz vrste vozila i dohvacamo kategorije
            for (const vrsta of vrste_vozila) {
                const cats = await getVehiclesForEmmisionGroups(parseInt(vrsta.uge_id));

                // Provjera da li je cats niz ili objekt sa porukom
                if (Array.isArray(cats)) {
                    // Ako je cats niz, mapiramo children
                    this.vrsteVozila.push({
                        id: parseInt(vrsta.uge_id),
                        label: vrsta.uge_sif,
                        value: vrsta.uge_naziv,
                        children: cats.map(cat => {
                            // Kreiramo kratku kraticu od dva slova (prvo slovo svake od prve dvije riječi)
                            const kratica = cat.uvv_naziv.split(' ').slice(0, 2).map(word => word[0]).join('');

                            return {
                                id: parseInt(cat.uvv_id),
                                label: kratica.toUpperCase(), // Kratica dvoslovna u velikim slovima
                                value: cat.uvv_naziv
                            };
                        })
                    });
                } else {
                    // Ako nije niz, postavljamo prazan children niz
                    this.vrsteVozila.push({
                        id: parseInt(vrsta.uge_id),
                        label: vrsta.uge_sif,
                        value: vrsta.uge_naziv,
                        children: [] // Prazan niz kada nema children
                    });
                }
            }
        },
        async fetchFuels() {
            const goriva = await getFuelTypes();

            for (const gorivo of goriva) {
                this.vrsteGoriva.push({
                    id: parseInt(gorivo.ufe_id),
                    uvg_id: parseInt(gorivo.uvg_id),
                    uge_id: parseInt(gorivo.ufe_uge_id),
                    label: gorivo.uvg_knaziv,
                    value: gorivo.uvg_naziv,
                    metric: gorivo.uvg_jedmj,
                    koeficijent: parseFloat(gorivo.uvg_koefco2)
                })
            }

            console.log("goriva: ", this.vrsteGoriva)
        },
        resetData() {
            this.vozila = [];
            this.vrsteVozila = [];
            this.vrsteGoriva = [];
        },

        resetVoziloForm() {
            this.vozilo = {
                id: null,
                uiz_id: null,
                uge_id: null,
                vozilo: {
                    id: null,
                    skupina: '',
                    vrsta: ''
                },
                gorivo: {
                    id: null,
                    label: '',
                    value: '',
                    metric: '',
                },
                potrosnjaGoriva: '',
                emisije: ''
            };
        },
    },
});

export const useIzvoriStore = defineStore('izvori-store', {
    state: () => ({
        izvori: [
            {
                id: 1,
                vrstaGoriva: 'Plinski bojler',
                vrstaEnergenata: {
                    label: 'Plin',
                    value: 'Prirodni plin',
                    metric: 'm³',
                    koeficijent: 1.6
                },
                potrosnjaEnergenata: 1200,
                emisije: 154.8
            },
            {
                id: 2,
                vrstaGoriva: 'Termogen',
                vrstaEnergenata: {
                    label: 'Ulje',
                    value: 'Loživo ulje',
                    metric: 'L',
                    koeficijent: 2.6
                },
                potrosnjaEnergenata: 800,
                emisije: 103.2
            }
        ],
        izvor: {
            id: null,
            vrstaGoriva: '',
            vrstaEnergenata: { value: '', metric: '' },
            potrosnjaEnergenata: null,
            emisije: null,
        },
        vrsteEnergenata: [
            { label: 'Plin', value: 'Prirodni plin', metric: 'm³', koeficijent: 1.6 },
            { label: 'Ulje', value: 'Loživo ulje', metric: 'L', koeficijent: 2.6 },
            { label: 'UNP', value: 'UNP', metric: 'L', koeficijent: 3.6 },
        ]
    }),
    actions: {
        resetIzvorForm() {
            this.izvor = {
                id: null,
                vrstaGoriva: '',
                vrstaEnergenata: { value: '', metric: '' },
                potrosnjaEnergenata: null,
                emisije: null
            }
        },
    },
})

export const useOpseg2Store = defineStore('opseg2-store', {
    state: () => ({
        izracuni: []
    }),
    actions: {
        async fetchEnergySources(id: number) {
            try {
                const energySources = await getEnergySources(id);
                for (const source of energySources) {
                    this.izracuni.push({
                        id: parseInt(source.use_id) || null,
                        uiz_id: parseInt(source.use_uiz_id) || null,
                        uvn_id: parseInt(source.use_uvn_id) || null,
                        energija: source.uvn_naziv || '',
                        neobnovljivo: Number(source.use_neobnovljivo) || null,
                        obnovljivo: Number(source.use_obnovljivo) || null,
                        ukupno: Number(source.use_ukupno) || 0.00,
                        emisije: parseFloat(source.use_emisija) || 0.00,
                        koeficijent: source.use_uvn_id == 76 ? 0.288 : 0.133
                    });
                }
            } catch (error) {
                console.error('Error fetching energy sources:', error);
            }
        },
        clearStore() {
            this.izracuni = [];
        },
        updateCalculations(rowData) {
            const neobnovljivo = Number(rowData.neobnovljivo) || 0;
            const obnovljivo = Number(rowData.obnovljivo) || 0;
            rowData.ukupno = neobnovljivo + obnovljivo;
            rowData.emisije = rowData.ukupno * rowData.koeficijent;

            console.log(" rowData: ", rowData)
        },
        async onCellEditComplete(event) {
            const { data, newValue, field } = event;
            const parsedValue = Number(newValue);

            console.log("data: ", data, "newValue: ", newValue, "field: ", field, "parsedValue: ", parsedValue);

            data[field] = parsedValue;

            if (field === 'neobnovljivo' || field === 'obnovljivo') {
                if (this.isPositiveInteger(parsedValue)) {
                    const energyItem = {
                        p_use_id: data.id,
                        p_uiz_id: data.uiz_id,
                        p_uvn_id: data.uvn_id,
                        p_neobnovljivo: data.neobnovljivo || 0,
                        p_obnovljivo: data.obnovljivo || 0
                    }

                    console.log("energyItem: ", energyItem)

                    try {
                        const response = await updateEnergyItem(energyItem);

                        const { id, status } = response;

                        if (status === 200) {
                            const use_id = parseInt(id);
                            console.log(`Energy item updated with ID: ${use_id}`);

                            this.updateCalculations(data);
                            return status;
                        } else {
                            console.error(`Failed to update energy item with ID: ${id}`);
                            return;
                        }
                    } catch (error) {
                        console.error('Error updating energy item:', error);
                        return;
                    }
                } else {
                    event.preventDefault();
                }
            } else {
                if (String(newValue).trim().length > 0) {
                    data[field] = newValue;
                    this.updateCalculations(data);
                } else {
                    event.preventDefault();
                }
            }

            /*
            const energyItem = {
                p_use_id: rowData.id,
                p_uiz_id: rowData.uiz_id,
                p_uvn_id: rowData.uvn_id,
                p_neobnovljivo: neobnovljivo,
                p_obnovljivo: obnovljivo
            }

            try {
                const response = await updateEnergyItem(energyItem);

                const { id, status } = response;

                if (status === 200) {
                    const use_id = parseInt(id);
                    console.log(`Energy item updated with ID: ${use_id}`);

                   
                } else {
                    console.error(`Failed to update energy item with ID: ${id}`);
                    return;
                }

            } catch (error) {
                console.error('Error updating energy item:', error);
                return;
            }
            
            */
        },
        isPositiveInteger(val) {
            return Number.isInteger(val) && val > 0;
        }
    },

    getters: {
        yearOptions() {
            const years = [];
            for (let year = 2015; year < new Date().getFullYear(); year++) {
                years.push({ year });
            }
            return years;
        },

        totalEmissions() {
            return this.izracuni.reduce((total: number, row: { emisije: number; }) => total + row.emisije, 0).toFixed(2);
        },

        combinedChartData() {
            const hasData = this.izracuni.some(row => row.neobnovljivo !== null || row.obnovljivo !== null);
            const labels = this.izracuni.map((row: { energija: number; }) => row.energija);
            const data = this.izracuni.map((row: { emisije: number; }) => row.emisije);

            if (!hasData) {
                return {
                    labels,
                    datasets: [
                        {
                            data: [0, 0], // Prikazuje [0, 0] kada nema podataka
                            backgroundColor: ['#241147', '#2f185c'], // Zeleno za električnu energiju, žuto za toplinsku
                            hoverBackgroundColor: ['#241147', '#2f185c']
                        }
                    ]
                };
            }

            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#241147', '#2f185c'], // Zeleno za električnu energiju, žuto za toplinsku
                        hoverBackgroundColor: ['#241147', '#2f185c']
                    }
                ]
            };
        }
    }
});