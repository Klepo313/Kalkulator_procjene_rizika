<template>
    <div class="body">
        <main>
            <h1>Adaptacijske mjere</h1>
            <div class="main-content">
                <!-- <table class="custom-table">
                    <thead>
                        <tr>
                            <th style="width: 20%;">Šifra mjere</th>
                            <th style="width: 80%;">Naziv mjere</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="odabraneMjere.length === 0">
                            <td colspan="2" style="font-style: italic;">
                                <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                                Tablica prazna
                            </td>
                        </tr>
                        <tr v-for="mjera in odabraneMjere" :key="mjera.tva_sif">
                            <td>{{ mjera.tva_sif }}</td>
                            <td>{{ mjera.tva_naziv }}</td>
                            <td class="empty-th">
                                <font-awesome-icon icon="minus" class="minus-icon" style="margin-right: 15px;"
                                    @click="removeMjera(mjera)" />
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div class="newRow">
                    <Select v-model="selectedMjera" :options="mjere" filter :option-label="formatOption"
                        placeholder="Izaberi mjeru" class="select-mjere" />
                    <button class="newMjeraBtn" @click="addMjera">
                        <font-awesome-icon icon="plus" />
                        <span>Dodaj mjeru</span>
                    </button>
                </div> -->

                <span v-if="isLoading" style="font-style: italic;">
                    <font-awesome-icon icon="spinner" spin />
                    Učitavanje podataka
                </span>
                <div v-else class="main-content-container">
                    <div class="mjere-list-odabrane">
                        <h2>Odabrane adaptacijske mjere</h2>
                        <DataTable :value="odabrane_mjere_computed" removableSort paginator :rows="5" stripedRows>
                            <template #empty> Nema odabranih adaptacijskih mjera. </template>
                            <template #loading> Učitavanje odabranih adaptacijskih mjera. Molimo pričekajte. </template>
                            <Column field="tva_sif" header="Šifra" sortable style="width: auto"></Column>
                            <Column field="tva_naziv" header="Naziv" sortable style="width: auto"></Column>
                            <Column field="tgr_naziv" header="Grupa" sortable style="width: auto"></Column>
                        </DataTable>
                    </div>
                    <div class="mjere-list">
                        <!-- <h2 style="color: red;">Filter po temperaturi, vjetru, oborinama i čvrstoj masi još ne radi.
                        </h2>
                        <h2>Dodavanje/uklanjanje mjera radi.</h2> -->
                        <h2>Popis adaptacijskih mjera</h2>
                        <div class="mjere-list-header">
                            <div v-for="vrsta of vrsteMjera" :key="vrsta.key" class="p-checkbox">
                                <Checkbox v-model="odabraneMjereCheckbox" :inputId="vrsta.key" name="mjera"
                                    :value="vrsta.name" />
                                <label :for="vrsta.key" class="p-checkbox-label">{{ vrsta.name }}</label>
                            </div>
                        </div>
                        <div class="mjere-list-table">
                            <DataTable v-model:filters="filters" v-model:selection="odabraneMjere"
                                :value="filteredMjere" paginator :rows="10" dataKey="tva_sif" filterDisplay="menu"
                                :globalFilterFields="['tva_sif', 'tva_naziv', 'tgr_naziv']"
                                @update:selection="onSelectionChange">
                                <template #header>
                                    <div class="flex justify-between">
                                        <IconField>
                                            <InputIcon>
                                                <font-awesome-icon icon="search" />
                                            </InputIcon>
                                            <InputText v-model="filters['global'].value"
                                                placeholder="Pretraži adaptacijske mjere" />
                                        </IconField>
                                    </div>
                                </template>
                                <template #empty> Nema adaptacijskih mjera. </template>
                                <template #loading> Učitavanje adaptacijskih mjera. Molimo pričekajte. </template>
                                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                                <Column field="tva_sif" header="Šifra" style="min-width: 7rem">
                                    <template #body="{ data }">
                                        {{ data.tva_sif }}
                                    </template>
                                </Column>
                                <Column field="tva_naziv" header="Naziv" style="min-width: 14rem">
                                    <template #body="{ data }">
                                        <div class="flex items-center gap-2">
                                            <span>{{ data.tva_naziv }}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="tgr_naziv" header="Grupa">
                                    <template #body="{ data }">
                                        {{ data.tgr_naziv }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <nuxt-link to="/" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Opći podaci
            </nuxt-link>
            <button class="footer-btn" @click="toRizikSazetak">
                Prikaži rizik
                <font-awesome-icon icon="arrow-right-long" style="margin-left: 10px;" />
            </button>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '#app';
import { useAdaptStore } from '~/stores/main-store';
import Checkbox from 'primevue/checkbox';
// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const adaptStore = useAdaptStore();

const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ?
        '/' : parseInt(useCookie('id_izracuna').value)
);

