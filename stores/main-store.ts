// stores/main-store.ts
import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { getCalculationTypes } from '@/service/fetchCalculationTypes'
import { getObjectTypes } from '~/service/fetchObjectTypes';
import { getActivities } from '~/service/fetchActivities';
import { getMunicipalities } from '~/service/fetchMunicipalities';
import { getParticlesForMunicipalities } from '~/service/fetchParticlesForMunicipalities';

export const useOpciStore = defineStore('opci-podaci', {
    state: () => ({
        opci_podaci: {
            datum: '',
            vrsta_izracuna: '',
            katastarska_opcina: '',
            katastarska_cestica: '',
            vrsta_objekta: '',
            djelatnost: {
                id: 0,
                name: '',
            },
            skupina_djelatnosti: '',
            ispostava: '',
            podrucni_ured: ''
        },
        vrste_izracuna: [],

        katastarske_opcine: [],

        katastarske_cestice: [
            // { name: "337/12" },
            // { name: "337/14" },
            // { name: "327/13" },
            // { name: "347/15" },
            // { name: "357/16" },
            // { name: "367/17" },
            // { name: "377/18" },
            // { name: "387/19" },
            // { name: "397/20" },
            // { name: "407/21" },
            // { name: "417/22" },
            // { name: "427/23" },
            // { name: "437/24" },
            // { name: "447/25" },
            // { name: "457/26" },
            // { name: "467/27" },
            // { name: "477/28" },
            // { name: "487/29" },
            // { name: "497/30" },
            // { name: "507/31" }
        ],

        vrste_objekta: [],

        djelatnosti: [],

        skupina_djelatnosti: [
            { id: "1.11.", name: "Uzgoj jednogodišnjih usjeva" },
            { id: "2.22.", name: "Uzgoj dvogodišnjih usjeva" },
            { id: "3.33.", name: "Ribarstvo" },
            { id: "4.44.", name: "Pčelarstvo" },
            { id: "5.55.", name: "Sakupljanje šumskih plodova" },
            { id: "6.66.", name: "Lovstvo" },
            { id: "7.77.", name: "Ekologija" },
            { id: "8.88.", name: "Vodoprivreda" },
            { id: "9.99.", name: "Veterinarstvo" },
            { id: "10.10.", name: "Morsko ribarstvo" },
            { id: "11.11.", name: "Skladištenje" },
            { id: "12.12.", name: "Distribucija" },
            { id: "13.13.", name: "Logistika" },
            { id: "14.14.", name: "Financijske usluge" },
            { id: "15.15.", name: "Pravno savjetovanje" },
            { id: "16.16.", name: "Revizija" },
            { id: "17.17.", name: "Prevođenje" },
            { id: "18.18.", name: "Dizajn" },
            { id: "19.19.", name: "Oglašavanje" },
            { id: "20.20.", name: "Menadžment" }
        ]

    }),
    actions: {
        initializeData() {

        },
        clearData() {

        },

        async fetchCalculationTypes() {
            const items = await getCalculationTypes();

            if (items?.status == 200) {
                this.vrste_izracuna = items.data;
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
        async fetchParticlesForMunicipalities(id: number) {
            const items = await getParticlesForMunicipalities(id);

            if (items?.status == 200) {
                this.katastarske_cestice = items.data;
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },


    },
});

export const useAdaptStore = defineStore('adaptacijske-mjere', {
    state: () => ({
        odabrane_mjere: [],
        adaptacijske_mjere: [
            { id: 1001, name: 'Seizmičko ojačanje strukture' },
            { id: 1002, name: 'Izgradnja otpornosti na poplave' },
            { id: 1003, name: 'Ugradnja sustava za gašenje požara' },
            { id: 1004, name: 'Korištenje vatrootpornih materijala' },
            { id: 1005, name: 'Izrada protupotresnih temelja' },
            { id: 1006, name: 'Ugradnja sustava za detekciju plina' },
            { id: 1007, name: 'Poboljšanje energetske učinkovitosti' },
            { id: 1008, name: 'Ugradnja olujnih barijera' },
            { id: 1009, name: 'Optimizacija ventilacijskih sustava' },
            { id: 1010, name: 'Instalacija protuprovalnih sustava' },
            { id: 1011, name: 'Sustavi za odvodnju i kanalizaciju' },
            { id: 1012, name: 'Primjena zelenih krovova i fasada' },
            { id: 1013, name: 'Održavanje i obnova infrastrukture' },
            { id: 1014, name: 'Korištenje obnovljivih izvora energije' },
            { id: 1015, name: 'Poboljšanje akustične izolacije' },
            { id: 1016, name: 'Instalacija sustava za pametno upravljanje zgradama' },
            { id: 1017, name: 'Upotreba održivih građevinskih materijala' },
            { id: 1018, name: 'Ugradnja sustava za prikupljanje kišnice' },
            { id: 1019, name: 'Korištenje izolacije otporne na vlagu' },
            { id: 1020, name: 'Redovite provjere i održavanje sigurnosnih sustava' }
        ]
    })
});


// Inicijalizacija podataka iz kolačića
// initFromCookies() {
//     const cookie = useCookie('opci_podaci');
//     const savedData = cookie.value;
//     if (savedData && typeof savedData === 'object') {
//         this.opci_podaci = savedData;
//     } else {
//         console.log('Kolačić je prazan, nije pronađen ili podaci nisu objekt.');
//     }

// },

// Metoda za postavljanje podataka i pohranjivanje u kolačiće
// setOpciPodaci(podaci: Partial<typeof this.opci_podaci>) {
//     this.opci_podaci = { ...this.opci_podaci, ...podaci };
//     const cookie = useCookie('opci_podaci');
//     cookie.value = JSON.stringify(this.opci_podaci);
// },

// Metoda za provjeru je li string valjan JSON
// isJsonString(str: string) {
//     try {
//         JSON.parse(str);
//     } catch (e) {
//         return false;
//     }
//     return true;
// }