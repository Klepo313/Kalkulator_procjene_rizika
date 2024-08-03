// stores/main-store.ts
import { defineStore } from 'pinia';
import { useCookie } from '#app';

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
        vrste_izracuna: [
            { name: 'Proces' },
            { name: 'Imovina' },
        ],

        katastarske_opcine: [
            { name: "Šišljavić" },
            { name: "Mladićić" },
            { name: "Kaštela" },
            { name: "Dubrovnik" },
            { name: "Split" },
            { name: "Zagreb" },
            { name: "Rijeka" },
            { name: "Osijek" },
            { name: "Zadar" },
            { name: "Pula" },
            { name: "Šibenik" },
            { name: "Varaždin" },
            { name: "Koprivnica" },
            { name: "Čakovec" },
            { name: "Sisak" },
            { name: "Karlovac" },
            { name: "Vukovar" },
            { name: "Slavonski Brod" },
            { name: "Vinkovci" },
            { name: "Požega" }
        ],

        katastarske_cestice: [
            { name: "337/12" },
            { name: "337/14" },
            { name: "327/13" },
            { name: "347/15" },
            { name: "357/16" },
            { name: "367/17" },
            { name: "377/18" },
            { name: "387/19" },
            { name: "397/20" },
            { name: "407/21" },
            { name: "417/22" },
            { name: "427/23" },
            { name: "437/24" },
            { name: "447/25" },
            { name: "457/26" },
            { name: "467/27" },
            { name: "477/28" },
            { name: "487/29" },
            { name: "497/30" },
            { name: "507/31" }
        ],

        vrsta_objekta: [
            { name: "Zgrada" },
            { name: "Poljoprivredno zemljište" },
            { name: "Ostalo" },
            { name: "Industrijski objekt" },
            { name: "Stambena kuća" },
            { name: "Poslovni prostor" },
            { name: "Garaža" },
            { name: "Skadište" },
            { name: "Vikendica" },
            { name: "Vrt" },
            { name: "Šuma" },
            { name: "Ribnjak" },
            { name: "Plaža" },
            { name: "Jezero" },
            { name: "Planina" },
            { name: "Livada" },
            { name: "Vinograd" },
            { name: "Voćnjak" },
            { name: "Sportski teren" },
            { name: "Zoološki vrt" }
        ],

        djelatnosti: [
            { id: "01.11.", name: "Uzgoj žitarica (osim riže), mahunarki i uljanog sjemena" },
            { id: "02.15.", name: "Uzgoj ribe" },
            { id: "03.21.", name: "Proizvodnja mlijeka" },
            { id: "04.30.", name: "Uzgoj peradi" },
            { id: "05.40.", name: "Ribolov" },
            { id: "06.50.", name: "Proizvodnja vina" },
            { id: "07.60.", name: "Uzgajanje cvijeća" },
            { id: "08.70.", name: "Proizvodnja piva" },
            { id: "09.80.", name: "Proizvodnja obuće" },
            { id: "10.90.", name: "Građevinarstvo" },
            { id: "11.10.", name: "Transport" },
            { id: "12.20.", name: "Telekomunikacije" },
            { id: "13.30.", name: "Energetika" },
            { id: "14.40.", name: "Konzalting" },
            { id: "15.50.", name: "Informatika" },
            { id: "16.60.", name: "Edukacija" },
            { id: "17.70.", name: "Zdravstvo" },
            { id: "18.80.", name: "Turizam" },
            { id: "19.90.", name: "Kultura i umjetnost" },
            { id: "20.10.", name: "Poljoprivreda" }
        ],

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
        // Inicijalizacija podataka iz kolačića
        initFromCookies() {
            const cookie = useCookie('opci_podaci');
            const savedData = cookie.value;
            if (savedData && typeof savedData === 'object') {
                this.opci_podaci = savedData;
            } else {
                console.log('Kolačić je prazan, nije pronađen ili podaci nisu objekt.');
            }

        },

        // Metoda za postavljanje podataka i pohranjivanje u kolačiće
        setOpciPodaci(podaci: Partial<typeof this.opci_podaci>) {
            this.opci_podaci = { ...this.opci_podaci, ...podaci };
            const cookie = useCookie('opci_podaci');
            cookie.value = JSON.stringify(this.opci_podaci);
        },

        // Metoda za provjeru je li string valjan JSON
        isJsonString(str: string) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
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