onMounted(async () => {
    adaptStore.odabrane_mjere = [];
    adaptStore.adaptacijske_mjere = [];
    if (!(idIzracuna.value == '/')) {
        await adaptStore.fetchMetrictypes(idIzracuna.value);
        await adaptStore.fetchMetrictypes();
        console.log('Uspješno dohvaćene odabrane mjere.', adaptStore.odabrane_mjere);
        console.log('Uspješno dohvaćene sve adaptacijske mjere.', adaptStore.adaptacijske_mjere);
    } else {
        console.log('ID izračuna je "/", nećemo dohvatiti adaptacijske mjere.');
    }
    isLoading.value = false;
});

const isLoading = ref(true);

const toRizikSazetak = () => {
    navigateTo('/rizik-sazetak');
};

const filters = ref({
    global: { value: '' }
});

const selectedMjera = ref(null);

const mjere = computed(() => adaptStore.adaptacijske_mjere);
// const filteredMjere = ref(mjere.value);
// const filteredMjere = ref(computed(() => mjere.value));
const filteredMjere = ref([]); // Inicijalno prazan niz

// Koristite watchEffect da automatski sinkronizirate filteredMjere s mjere
watchEffect(() => {
    if (mjere.value.length > 0) {
        filteredMjere.value = mjere.value;
    }
});

// const odabraneMjere = computed(() => adaptStore.odabrane_mjere);
const odabraneMjere = ref(adaptStore.odabrane_mjere);
const odabrane_mjere_computed = computed(() => {
    return adaptStore.odabrane_mjere.slice().sort((a, b) => {
        return a.tva_rbr - b.tva_rbr;
    });
});

const vrsteMjera = ref([
    // { name: "Sve grupe", key: "00" },
    { name: "Temperatura", key: "01" },
    { name: "Vjetar", key: "02" },
    { name: "Oborine", key: "03" },
    { name: "Čvrsta masa", key: "04" }
]);
// const odabraneMjereCheckbox = ref("Sve grupe");
const odabraneMjereCheckbox = ref(["Temperatura", "Vjetar", "Oborine", "Čvrsta masa"]); //"Temperatura", "Vjetar", "Oborine", "Čvrsta masa"
watch(mjere, () => {
    odabraneMjere.value = adaptStore.odabrane_mjere.filter(mjera =>
        mjere.value.some(item => item.tva_sif === mjera.tva_sif)
    );
}, { immediate: true });

// watch(odabraneMjereCheckbox, (newValue) => {
//     console.log("Odabrana vrsta mjera: ", newValue);
//     if (newValue === "Sve grupe") {
//         filteredMjere.value = mjere.value; // Prikaz svih mjera
//     } else {
//         filteredMjere.value = mjere.value.filter(mjera => mjera.tgr_naziv === newValue);
//     }
// });

watch(odabraneMjereCheckbox, (newValues) => {
    console.log("Odabrane vrste mjera: ", newValues);

    if (newValues.length === 0) {
        filteredMjere.value = []; // Ako nema odabranih vrsta, prikazuju se sve mjere
    } else {
        filteredMjere.value = mjere.value.filter(mjera =>
            newValues.includes(mjera.tgr_naziv)
        );
    }
}, { immediate: true });

