// stores/main-store.ts
import { defineStore } from 'pinia';
import { getCookie, setCookie, deleteCookie } from '~/service/user/cookies';

// KPKR
import {
    getCalculationTypes,
    getObjectTypes,
    getActivities,
    getParticlesForMunicipalities,
    getMunicipalities,
    getScenarios,
    saveForm
} from '~/service/kpkr/form';
import {
    getCalculations
} from '~/service/kpkr/calculations';
import {
    addMetricType,
    removeMetricType,
    getMetricTypes
} from '~/service/kpkr/metric_types'

// KESP
import {
    getCoolingLossesHeader,
    getHeader
} from '~/service/kesp/fetchHeader';
import {
    getCoolingCalculation,
    getEmmisionGroups,
    getFuel,
    getFuelTypes,
    getVehicles,
    getVehiclesForEmmisionGroups
} from '~/service/kesp/fetchVoziloData';
import {
    getEnergySources
} from '~/service/kesp/fetchOpseg2';
import {
    postHeader,
    updateEnergyItem
} from '~/service/kesp/postRequests';
import {
    getKespCalculations
} from '~/service/kesp/fetchKespCalculations';
import { mapByMatch } from '~/utils/dataFormatter';


export const useUserStore = defineStore('user-store', {
    state: () => ({
        isLoggedin: null,
        name: '',
        surname: '',
        username: '',
        email: '',
        roles: []
    }),
    actions: {
        async updateName(newValue: string) {
            this.name = newValue;
            await setCookie({ name: 'name', value: newValue });
        },
        async updateSurname(newValue: string) {
            this.surname = newValue;
            await setCookie({ name: 'surname', value: newValue });
        },
        async updateUsername(newValue: string) {
            this.username = newValue;
            await setCookie({ name: 'username', value: newValue });
        },
        async updateEmail(newValue: string) {
            this.email = newValue;
            if (newValue) await setCookie({ name: 'email', value: newValue });
        },
        async updateRoles(newValue: any) {
            this.roles = newValue;
            await setCookie({ name: 'roles', value: newValue });
        },
        async updateAll(newValue: { name: string, surname: string, username: string, email: string, roles: any }) {
            this.name = newValue.name;
            this.surname = newValue.surname;
            this.username = newValue.username;
            // Ako je newValue.email valjani string (nije null i nije prazan) postavi email, inače postavi prazan string
            this.email = newValue.email && newValue.email.trim() !== '' ? newValue.email : '';
            this.roles = newValue.roles;

            // Pripremamo niz kolačića, a email dodajemo samo ako je valjani string
            const cookies = [
                { name: 'name', value: newValue.name },
                { name: 'surname', value: newValue.surname },
                { name: 'username', value: newValue.username },
                ...(newValue.email && newValue.email.trim() !== '' ? [{ name: 'email', value: newValue.email }] : []),
                { name: 'roles', value: newValue.roles },
            ];

            await setCookie(cookies);
        },
        async initializeUser() {
            const response = await getCookie(['name', 'surname', 'username', 'email', 'roles']);
            this.name = response['name'] || '';
            this.surname = response['surname'] || '';
            this.username = response['username'] || '';
            this.email = response['email'] || null;
            this.roles = response['roles'] || [];
        },
        async clearStore() {
            await deleteCookie(['name', 'surname', 'username', 'email', 'roles']);
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
        getRoles: async (state) => {
            if (state.roles) return state.roles;
            const res = await getCookie('roles');
            return res['roles'] || [];
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
        izracun: [],
        vrste_izracuna: [],
        katastarske_opcine: [],
        katastarske_cestice: [],
        vrste_objekta: [],
        djelatnosti: [],
        skupina_djelatnosti: [],
        scenariji: [],
    }),
    actions: {
        async fetchCalculationTypes() {
            const items = await getCalculationTypes();

            if (items?.status == 200) {
                this.vrste_izracuna = items.data;
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchCalculation(id: string) {
            const items = await getCalculations(id);
            if (items?.status == 200 && items.data) {
                const data = items.data[0];
                this.izracun = data;
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
            // console.log("EKV: ", this.opci_podaci)
        },
        async fetchObjectTypes() {
            const items = await getObjectTypes();

            if (items?.status == 200) {
                this.vrste_objekta = items.data;
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchActivities() {
            const items = await getActivities();

            if (items?.status == 200) {
                this.djelatnosti = items.data;
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchMunicipalities() {
            const items = await getMunicipalities();

            if (items?.status == 200) {
                this.katastarske_opcine = items.data;
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
        },
        async fetchScenarios() {
            const items = await getScenarios();

            if (items?.status == 200) {
                this.scenariji = items.data;
            } else {
                // console.error('Error fetching scenarios: ', items?.status);
            }
        },
        async fetchParticlesForMunicipalities(id: number) {
            try {
                const items = await getParticlesForMunicipalities(id);

                // console.log("status: " + items?.status);
                // console.log("items: ", items?.data)

                if (items?.status == 200) {
                    if (items?.data.message) {
                        // console.log("Postoji poruka");
                        return { message: items.data.message };
                    } else {
                        // console.log("Nema poruke");
                        this.katastarske_cestice = items.data;
                        return { particles: items.data };
                    }
                } else {
                    // console.error('Error fetching calculation types:', items?.status);
                    return { message: 'Greška pri dohvaćanju podataka' }; // Vraćamo poruku o grešci
                }
            } catch (error) {
                // console.error('Error fetching particles:', error);
                return { message: 'Došlo je do greške prilikom dohvaćanja podataka' };
            }
        },
        async saveData() {
            const data = {
                aiz_id: this.izracun.aiz_id === '' ? null : this.izracun.aiz_id,
                aiz_datum: formatDateToDMY(this.izracun.aiz_datum, '-'),
                aiz_tvz_id: this.izracun.aiz_tvz_id,
                aiz_kop_id: this.izracun.aiz_kop_id,
                aiz_kcs_id: this.izracun.aiz_kcs_id === 0 || this.izracun.aiz_kcs_id == undefined ? null : this.izracun.aiz_kcs_id,
                aiz_tvo_id: this.izracun.aiz_tvo_id === 0 ? null : this.izracun.aiz_tvo_id,
                aiz_djl_id: this.izracun.aiz_djl_id === 0 ? null : this.izracun.aiz_djl_id,
                aiz_opis: this.izracun.aiz_opis === '' || this.izracun.aiz_opis === undefined ? null : this.izracun.aiz_opis,
                aiz_napomena: this.izracun.aiz_napomena === '' ? null : this.izracun.aiz_napomena,
                tvs_id: this.izracun.tvs_id === 0 ? null : this.izracun.tvs_id
            }

            // console.log("Prije savea: ", data);

            const response = await saveForm(data)

            // console.log("Response savea: ", response.data)
            // console.log("Res-id-response: ", response.data.calculationId)
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
        async fetchMetrictypes(id: string) {
            const items = await getMetricTypes(id);

            if (items?.status == 200) {
                if (id) {
                    if (!items.data.message) {
                        this.odabrane_mjere = items.data
                        // console.log("odabrane: ", this.odabrane_mjere)
                    }
                } else {
                    // console.log("sve: ", items.data)
                    this.adaptacijske_mjere = items.data
                }
            } else {
                // console.error('Error fetching calculation types:', items?.status);
            }
        },
        async addMetrictype(calculationId: string, metricTypeId: number) {
            const status = await addMetricType(calculationId, metricTypeId);
            return status;
        },
        async deleteMetrictype(calculationId: string, metricTypeId: number) {
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
        kespId: null,
        kespBrojIzracuna: null,
        predlosci: [],
        gwpPredlosci: [],
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
                    // console.log('Error fetching calculations:', data);
                }

            } catch (error) {
                // console.error('Error fetching calculations:', error);
            }
        },
        async addPredlozak(header) {
            try {
                const response = await postHeader(header);
                const { id, status } = response;

                if (status === 200) {
                    const kespId = id;
                    // console.log("Kesp ID u store: ", kespId);
                    if (kespId) {
                        // Kreiraj novi objekt u traženoj strukturi
                        const newPredlozak = {
                            uiz_id: kespId,
                            uiz_datum: header.l_datum,
                            uiz_datod: header.l_datod,
                            uiz_datdo: header.l_datdo,
                            uiz_opis: header.l_opis,
                            uiz_napomena: header.l_napomena
                        };
                        this.setKespId(kespId)
                        this.predlosci.push(newPredlozak);
                    } else {
                        // console.log("Kesp ID nije validan.");
                    }

                    return kespId;
                } else {
                    // console.log("Greška pri dodavanju izračuna.");
                    return 0;
                }

            } catch (error) {
                // console.log("Greška pri dodavanju izračuna.", error);
                return 0;
            }
        },
        async fetchCoolingCalculation (id: number): Promise<void> {
            try {
                const data = await getCoolingLossesHeader(id);
                if (data) {
                    if (data?.message) {
                        this.gwpPredlosci = [];
                    } else {
                        // console.log("gwpPredlosci: ", data);
                        const fuels = await getFuel(data?.uir_uvg_id)
                        // console.log("Fuel: ", fuels);
                        if(fuels?.message) this.gwpPredlosci = [];
                        else {
                            this.gwpPredlosci = groupByMatchUvgNaziv(mapByMatch(data, fuels, 'uir_uvg_id', 'uvg_id'));
                            // console.log("STORE gwpPredlosci: ", this.gwpPredlosci);
                        }
                    }
                } else {
                    this.gwpPredlosci = [];
                    // console.log('Error fetching calculations:', data);
                }
            } catch (error) {
                return error?.message;
                // console.error('Error fetching calculations:', error);
            }
        },
        setKespId(id: any) {
            this.kespId = id;
        },
        setKespBrojIzracuna(brojIzracuna: any) {
            this.kespBrojIzracuna = brojIzracuna;
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
        async fetchHeader(id) {
            // console.log("id: ", id)
            try {
                const response = await getHeader(id);
                if (response) {
                    this.kespBrojIzracuna = response.uiz_broj;
                    this.naziv = response.uiz_opis;
                    this.napomena = response.uiz_napomena || '';
                    this.datumOd = response.uiz_datod;
                    this.datumDo = response.uiz_datdo;
                }
                return response;
            } catch (error) {
                // console.error('Error fetching header:', error);
            }
        },
        clearStore() {
            this.naziv = '';
            this.napomena = '';
            this.godina = new Date(2022, 0, 1);
            this.datumOd = new Date(2022, 0, 1);
            this.datumDo = new Date(2022, 11, 31);
        },
        clearData() {
            this.kespId = null;
            this.kespBrojIzracuna = null;
            this.predlosci = [];
        }
    },
    getters: {
        getKespId: (state) => state.kespId,
        getKespBrojIzracuna: (state) => state.kespBrojIzracuna,
        getPredlosci: (state) => state.predlosci,
        getNaziv: (state) => state.naziv,
        getNapomena: (state) => state.napomena,
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
        // filteredVrsteGoriva: [],
        // vozilo: {
        //     id: null,
        //     uiz_id: null,
        //     uge_id: null,
        //     vozilo: {
        //         id: null,
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
        voziloDialogVisible: false,
        deleteVoziloDialog: false,
    }),

    // Getters: za obračunate vrednosti
    getters: {
        ukupnaEmisija: (state) => {
            return state.vozila
                .reduce((sum, vozilo) => sum + parseFloat(vozilo.usi_emisija || 0), 0)
                .toFixed(2);
        },
        // Ukupna emisija za zadatu kategoriju (uge_naziv)
        emisijaZaKategoriju: (state) => (kategorija: string) => {
            return state.vozila
                .filter(vozilo => vozilo.uge_naziv === kategorija) // Filtriraj vozila prema kategoriji
                .reduce((sum, vozilo) => sum + parseFloat(vozilo.usi_emisija || 0), 0) // Zbir emisija
                .toFixed(2); // Zaokruži na dve decimale
        },
        // Ukupna potrosnja goriva za zadatu kategoriju (uge_naziv)
        potrosnjaGorivaZaKategoriju: (state) => (kategorija: string) => {
            return state.vozila
                .filter(vozilo => vozilo.uge_naziv === kategorija) // Filtriraj vozila prema kategoriji
                .reduce((sum, vozilo) => sum + parseFloat(vozilo.usi_kolicina || 0), 0) // Zbir potrosnje goriva
                .toFixed(2); // Zaokruži na dve decimale
        },
        ukupnaPotrosnjaGorivaZaEnergentIzSkupineEmisija: (state) => (skupina: string, energent: string) => {
            return state.vozila
                .filter(vozilo => vozilo.uge_naziv === skupina && vozilo.uvg_knaziv === energent) // Filtriramo po skupini i energentu
                .reduce((sum, vozilo) => sum + parseFloat(vozilo.usi_kolicina || 0), 0) // Računamo ukupnu potrošnju
                .toFixed(2); // Zaokružujemo na dvije decimale
        },

        ukupnaEmisijaGorivaZaEnergentIzSkupineEmisija: (state) => (skupina: string, energent: string) => {
            return state.vozila
                .filter(vozilo => vozilo.uge_naziv === skupina && vozilo.uvg_knaziv === energent) // Filtriramo po skupini i energentu
                .reduce((sum, vozilo) => sum + parseFloat(vozilo.usi_emisija || 0), 0) // Računamo ukupnu emisiju
                .toFixed(2); // Zaokružujemo na dvije decimale
        },
        mjernaJedinicaZaSkupinuEmisija: (state) => (skupina: string) => {
            return state.vozila
                .find(vozilo => vozilo.uge_naziv === skupina)?.usi_jmj
        }
    },

    // Actions: za funkcije koje manipulišu stanjem
    actions: {
        async fetchVehicles(id) {
            try {
                const vozila = await getVehicles(id);

                if (!vozila.message) {
                    // Grupiranje vozila
                    const grupiranaVozila = vozila.reduce((grupa, vozilo) => {
                        const ugeKey = vozilo.uge_naziv || 'Ostalo'; // Grupiranje po 'uge_naziv'
                        if (!grupa[ugeKey]) {
                            grupa[ugeKey] = {};
                        }

                        const usiKey = vozilo.usi_uvv_id || vozilo.usi_uvv_naziv || 'Nepoznato'; // Grupiranje po 'usi_uvv_id' ili 'usi_uvv_naziv'
                        if (!grupa[ugeKey][usiKey]) {
                            grupa[ugeKey][usiKey] = [];
                        }

                        grupa[ugeKey][usiKey].push(vozilo);
                        return grupa;
                    }, {});

                    // Pretvori objekt grupiranih vozila u niz
                    this.vozila = Object.values(grupiranaVozila).flatMap(usiGroup =>
                        Object.values(usiGroup).flat()
                    );
                } else {
                    this.vozila = [];
                    // console.log("Nema vozila");
                }
            } catch (error) {
                // console.error("Greška prilikom dohvaćanja vozila:", error);
                this.vozila = [];
            }
        },

        async fetchEmissions() {
            const vrste_vozila = await getEmmisionGroups();

            // Iteriramo kroz vrste vozila i dohvacamo kategorije
            for (const vrsta of vrste_vozila) {
                const cats = await getVehiclesForEmmisionGroups(vrsta.uge_id);

                // Provjera da li je cats niz ili objekt sa porukom
                if (Array.isArray(cats)) {
                    // Ako je cats niz, mapiramo children
                    this.vrsteVozila.push({
                        id: vrsta.uge_id,
                        label: vrsta.uge_sif,
                        value: vrsta.uge_naziv,
                        children: cats.map(cat => {
                            // Kreiramo kratku kraticu od dva slova (prvo slovo svake od prve dvije riječi)
                            const kratica = cat.uvv_naziv.split(' ').slice(0, 2).map(word => word[0]).join('');

                            return {
                                id: cat.uvv_id,
                                label: kratica.toUpperCase(), // Kratica dvoslovna u velikim slovima
                                value: cat.uvv_naziv
                            };
                        })
                    });
                } else {
                    // Ako nije niz, postavljamo prazan children niz
                    this.vrsteVozila.push({
                        id: vrsta.uge_id,
                        label: vrsta.uge_sif,
                        value: vrsta.uge_naziv,
                        children: [] // Prazan niz kada nema children
                    });
                }
            }
        },
        async fetchFuels(p_uge_id: number, p_uvv_id: number) {
            const goriva = await getFuelTypes(p_uge_id, p_uvv_id);
            this.vrsteGoriva = goriva;

            // for (const gorivo of goriva) {
            //     this.vrsteGoriva.push({
            //         id: gorivo.uvg_id,
            //         uvg_sif: gorivo.uvg_sif,
            //         label: gorivo.uvg_knaziv,
            //         value: gorivo.uvg_naziv,
            //         value_eng: gorivo.uvg_naziv_en,
            //         metric: gorivo.uvg_jedmj,
            //         koeficijent: parseFloat(gorivo.uvg_koefco2)
            //     })
            // }

            // console.log("goriva: ", this.vrsteGoriva)
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
        async fetchEnergySources(id) {
            try {
                const energySources = await getEnergySources(id);
                // console.log("ENERGIJE: ", energySources)
                if (energySources) this.clearStore();
                for (const source of energySources) {
                    this.izracuni.push({
                        id: source.use_id || null,
                        uiz_id: source.use_uiz_id || null,
                        uvn_id: source.use_uvn_id || null,
                        energija: source.uvn_naziv || '',
                        neobnovljivo: Number(source.use_neobnovljivo) || null,
                        obnovljivo: Number(source.use_obnovljivo) || null,
                        ukupno: Number(source.use_ukupno) || 0.00,
                        emisije: parseFloat(source.use_emisija) || 0.00,
                        emisije_lok: Number(source.use_emisija_lok) || 0.00
                    });
                }
                // console.log("IZRACUNI NAKON FETCHA: ", this.izracuni)
            } catch (error) {
                // console.error('Error fetching energy sources:', error);
            }
        },
        clearStore() {
            this.izracuni = [];
        },
        updateCalculations(rowData) {
            // console.log(" rowData: ", rowData)
            const neobnovljivo = Number(rowData.neobnovljivo) || 0;
            const obnovljivo = Number(rowData.obnovljivo) || 0;
            rowData.ukupno = neobnovljivo + obnovljivo;
            rowData.emisije = rowData.ukupno * rowData.koeficijent;
        },
        async onCellEditComplete(event) {
            const { data, newValue, field } = event;
            let parsedValue = Number(newValue);

            // console.log("data: ", data, "newValue: ", newValue, "field: ", field, "parsedValue: ", parsedValue);

            // Ako je unos prazan, postavljamo vrednost na 0
            if (!newValue || String(newValue).trim() === '') {
                parsedValue = 0;
            }

            // Ažuriramo vrednost u data objektu
            data[field] = parsedValue;

            if (field === 'neobnovljivo' || field === 'obnovljivo') {
                if (this.isPositiveInteger(parsedValue) || parsedValue === 0) {
                    const energyItem = {
                        p_use_id: data.id,
                        p_uiz_id: data.uiz_id,
                        p_uvn_id: data.uvn_id,
                        p_neobnovljivo: data.neobnovljivo || 0,
                        p_obnovljivo: data.obnovljivo || 0
                    };

                    // console.log("energyItem: ", energyItem);

                    try {
                        const response = await updateEnergyItem(energyItem);

                        const { id, status } = response;

                        if (status === 200) {
                            const use_id = id;
                            // console.log(`Energy item updated with ID: ${use_id}`);

                            if (use_id) await this.fetchEnergySources(energyItem.p_uiz_id);

                            return status;
                        } else {
                            // console.error(`Failed to update energy item with ID: ${id}`);
                            return;
                        }
                    } catch (error) {
                        // console.error('Error updating energy item:', error);
                        return;
                    }
                } else {
                    // Ako vrednost nije validna, vraćamo editor na prethodnu vrednost
                    event.preventDefault();
                }
            } else {
                // Za druga polja dozvoljavamo unos teksta
                if (String(newValue).trim().length > 0) {
                    data[field] = newValue;
                    this.updateCalculations(data);
                } else {
                    // Ako je unos prazan, postavljamo vrednost na 0
                    data[field] = 0;
                }
            }
        },
        async updateEnergyItems() {
            let i = 0;
            const updatePromises = this.izracuni.map(async row => {
                // console.log("Red u izračunima: ", row);

                const energyItem = {
                    p_use_id: row.id,
                    p_uiz_id: row.uiz_id,
                    p_uvn_id: row.uvn_id,
                    p_neobnovljivo: row.neobnovljivo || 0,
                    p_obnovljivo: row.obnovljivo || 0
                };

                // console.log(`Primljeni energyItem (${i++}): `, energyItem);

                if (!energyItem.p_uiz_id || !energyItem.p_uvn_id || !energyItem.p_use_id) {
                    return Promise.resolve(); // Ako podaci nisu ispravni, vraćamo resolved Promise kako ne bi blokirao Promise.all
                }

                try {
                    return await updateEnergyItem(energyItem);
                } catch (error) { }
            });

            // Čekaj da se svi API pozivi završe
            await Promise.all(updatePromises);

            // console.log("Sva ažuriranja završena.");
            return 200;
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
            return this.izracuni.reduce((total: number, row: { emisije: number; }) => total + row.emisije, 0).toFixed(4);
        },
        totalLokEmissions() {
            return this.izracuni.reduce((total: number, row: { emisije_lok: number; }) => total + row.emisije_lok, 0).toFixed(4);
        },
        totalCO2Emissions() {
            return Number(Number(this.totalEmissions) + Number(this.totalLokEmissions));
        },
        combinedChartData() {
            const hasData = this.izracuni.some(row => row.neobnovljivo !== null || row.obnovljivo !== null);
            const labels = this.izracuni.map((row: { energija: number; }) => row.energija);
            const data = calculatePercentage(this.izracuni.map((row: { emisije: number; }) => row.emisije));

            if (!hasData) {
                return {
                    labels,
                    datasets: [
                        {
                            data: [0, 0], // Prikazuje [0, 0] kada nema podataka
                            backgroundColor: ['#241147', '#613fa7'], // Zeleno za električnu energiju, žuto za toplinsku
                            hoverBackgroundColor: ['#241147', '#613fa7']
                        }
                    ]
                };
            }

            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#241147', '#613fa7'], // Zeleno za električnu energiju, žuto za toplinsku
                        hoverBackgroundColor: ['#241147', '#613fa7']
                    }
                ]
            };
        }
    }
});