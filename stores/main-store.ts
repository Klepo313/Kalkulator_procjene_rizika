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
        idIzracuna: useCookie('id_izracuna').value,
    }),
    actions: {
        updateIdIzracuna(newValue: string) {
            this.idIzracuna = newValue;
            // useCookie('id_izracuna').value = newValue;
        },
    },
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

export const useKespStore = defineStore('kesp-store', {
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
        vrsteGoriva: [
            { label: 'Benzin', value: 'Benzin', metric: 'L', koeficijent: 0.443 },
            { label: 'Dizel', value: 'Dizel', metric: 'L', koeficijent: 0.243 },
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
        vrsteEnergenata: [
            { label: 'Plin', value: 'Prirodni plin', metric: 'm³', metricHTML: 'm<sup>3</sup>', koeficijent: 1.6 },
            { label: 'Ulje', value: 'Loživo ulje', metric: 'L', koeficijent: 2.6 },
            { label: 'UNP', value: 'UNP', metric: 'L', koeficijent: 3.6 },
        ],
        vozilo: {
            id: null,
            redniBroj: null,
            vozilo: { skupina: '', vrsta: '' }, // Ispravna inicijalizacija vozilo objekta
            gorivo: { value: '', metric: 'L' },
            potrosnjaGoriva: null,
            emisije: null
        },

        // IZVORI

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
    }),
    actions: {
        resetVoziloForm() {
            this.vozilo = {
                id: null,
                redniBroj: null,
                vozilo: { skupina: '', vrsta: '' },
                gorivo: { value: '', metric: 'L' },
                potrosnjaGoriva: null,
                emisije: null
            };
        },
        resetIzvorForm() {
            this.izvor = {
                id: null,
                vrstaGoriva: '',
                vrstaEnergenata: { value: '', metric: '' },
                potrosnjaEnergenata: null,
                emisije: null,
            };
        }
    }
});
