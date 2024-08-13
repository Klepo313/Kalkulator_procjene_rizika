// stores/main-store.ts
import { defineStore } from 'pinia';
import { getCalculationTypes } from '@/service/fetchCalculationTypes'
import { getObjectTypes } from '~/service/fetchObjectTypes';
import { getActivities } from '~/service/fetchActivities';
import { getMunicipalities } from '~/service/fetchMunicipalities';
import { getParticlesForMunicipalities } from '~/service/fetchParticlesForMunicipalities';
import { getCalculation } from '~/service/fetchCalculation';
import { getMetricTypes } from '~/service/fetchMetrictypes';

export const useOpciStore = defineStore('opci-podaci', {
    state: () => ({
        opci_podaci: {},

        vrste_izracuna: [],

        katastarske_opcine: [],

        katastarske_cestice: [],

        vrste_objekta: [],

        djelatnosti: [],

        skupina_djelatnosti: []

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
        async fetchCalculation(id: number) {
            const items = await getCalculation(id);
            if (items?.status == 200) {
                this.opci_podaci = items.data;
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
        adaptacijske_mjere: []
    }),
    actions: {
        async fetchMetrictypes(id: number) {
            const items = await getMetricTypes(id);

            if (items?.status == 200) {
                if (id) {
                    console.log("Prije: ", items.data)
                    if (!items.data.message) {
                        this.odabrane_mjere = items.data
                    }
                } else {
                    this.adaptacijske_mjere = items.data
                }
            } else {
                console.error('Error fetching calculation types:', items?.status);
            }
        },
    }
});

// const customers = ref();
// const representatives = ref([
//     { name: 'Amy Elsner', image: 'amyelsner.png' },
//     { name: 'Anna Fali', image: 'annafali.png' },
//     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//     { name: 'Onyama Limba', image: 'onyamalimba.png' },
//     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//     { name: 'XuXue Feng', image: 'xuxuefeng.png' }
// ]);
// const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
// const loading = ref(true);

// onMounted(() => {
//     CustomerService.getCustomersMedium().then((data) => {
//         customers.value = getCustomers(data);
//         loading.value = false;
//     });
// });


// const initFilters = () => {
//     filters.value = {
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//         balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     };
// };

// initFilters();

// const formatDate = (value) => {
//     return value.toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
// };
// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };
// const clearFilter = () => {
//     initFilters();
// };
// const getCustomers = (data) => {
//     return [...(data || [])].map((d) => {
//         d.date = new Date(d.date);

//         return d;
//     });
// };
// const getSeverity = (status) => {
//     switch (status) {
//         case 'unqualified':
//             return 'danger';

//         case 'qualified':
//             return 'success';

//         case 'new':
//             return 'info';

//         case 'negotiation':
//             return 'warn';

//         case 'renewal':
//             return null;
//     }
// };


// { id: 1001, name: 'Seizmičko ojačanje strukture' },
// { id: 1002, name: 'Izgradnja otpornosti na poplave' },
// { id: 1003, name: 'Ugradnja sustava za gašenje požara' },
// { id: 1004, name: 'Korištenje vatrootpornih materijala' },
// { id: 1005, name: 'Izrada protupotresnih temelja' },
// { id: 1006, name: 'Ugradnja sustava za detekciju plina' },
// { id: 1007, name: 'Poboljšanje energetske učinkovitosti' },
// { id: 1008, name: 'Ugradnja olujnih barijera' },
// { id: 1009, name: 'Optimizacija ventilacijskih sustava' },
// { id: 1010, name: 'Instalacija protuprovalnih sustava' },
// { id: 1011, name: 'Sustavi za odvodnju i kanalizaciju' },
// { id: 1012, name: 'Primjena zelenih krovova i fasada' },
// { id: 1013, name: 'Održavanje i obnova infrastrukture' },
// { id: 1014, name: 'Korištenje obnovljivih izvora energije' },
// { id: 1015, name: 'Poboljšanje akustične izolacije' },
// { id: 1016, name: 'Instalacija sustava za pametno upravljanje zgradama' },
// { id: 1017, name: 'Upotreba održivih građevinskih materijala' },
// { id: 1018, name: 'Ugradnja sustava za prikupljanje kišnice' },
// { id: 1019, name: 'Korištenje izolacije otporne na vlagu' },
// { id: 1020, name: 'Redovite provjere i održavanje sigurnosnih sustava' }

