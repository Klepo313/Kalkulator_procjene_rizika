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

//import { formatDateToISO } from '~/utils/dateFormatter';

export const useIzracunStore = defineStore('izracunStore', {
    state: () => ({
        idIzracuna: '',
        scenarij: '',
    }),
    actions: {
        updateIdIzracuna(newValue: string) {
            this.idIzracuna = newValue;
            // useCookie('id_izracuna').value = newValue;
        },

        updateScenarij(newValue: string) {
            this.scenarij = newValue;
        }
    },
});

// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         isLoggedIn: false,
//     }),
//     actions: {
//         setLoginStatus(status: boolean) {
//             this.isLoggedIn = status;
//         },
//     },
// });

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
        godina: new Date(2022, 0, 1),
        datumOd: new Date(2022, 0, 1), // January 1st, 2022
        datumDo: new Date(2022, 11, 31), // December 31st, 2022
    }),
    actions: {
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
        vozila: [
            {
                id: 1,
                redniBroj: 1,
                vozilo: { skupina: 'Osobno vozilo', vrsta: 'Motocikli' },
                gorivo: { value: 'Benzin', metric: 'L' },
                potrosnjaGoriva: 200,
                emisije: 48.6
            },
            {
                id: 2,
                redniBroj: 2,
                vozilo: { skupina: 'Teretno vozilo', vrsta: 'Kamioni' },
                gorivo: { value: 'Dizel', metric: 'L' },
                potrosnjaGoriva: 400,
                emisije: 97.2
            },
        ],
        vrsteVozila: [
            {
                label: 'Osobno',
                value: 'Osobno vozilo',
                children: [
                    { label: 'OV', value: 'Osobno vozilo' },
                    { label: 'DV', value: 'Dostavno vozilo (<3500kg)' },
                    { label: 'MT', value: 'Motocikli' }
                ]
            },
            {
                label: 'Teretno',
                value: 'Teretno vozilo',
                children: [
                    { label: 'KM', value: 'Kamioni' },
                    { label: 'TP', value: 'Tegljači s prikolicom' },
                    { label: 'DV', value: 'Dostavna vozila (>3500kg)' },
                ]
            },
            { label: 'Stroj', value: 'Stroj', children: [] },
        ],
        vrsteGoriva: [
            { label: 'Benzin', value: 'Benzin', metric: 'L', koeficijent: 0.443 },
            { label: 'Dizel', value: 'Dizel', metric: 'L', koeficijent: 0.243 },
        ],
        vozilo: {
            id: 0,
            redniBroj: 0,
            vozilo: { skupina: '', vrsta: '' },
            gorivo: { value: '', metric: '' },
            potrosnjaGoriva: null,
            emisije: null,
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
        resetVoziloForm() {
            this.vozilo = {
                id: 0,
                redniBroj: 0,
                vozilo: { skupina: '', vrsta: '' },
                gorivo: { value: '', metric: '' },
                potrosnjaGoriva: null,
                emisije: null,
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
        selectedYear: 0, // Odabrana godina
        izracuni: [
            {
                id: 1,
                energija: 'Električna energija',
                neobnovljivo: null,
                obnovljivo: null,
                ukupno: 0,
                emisije: 0,
                koeficijent: 0.12 // Koeficijent za emisije CO2
            },
            {
                id: 2,
                energija: 'Toplinska energija',
                neobnovljivo: null,
                obnovljivo: null,
                ukupno: 0,
                emisije: 0,
                koeficijent: 0.4 // Koeficijent za emisije CO2
            }
        ]
    }),
    actions: {
        updateIzracuni() {
            if (this.selectedYear) {
                // Ovdje dodaj logiku za ažuriranje podataka na osnovu odabrane godine
                console.log(`Odabrana godina: ${this.selectedYear}`);
            }
        },

        updateCalculations(rowData: { neobnovljivo: number; obnovljivo: number; ukupno: number; emisije: number; koeficijent: number; }) {
            const neobnovljivo = rowData.neobnovljivo || 0;
            const obnovljivo = rowData.obnovljivo || 0;
            rowData.ukupno = neobnovljivo + obnovljivo;
            rowData.emisije = rowData.ukupno * rowData.koeficijent;
        },

        onCellEditComplete(event: { preventDefault?: any; data?: any; newValue?: any; field?: any; }) {
            const { data, newValue, field } = event;

            switch (field) {
                case 'neobnovljivo':
                case 'obnovljivo':
                    if (this.isPositiveInteger(newValue)) {
                        data[field] = newValue;
                        this.updateCalculations(data); // Ažuriraj izračune nakon unosa
                    } else {
                        event.preventDefault(); // Spriječi unos ako nije pozitivan cijeli broj
                    }
                    break;

                default:
                    if (newValue.trim().length > 0) {
                        data[field] = newValue;
                        this.updateCalculations(data); // Ažuriraj izračune nakon unosa
                    } else {
                        event.preventDefault(); // Spriječi unos ako je prazan
                    }
                    break;
            }
        },

        isPositiveInteger(val: unknown) {
            let str = String(val).trim();

            if (!str) {
                return false;
            }

            str = str.replace(/^0+/, '') || '0';
            const n = Math.floor(Number(str));

            return n !== Infinity && String(n) === str && n >= 0;
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
                            backgroundColor: ['#2cc23f', '#1e822a'], // Zeleno za električnu energiju, žuto za toplinsku
                            hoverBackgroundColor: ['#2cc23a', '#1e8211']
                        }
                    ]
                };
            }

            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#2cc23f', '#1e822a'], // Zeleno za električnu energiju, žuto za toplinsku
                        hoverBackgroundColor: ['#2cc23a', '#1e8211']
                    }
                ]
            };
        }
    }
});