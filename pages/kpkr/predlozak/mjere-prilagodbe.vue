<template>
    <div class="body">
        <main>
            <h1>Mjere prilagodbe</h1>
            <div class="main-content">
                <span v-if="isLoading" style="font-style: italic;">
                    <font-awesome-icon icon="spinner" spin />
                    Učitavanje podataka
                </span>
                <div v-else class="main-content-container">
                    <div class="mjere-list-odabrane">
                        <h2>Odabrane mjere prilagodbe</h2>
                        <DataTable :value="odabrane_mjere_computed" removableSort paginator :rows="5" stripedRows>
                            <template #empty> Nema odabranih mjera prilagodbe. </template>
                            <template #loading> Učitavanje odabranih mjera prilagodbe. Molimo pričekajte. </template>
                            <Column field="tva_sif" header="Šifra" sortable style="width: auto" />
                            <Column field="tva_naziv" header="Naziv" sortable style="width: auto" />
                            <Column field="tgr_naziv" header="Grupa" sortable style="width: auto" />
                        </DataTable>
                    </div>
                    <div class="mjere-list">
                        <!-- <h2 style="color: red;">Filter po temperaturi, vjetru, oborinama i čvrstoj masi još ne radi.
                        </h2>
                        <h2>Dodavanje/uklanjanje mjera radi.</h2> -->
                        <h2>Popis mjera prilagodbe</h2>
                        <div class="mjere-list-header">
                            <div v-for="vrsta of vrsteMjera" :key="vrsta.key" class="p-checkbox">
                                <Checkbox v-model="odabraneMjereCheckbox" :inputId="vrsta.key" name="mjera"
                                    :value="vrsta.name" />
                                <label :for="vrsta.key" class="p-checkbox-label">{{ vrsta.name }}</label>
                            </div>
                        </div>
                        <div class="mjere-list-table">
                            <DataTable v-model:filters="filters" v-model:selection="odabraneMjere"
                                :value="filteredMjere" scrollable :scrollHeight="scrollHeight" :rows="10"
                                dataKey="tva_sif" filterDisplay="menu"
                                :globalFilterFields="['tva_sif', 'tva_naziv', 'tgr_naziv']"
                                @update:selection="onSelectionChange">
                                <template #header>
                                    <div class="flex justify-between">
                                        <IconField>
                                            <InputIcon>
                                                <font-awesome-icon icon="search" />
                                            </InputIcon>
                                            <InputText v-model="filters['global'].value"
                                                placeholder="Pretraži mjere prilagodbe" />
                                        </IconField>
                                    </div>
                                </template>
                                <template #empty> Nema mjera prilagodbe. </template>
                                <template #loading> Učitavanje mjera prilagodbe. Molimo pričekajte. </template>
                                <Column selectionMode="multiple" headerStyle="width: 3rem" />
                                <Column field="tva_sif" header="Šifra" style="min-width: 7rem">
                                    <template #body="{ data }">
                                        {{ data.tva_sif }}
                                    </template>
                                </Column>
                                <Column field="tva_naziv" header="Naziv" style="min-width: 14rem">
                                    <template #body="{ data }">
                                        <div class="template-div flex items-center gap-2"
                                            @click="toggleOp(data.tva_id, $event)"
                                            @mouseenter="toggleOp(data.tva_id, $event)"
                                            @mouseleave="toggleOp(data.tva_id, $event)">
                                            <span>{{ data.tva_naziv }}</span>
                                        </div>
                                        <!-- Dinamički popover :title="data.tva_opis" -->
                                        <Popover :ref="setPopoverRef(data.tva_id)">
                                            <div class="popover">
                                                <!-- {{ data.tva_opis }} -->

                                                <ul>
                                                    <!-- Razdvoji string na list iteme i prikazi ih -->
                                                    <li v-for="(item, index) in splitOpis(data.tva_opis)" :key="index">
                                                        {{ item }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </Popover>
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
            <button class="footer-btn" @click="navigateWithParameter('/kpkr/predlozak', 'id', idIzracuna)">
                <font-awesome-icon icon="arrow-left-long" style="margin-right: 10px;" />
                Opći podaci
            </button>
            <button class="footer-btn"
                @click="navigateWithParameter('/kpkr/predlozak/rizik-sazetak', 'id', idIzracuna)">
                Izračunaj rizik
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

definePageMeta({
    middleware: [
        'auth',
        'izracun'
    ],
});

const adaptStore = useAdaptStore();

const props = defineProps({
    aiz_id: String
})

const idIzracuna = computed(() => props.aiz_id == 'null' ? getIdFromUrl() : props.aiz_id)

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScrollHeight); // Ukloni listener prilikom unmounta
});