const addMjera = async () => {
    if (selectedMjera.value && !adaptStore.odabrane_mjere.some(mjera => mjera.tva_sif === selectedMjera.value.tva_sif)) {
        adaptStore.odabrane_mjere.push({ ...selectedMjera.value });

        const response = await adaptStore.addMetrictype(idIzracuna.value, selectedMjera.value.tva_id)
        console.log("dodano-povratno: ", response)

        selectedMjera.value = null; // Resetuj odabranu meru nakon dodavanja
    } else {
        console.log("Već ste dodali ovu mjeru.");
    }
};

const removeMjera = async (mjera) => {
    console.log(idIzracuna.value, mjera.tva_id)
    adaptStore.odabrane_mjere = adaptStore.odabrane_mjere.filter(item => item.tva_sif !== mjera.tva_sif);
    const response = await adaptStore.deleteMetrictype(idIzracuna.value, mjera.tva_id)
    console.log("uklonjeno-povratno: ", response)
};

const onSelectionChange = async (event) => {
    const selectedItems = event;

    // Provjera koji su itemi dodani
    for (const item of selectedItems) {
        if (!adaptStore.odabrane_mjere.some(mjera => mjera.tva_sif === item.tva_sif)) {
            selectedMjera.value = item;
            addMjera();
        }
    }

    // Provjera koji su itemi uklonjeni
    for (const mjera of adaptStore.odabrane_mjere) {
        if (!selectedItems.some(item => item.tva_sif === mjera.tva_sif)) {
            removeMjera(mjera);
        }
    }
};

// const formatOption = (option) => {
//     return `${option.tva_sif} - ${option.tva_naziv}`;
// };

</script>

<style scoped>
.mjere-list,
.mjere-list-odabrane,
.main-content-container {
    /* outline: auto; */

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.main-content-container {
    gap: 26px;
}

.mjere-list-header {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 30px;
}

.p-checkbox {
    width: auto;
}

.p-checkbox-label {
    margin-left: 5px;
}

.body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

h2 {
    font-size: 18px;
    color: var(--primary-color);
    /* padding-bottom: 5px;
    border-bottom: 2px solid var(--primary-color); */
}

.main-content {
    width: 80%;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.custom-table th,
.custom-table td {
    height: 42.5px;
    padding: 5px 12px;

    color: var(--text-color);
    text-align: left;
    border-bottom: var(--border);
}

.custom-table thead th {
    background-color: var(--input-focus-color);
    font-weight: bold;
}

.empty-th {
    color: var(--red) !important;
    text-align: right !important;
    /* 
    display: flex;
    align-items: center;
    justify-content: flex-end; */
}

.minus-icon {
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
}

.minus-icon:hover {
    background-color: #a32b2b20;
}

th:first-child {
    border-top-left-radius: 5px;
}

th:last-child {
    border-top-right-radius: 5px;
}

.custom-table tbody tr:nth-child(even) {
    background-color: var(--bg-color);
}

.custom-table tbody tr:nth-child(odd) {
    background-color: var(--bg-color);
}

.grid-item {
    outline: auto;
}

.action-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info {
    margin-top: 10px;
    opacity: 0.5;
}

#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
    color: var(--text-color);
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

#saveBtn:hover {
    background-color: var(--primary-color);
    color: white;
}

#saveBtn:hover>.save-icon {
    color: white;
}

#saveBtn:active {
    background-color: var(--primary-color-focus);
}

.newRow {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.select-mjere {
    width: 100%;
}

.newMjeraBtn {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.newMjeraBtn span {
    text-wrap: nowrap;
}

.p-select {
    height: 38px !important;
    width: 100%;
    padding-top: 2px !important;
    background-color: var(--input-color) !important;
    border: var(--border) !important;
    border-radius: var(--border-form-radius) !important;
    color: var(--text-color);
}

.p-select-label {
    display: flex !important;
    align-items: center !important;
}

.p-select-label.p-placeholder span {
    opacity: 0.4;
}


@media screen and (max-width: 1500px) {
    .main-content {
        width: 80%;
    }
}

@media screen and (max-width: 1280px) {
    .main-content {
        width: 100%;
    }
}
</style>