onMounted(async () => {
    // Pozovi funkciju kada se komponenta inicijalizuje
    // const cookieData = await initializeCookie('id-izracuna');
    // idIzracuna.value = cookieData['id-izracuna'] || '';
    // console.log('ID izračuna je: ', idIzracuna.value);

    updateScrollHeight(); // Postavi scrollHeight prilikom montiranja
    window.addEventListener('resize', updateScrollHeight); // Dodaj listener za promjenu veličine

    adaptStore.odabrane_mjere = [];
    adaptStore.adaptacijske_mjere = [];
    if (idIzracuna.value) {
        await adaptStore.fetchMetrictypes(idIzracuna.value);
        await adaptStore.fetchMetrictypes();
        console.log('Uspješno dohvaćene odabrane mjere.', adaptStore.odabrane_mjere);
        console.log('Uspješno dohvaćene sve mjere prilagodbe.', adaptStore.adaptacijske_mjere);
    } else {
        console.log('ID izračuna je "/", nećemo dohvatiti mjere prilagodbe.');
    }
    isLoading.value = false;
});

const isLoading = ref(true);

const filters = ref({
    global: { value: '' }
});

const selectedMjera = ref(null);

const mjere = computed(() => adaptStore.adaptacijske_mjere);
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

const scrollHeight = ref('600px');
const updateScrollHeight = () => {
    const width = window.innerWidth;
    if (width <= 1500) {
        scrollHeight.value = '400px';
    } else if (width > 1500 && width < 1920) {
        scrollHeight.value = '600px';
    } else {
        scrollHeight.value = '800px';
    }
};

// Objekt za praćenje svih popover ref-ova po ID-u
const popoverRefs = ref({});

// Funkcija za dinamično postavljanje ref-a
const setPopoverRef = (id) => {
    return (el) => {
        if (el) {
            popoverRefs.value[id] = el;
        }
    };
};

// Funkcija za prebacivanje popovera
const toggleOp = (id, event) => {
    const popover = popoverRefs.value[id];
    if (popover) {
        popover.toggle(event); // Otvori ili zatvori odgovarajući popover
    }
};

// Funkcija za razdvajanje opisa po znaku '-'
const splitOpis = (opis) => {
    // Uklanjamo početni prazni element ako postoji
    return opis.split('-').filter(item => item.trim() !== '').map(item => item.trim());
};

</script>

<style scoped>
.template-div {
    cursor: pointer;
}

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

.mjere-list-table {
    position: relative;
    /* Ovo je potrebno za pozicioniranje gradijenta */
    overflow-y: auto;
    /* Omogućava vertikalni scroll */
}

.mjere-list-table::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    /* Visina gradijenta */
    background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    /* background: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)); */
    /* Blagi gradijent */
    pointer-events: none;
    /* Onemogućava interakciju s gradijentom */
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
    gap: 26px;
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

.ui-tooltip {
    border: 1px solid #ccc;
    box-shadow: 0 0 10px 0 #ddd;
    -moz-box-shadow: 0 0 10px 0 #ddd;
    -webkit-box-shadow: 0 0 10px 0 #ddd;
    color: #666;
    background: #f8f8f8;
}

.p-popover-content {
    background-color: var(--input-color) !important;
}

.popover {
    max-width: 600px;
    background-color: var(--input-color);
    padding: 10px;
    border-radius: 5px;
}

.popover ul {
    list-style-type: disc;
    /* Ili možeš staviti 'none' za bez oznaka */
    padding-left: 1.2rem;
    /* Udaljenost lijevo za stavke liste */
}

.popover li {
    margin-bottom: 0.3rem;
    /* Razmak između stavki */
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