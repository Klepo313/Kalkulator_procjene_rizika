<template>
    <div class="body">
        <main>
            <h1>{{ activeSectionTitle }}</h1>

            <div class="main-content">
                <section id="sva-vozila">
                    <div>
                        <h2>Sva vozila (osobna, teretna, strojevi)</h2>
                        <p>Potrošnja goriva u litrama</p>
                    </div>
                    <div class="datatable">
                        <!-- Toolbar za Dodavanje/Uklanjanje vozila -->
                        <Toolbar class="mb-6" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" @click="openNewVozilo">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj vozilo
                                </button>
                            </template>
                            <template #end>
                                <button class="ukloni-btn" :disabled="!selectedVozilo" @click="openVoziloDeleteDialog">
                                    <font-awesome-icon icon="minus" /> Ukloni vozilo
                                </button>
                            </template>
                        </Toolbar>

                        <!-- DataTable za prikaz vozila -->
                        <DataTable v-model:selection="selectedVozilo" :value="vozila" removable-sort show-gridlines
                            selection-mode="single" :rows="5" data-key="id" @row-edit-save="onRowEditSave">
                            <template #empty> Nema odabranih vozila </template>

                            <Column header="No.">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="vrstaVozila" header="Vrsta vozila" sortable>
                                <template #body="slotProps">
                                    <font-awesome-icon :icon="getVehicleIcon(slotProps.data.vrstaVozila)"
                                        style="margin-right: 5px;" />
                                    {{ slotProps.data.vrstaVozila }}
                                </template>
                            </Column>


                            <Column field="gorivo" header="Gorivo" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.gorivo"
                                        :class="{ 'dizel-tag': slotProps.data.gorivo === 'Dizel' }" />
                                </template>
                            </Column>
                            <Column field="potroseneLitre" header="Ukupan broj potrošenih litara" sortable />
                            <Column field="emisije" header="Emisije CO2/kg" sortable>
                                <template #body="slotProps">
                                    <span>{{ slotProps.data.emisije.toFixed(2) }}</span>
                                </template>
                            </Column>
                            <template #footer>
                                <div class="total-emissions">
                                    <div>
                                        Ukupno: <strong>{{ total.toFixed(2) }}</strong> CO<sub>2</sub>/kg
                                    </div>
                                </div>
                            </template>
                        </DataTable>

                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="voziloDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="resetVoziloForm">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <Select id="vrstaVozila" v-model="vozilo.vrstaVozila" :options="vrsteVozila"
                                        option-label="label" option-value="value" placeholder="Odaberi vrstu vozila"
                                        required>

                                        <!-- Prilagođavanje prikaza odabrane opcije -->
                                        <!-- <template #value="slotProps">
                                            <font-awesome-icon :icon="getVehicleIcon(slotProps.value)" class="mr-2" />
                                            {{ slotProps.value }}
                                        </template>

                                        Prilagođavanje prikaza opcija u dropdownu 
                                        <template #option="slotProps">
                                            <font-awesome-icon :icon="getVehicleIcon(slotProps.option.value)"
                                                class="mr-2" />
                                            {{ slotProps.option.label }}
                                        </template> -->
                                    </Select>


                                </div>

                                <div class="field">
                                    <label for="gorivo">Gorivo</label>
                                    <Select id="gorivo" v-model="vozilo.gorivo" :options="vrsteGoriva"
                                        option-label="label" option-value="value" placeholder="Odaberi vrstu goriva"
                                        required />
                                </div>

                                <div class="field">
                                    <label for="potroseneLitre">Ukupan broj potrošenih litara</label>
                                    <InputText id="potroseneLitre" v-model="vozilo.potroseneLitre"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required />
                                </div>

                                <div class="field">
                                    <label for="emisije">Emisije CO2/kg</label>
                                    <InputText id="emisije" v-model="vozilo.emisije" placeholder="Emisija CO2/kg"
                                        readonly />
                                </div>

                                <div class="dialog-footer">
                                    <button type="button" class="p-button p-component p-button-secondary"
                                        @click="voziloDialogVisible = false">
                                        Odustani
                                    </button>
                                    <button class="submitBtn" type="submit">Spremi</button>
                                </div>
                            </form>
                        </Dialog>

                        <!-- Confirm Dialog za brisanje -->
                        <Dialog v-model:visible="deleteVoziloDialog" :style="{ width: '450px' }" header="Ukloni vozilo"
                            :modal="true">
                            <div class="flex items-center gap-4">
                                <i class="pi pi-exclamation-triangle !text-3xl" />
                                <span v-if="selectedVozilo" class="closeDialog">
                                    Jeste li sigurni da želite obrisati vozilo:
                                    <div style="margin-top: 10px;">
                                        Vrsta vozila: <b>{{ selectedVozilo.vrstaVozila }}</b> <br>
                                        Gorivo: <b>{{ selectedVozilo.gorivo }}</b> <br>
                                        Ukupni broj potrošenih litara: <b>{{ selectedVozilo.potroseneLitre }}</b> <br>
                                        Emisije CO<sub>2</sub> /kg: <b>{{ selectedVozilo.emisije }}</b>
                                        ?
                                    </div>
                                </span>
                            </div>
                            <template #footer>
                                <button class="p-button p-component p-button-secondary" @click="deleteVozilo">
                                    Ukloni
                                </button>
                                <button class="submitBtn" @click="deleteVoziloDialog = false">
                                    Odustani
                                </button>
                            </template>
                        </Dialog>
                    </div>
                </section>
                <section id="stacionarni-izvor">
                    <div>
                        <h2>Stacionarni izvor</h2>
                        <p>Emisije CO<sub>2</sub> iz vlastitih izvora za proizvodnju električne i toplinske energije</p>
                    </div>
                    <div class="datatable">
                        <!-- Toolbar za Dodavanje/Uklanjanje vozila -->
                        <Toolbar class="mb-6" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" @click="openNewIzvor">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj stacionarni izvor
                                </button>
                            </template>
                            <template #end>
                                <button class="ukloni-btn" :disabled="!selectedIzvor" @click="openIzvorDeleteDialog">
                                    <font-awesome-icon icon="minus" /> Ukloni stacionarni izvor
                                </button>
                            </template>
                        </Toolbar>

                        <!-- DataTable za prikaz stacionarnih izvora -->
                        <DataTable v-model:selection="selectedIzvor" :value="izvori" removable-sort show-gridlines
                            selection-mode="single" :rows="5" data-key="id" @row-edit-save="onRowEditSave">
                            <template #empty> Nema odabranih stacionarnih izvora </template>

                            <Column header="No.">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="vrstaEnergenata" header="Vrsta energenata" sortable>
                                <template #body="slotProps">
                                    <font-awesome-icon :icon="getIzvorIcon(slotProps.data.vrstaEnergenata.label)"
                                        style="margin-right: 5px;" />
                                    {{ slotProps.data.vrstaEnergenata.value }}
                                </template>
                            </Column>

                            <Column field="potrosnjaEnergenata" header="Potrošnja energenta" sortable />

                            <Column field="vrstaEnergenata" header="Mjerna jedinica" sortable>
                                <template #body="slotProps">
                                    <span v-html="slotProps.data.vrstaEnergenata.metric" />
                                </template>
                            </Column>

                            <Column field="emisije" header="Emisije CO2/kg" sortable>
                                <template #body="slotProps">
                                    <span>{{ slotProps.data.emisije.toFixed(2) }}</span>
                                </template>
                            </Column>
                            <template #footer>
                                <div class="total-emissions">
                                    <div>
                                        <span>Ukupno: </span> <strong>{{ emissions.toFixed(2) }}</strong>
                                        CO<sub>2</sub>/kg
                                    </div>
                                </div>
                            </template>
                        </DataTable>


                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="izvorDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="resetIzvorForm">
                            <form class="p-fluid" @submit.prevent="saveIzvor">
                                <div class="field">
                                    <label for="vrstaEnergenata">Vrsta energenata i jedinica za unos</label>
                                    <Select id="vrstaEnergenata" v-model="izvor.vrstaEnergenata"
                                        :options="vrsteEnergenata" :option-label="izvorOptionLabel"
                                        :option-value="option" placeholder="Odaberi vrstu energenata i jedinica za unos"
                                        required />
                                </div>

                                <div class="field">
                                    <label for="potroseneLitre">Potrošnja energenata</label>
                                    <InputText id="potroseneLitre" v-model="izvor.potrosnjaEnergenata"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required />
                                </div>

                                <div class="field">
                                    <label for="emisije">Emisije CO2/kg</label>
                                    <InputText id="emisije" v-model="izvor.emisije" placeholder="Emisija CO2/kg"
                                        readonly />
                                </div>

                                <div class="dialog-footer">
                                    <button type="button" class="p-button p-component p-button-secondary"
                                        @click="izvorDialogVisible = false">
                                        Odustani
                                    </button>
                                    <button class="submitBtn" type="submit">Spremi</button>
                                </div>
                            </form>
                        </Dialog>

                        <!-- Confirm Dialog za brisanje -->
                        <Dialog v-model:visible="deleteIzvorDialog" :style="{ width: '450px' }"
                            header="Ukloni stacionarni izvor" :modal="true">
                            <div class="flex items-center gap-4">
                                <i class="pi pi-exclamation-triangle !text-3xl" />
                                <template v-if="selectedIzvor">
                                    Vrsta energenata: <b
                                        v-html="selectedIzvor.vrstaEnergenata.value + ' [' + selectedIzvor.vrstaEnergenata.metric + ']'" />
                                    <br>
                                    Potrošnja energenata: <b>{{ selectedIzvor.potrosnjaEnergenata }}</b> <br>
                                    Emisije: <b>{{ selectedIzvor.emisije }}</b>
                                </template>

                            </div>
                            <template #footer>
                                <button class="p-button p-component p-button-secondary" @click="deleteIzvor">
                                    Ukloni
                                </button>
                                <button class="submitBtn" @click="deleteIzvorDialog = false">
                                    Odustani
                                </button>
                            </template>
                        </Dialog>
                    </div>
                </section>
                <section id="ukupni-utrosak">
                    <div>
                        <h2>Ukupni utrošak</h2>
                        <p>Ukupan prikaz stakleničkih plinova - opseg 1</p>
                    </div>
                    <div class="datatable">

                        <DataTable :value="groupedData" row-group-mode="rowspan" group-rows-by="category"
                            sort-mode="single" sort-field="category" :sort-order="1" scrollable scroll-height="400px"
                            table-style="min-width: 50rem" show-gridlines> <!--showGridlines column-resize-mode="fit"-->
                            <template #empty> Nema podataka za prikaz </template>
                            <Column header="No." header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

                            <!-- Kategorije (Sva vozila, Stacionarni izvori) -->
                            <Column field="category" header="Kategorija">
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.category === 'Sva vozila'">
                                        <font-awesome-icon icon="car" /> {{ slotProps.data.category }}
                                    </span>
                                    <span v-else-if="slotProps.data.category === 'Stacionarni izvori'">
                                        <font-awesome-icon icon="charging-station" /> {{ slotProps.data.category }}
                                    </span>
                                </template>
                            </Column>

                            <!-- Podkategorije (Vrste vozila, Vrste energenata) -->
                            <Column field="type" header="Vrsta vozila/energenata" />

                            <Column field="metric" header="Mjerna jedinica">
                                <template #body="slotProps">
                                    <span v-html="slotProps.data.metric" />
                                </template>
                            </Column>



                            <!-- Emisije po podkategorijama -->
                            <Column field="totalEmissions" header="Ukupne emisije (CO2/kg)">
                                <template #body="slotProps">
                                    <span>{{ slotProps.data.emisije.toFixed(2) }}</span>
                                </template>
                            </Column>

                            <!-- Grupni footer za svaku kategoriju -->
                            <template #groupfooter>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    dada
                                </div>
                            </template>


                            <!-- Ukupne emisije za sve kategorije -->
                            <template #footer>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    Ukupno: <strong>{{ calculateTotalEmissions().toFixed(2)
                                        }}</strong> CO<sub>2</sub>/kg
                                </div>
                            </template>

                        </DataTable>
                    </div>
                </section>
            </div>
            <div class="stats-content">
                <div>
                    <span class="stats-title">
                        <font-awesome-icon icon="chart-pie" />
                        <h2 style="border-bottom: none; padding: 0">Statistika</h2>
                    </span>
                    <p>Prikaz statističkih podataka za navedene kategorije opsega 1</p>
                </div>
                <hr>
                <div class="stats-table">
                    <div class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub>/kg - Sva vozila</p>
                        </span>
                        <Chart type="pie" :data="vozilaChartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>

                    <div class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub>/kg - Stacionarni izvori</p>
                        </span>
                        <Chart type="pie" :data="izvoriChartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

definePageMeta({
    middleware: [
        'auth',
    ],
});

const setChartData = (labels, data, backgroundColors) => {
    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors.map(color => color) // Možeš dodati nijanse ako želiš
            }
        ]
    };
};

const setChartOptions = () => {
    if (import.meta.client) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');

        return {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    // Fallback if it's on the server
    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: '#000' // Default color in case of server-side rendering
                }
            }
        }
    };
};

// Izračun emisija po podkategorijama za vozila
const vozilaEmisije = computed(() => {
    return vrsteVozila.value.map(type => calculateSubcategoryEmissions('vozila', type.value));
});

// Izračun emisija po podkategorijama za stacionarne izvore
const izvoriEmisije = computed(() => {
    return vrsteEnergenata.value.map(type => calculateSubcategoryEmissions('izvori', type.value));
});

// Graf za kategoriju 'Sva vozila'
const vozilaChartData = computed(() => {
    return setChartData(
        ['Osobno vozilo', 'Teretno vozilo', 'Stroj'],
        vozilaEmisije.value,
        ['#2cc23f', '#1e822a', '#0f4215'] // Boje za pie chart
    );
});

// Graf za kategoriju 'Stacionarni izvori'
const izvoriChartData = computed(() => {
    return setChartData(
        vrsteEnergenata.value.map(type => type.label),
        izvoriEmisije.value,
        ['#f78e3d', '#e8501e', '#b23b16'] // Možeš prilagoditi boje za stacionarne izvore
    );
});

const chartData = ref();
const chartOptions = setChartOptions();

const props = defineProps({
    sectionTitle: String,
});

const activeSectionTitle = ref('Opseg 1' || props.sectionTitle);

// Pratimo promjene prop-a
watch(() => props.sectionTitle, (newTitle) => {
    activeSectionTitle.value = newTitle;
});

const getVehicleIcon = (vrstaVozila) => {
    switch (vrstaVozila) {
        case 'Osobno':
            return 'car-side'; // Ikona za osobno vozilo
        case 'Teretno':
            return 'truck'; // Ikona za teretno vozilo
        case 'Stroj':
            return 'tractor'; // Ikona za stroj
        default:
            return 'car'; // Default ikona ako nije specificirano
    }
};

const getIzvorIcon = (vrstaIzvora) => {
    switch (vrstaIzvora) {
        case 'Ulje':
            return 'oil-can'; // Ikona za osobno vozilo
        case 'Plin':
            return 'gas-pump'; // Ikona za teretno vozilo
        case 'Unp':
            return 'bottle-droplet'; // Ikona za stroj
        default:
            return null; // Default ikona ako nije specificirano
    }
};


const vozila = ref([
    { id: 1, redniBroj: 1, vrstaVozila: 'Osobno vozilo', gorivo: 'Benzin', potroseneLitre: 200, emisije: 48.6 },
    { id: 2, redniBroj: 2, vrstaVozila: 'Osobno vozilo', gorivo: 'Dizel', potroseneLitre: 400, emisije: 97.2 },
]);

const vrsteGoriva = ref([
    { label: 'Benzin', value: 'Benzin' },
    { label: 'Dizel', value: 'Dizel' },
]);

const vrsteVozila = ref([
    { label: 'Osobno', value: 'Osobno vozilo' },
    { label: 'Teretno', value: 'Teretno vozilo' },
    { label: 'Stroj', value: 'Stroj' },
]);

const izvori = ref([
    {
        id: 1,
        vrstaEnergenata: { label: 'Plin', value: 'Prirodni plin', metric: 'm<sup>3</sup>', metricHTML: 'm<sup>3</sup>' },
        potrosnjaEnergenata: 1200,
        emisije: 154.8
    },
    {
        id: 2,
        vrstaEnergenata: { label: 'Ulje', value: 'Loživo ulje', metric: 'L' },
        potrosnjaEnergenata: 800,
        emisije: 103.2
    }
]);

const izvor = ref({
    id: null,
    vrstaEnergenata: null,
    potrosnjaEnergenata: '',
    emisije: '',
})

const vrsteEnergenata = ref([
    { label: 'Ulje', value: 'Loživo ulje', metric: 'L' },
    { label: 'Plin', value: 'Prirodni plin', metric: 'm<sup>3</sup>', metricHTML: 'm<sup>3</sup>' },
    { label: 'Unp', value: 'UNP', metric: 'L' },
])

const izvorOptionLabel = (option) => {
    const metric = option.metric === 'm<sup>3</sup>' ? 'm3' : option.metric;
    return `${option.value} [${metric}]`;
};


const voziloDialogVisible = ref(false);
const deleteVoziloDialog = ref(false);
const izvorDialogVisible = ref(false);
const deleteIzvorDialog = ref(false);
const vozilo = ref({
    id: null,
    redniBroj: null,
    vrstaVozila: '',
    gorivo: '',
    potroseneLitre: '',
    emisije: '',
});
const selectedVozilo = ref(null);
const selectedIzvor = ref(null);

// Izvadi emisije po vrstama i ukupne emisije
const emissions = computed(() => totalEmissionsFromSources.value);
const total = computed(() => emissionsByType.value.totalEmissions);

const openNewVozilo = () => {
    resetVoziloForm();
    voziloDialogVisible.value = true;
};
const openNewIzvor = () => {
    resetVoziloForm();
    izvorDialogVisible.value = true;
};

const saveVozilo = () => {
    const potroseneLitreNum = parseFloat(vozilo.value.potroseneLitre);
    vozilo.value.emisije = potroseneLitreNum * 0.243;

    if (vozilo.value.id) {
        const index = vozila.value.findIndex(v => v.id === vozilo.value.id);
        if (index !== -1) vozila.value[index] = { ...vozilo.value };
    } else {
        vozilo.value.id = Date.now(); // Generiši ID
        vozilo.value.redniBroj = vozila.value.length + 1;
        vozila.value.push({ ...vozilo.value });
    }

    voziloDialogVisible.value = false;
};

const saveIzvor = () => {
    const potrosnjaEnergenataNum = parseFloat(izvor.value.potrosnjaEnergenata);
    izvor.value.emisije = potrosnjaEnergenataNum * 0.00243;

    if (izvor.value.id) {
        const index = izvori.value.findIndex(v => v.id === izvor.value.id);
        if (index !== -1) izvori.value[index] = { ...izvor.value };
    } else {
        izvor.value.id = Date.now(); // Generiši ID
        izvori.value.push({ ...izvor.value });
    }

    izvorDialogVisible.value = false;
}


const openVoziloDeleteDialog = () => {
    deleteVoziloDialog.value = true;
};
const openIzvorDeleteDialog = () => {
    deleteIzvorDialog.value = true;
};

const deleteVozilo = () => {
    const index = vozila.value.findIndex(v => v.id === selectedVozilo.value.id);
    if (index !== -1) {
        vozila.value.splice(index, 1);
    }
    deleteVoziloDialog.value = false;
    selectedVozilo.value = null; // Reset selected vozilo
};

const deleteIzvor = () => {
    const index = izvori.value.findIndex(v => v.id === selectedIzvor.value.id);
    if (index !== -1) {
        izvori.value.splice(index, 1);
    }
    deleteIzvorDialog.value = false;
    selectedIzvor.value = null; // Reset selected vozilo
};

const resetVoziloForm = () => {
    vozilo.value = {
        id: null,
        redniBroj: null,
        vrstaVozila: '',
        gorivo: '',
        potroseneLitre: '',
        emisije: '',
    };
};
const resetIzvorForm = () => {
    izvor.value = {
        id: null,
        vrstaEnergenata: '',
        potrosnjaEnergenata: '',
        emisije: '',
    };
};

// Grupiranje podataka u dvije kategorije
const groupedData = computed(() => {
    // Mapiramo sve podkategorije unutar kategorija
    const vozilaData = vrsteVozila.value.map(type => ({
        category: 'Sva vozila',
        type: type.value,
        metric: 'L',
        emisije: calculateSubcategoryEmissions('vozila', type.value)
    }));

    const izvoriData = vrsteEnergenata.value.map(type => ({
        category: 'Stacionarni izvori',
        type: type.value,
        metric: type.metric,
        emisije: calculateSubcategoryEmissions('izvori', type.value)
    }));

    return [...vozilaData, ...izvoriData];
});

// Funkcija koja računa ukupne emisije za svaku podkategoriju
const calculateSubcategoryEmissions = (category, type) => {
    if (category === 'vozila') {
        return vozila.value
            .filter(v => v.vrstaVozila === type)
            .reduce((total, v) => total + (v.emisije || 0), 0);
    } else if (category === 'izvori') {
        return izvori.value
            .filter(i => i.vrstaEnergenata.value === type)
            .reduce((total, i) => total + (i.emisije || 0), 0);
    }
    return 0;
};

// Funkcija koja računa ukupne emisije po kategoriji (Sva vozila ili Stacionarni izvori)
const calculateCategoryTotal = (category) => {
    if (category === 'Sva vozila') {
        return vozila.value.reduce((total, v) => total + (v.emisije || 0), 0);
    } else if (category === 'Stacionarni izvori') {
        return izvori.value.reduce((total, i) => total + (i.emisije || 0), 0);
    }
    return 0;
};

// Funkcija koja računa ukupne emisije za sve kategorije
const calculateTotalEmissions = () => {
    const totalVozila = vozila.value.reduce((total, v) => total + (v.emisije || 0), 0);
    const totalIzvori = izvori.value.reduce((total, i) => total + (i.emisije || 0), 0);
    return totalVozila + totalIzvori;
};


// Reagirati na promjene u vozilima i izvorima
watch([vozila, izvori], () => {
    console.log('Data has changed, re-calculating emissions...');
});

const emissionsByType = computed(() => {
    const result = {};
    let totalEmissions = 0;

    vozila.value.forEach((v) => {
        const vrsta = v.vrstaVozila;
        const emisije = v.emisije || 0;

        // Inicijaliziraj ili dodaj emisije za svaku vrstu
        if (!result[vrsta]) {
            result[vrsta] = 0;
        }
        result[vrsta] += emisije;
        totalEmissions += emisije; // Zbrajaj ukupne emisije
    });

    return {
        emissionsByType: result,
        totalEmissions,
    };
});

const totalEmissionsFromSources = computed(() => {
    let totalEmissions = 0;

    izvori.value.forEach((izvor) => {
        const emisije = izvor.emisije || 0;
        totalEmissions += emisije; // Zbrajaj emisije iz svakog izvora
    });

    return totalEmissions;
});


// // Pratimo promjene na popisu vozila
// watch(vozila, (newValue) => {
//     const updatedEmissionsByType = {};
//     let updatedTotal = 0;

//     // Iteriraj kroz vozila i zbrajaj emisije po vrstama
//     newValue.forEach((v) => {
//         const vrsta = v.vrstaVozila;
//         const emisije = v.emisije || 0;

//         // Ako tip vozila ne postoji, inicijaliziraj ga
//         if (!updatedEmissionsByType[vrsta]) {
//             updatedEmissionsByType[vrsta] = 0;
//         }
//         updatedEmissionsByType[vrsta] += emisije; // Zbrajaj emisije za tip vozila
//         updatedTotal += emisije; // Zbrajaj ukupne emisije
//     });

//     // Ažuriraj reaktivne varijable
//     emissionsByType.value = updatedEmissionsByType;
//     total.value = updatedTotal;
// });



// Prati promjene na odabranom vozilu

watch(selectedVozilo, (newValue) => {
    if (newValue) {
        vozilo.value = { ...newValue }; // Učitati podatke u formu
    } else {
        resetVoziloForm(); // Resetirati formu ako nema odabranog vozila
    }
});

watch(() => vozilo.value.potroseneLitre, (newVal) => {
    const potroseneLitreNum = parseFloat(newVal)
    vozilo.value.emisije = isNaN(potroseneLitreNum) ? 0 : potroseneLitreNum * 0.243
})

watch(() => izvor.value.potrosnjaEnergenata, (newVal) => {
    const potrosnjaEnergenataNum = parseFloat(newVal)
    izvor.value.emisije = isNaN(potrosnjaEnergenataNum) ? 0 : potrosnjaEnergenataNum * 0.129
})

</script>


<style scoped>
* {
    color: var(--text-color);
}

.body {
    position: relative;
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
    grid-column: span 2;
}

h2 {
    font-size: 16px;
    color: var(--kesp-primary);
}

main {
    display: grid;
    grid-template-columns: 1fr 0.2fr;
    grid-template-rows: min-content auto;
    gap: 34px;

    height: 100%;
}


main>div {
    width: 100%;
    height: 100%;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.stats-content {
    /* background-color: var(--bg-color); */
    padding: 20px;
    padding-top: 0px;
    /* border-radius: var(--border-form-radius); */
    /* border: var(--border); */
    max-width: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
}

.stats-content>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stats-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--kesp-primary);
}

.stats-title * {
    color: var(--kesp-primary);
}

.stats-table {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.chart-container>span {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.chart-h3 {
    color: var(--text-color);
}

hr {
    width: 100%;
    border: none;
    border-top: var(--border-line-sidebar);
}

h3 {
    font-weight: 500;
}

section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

section>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

p {
    opacity: 0.8;
}

sub,
sup {
    font-size: smaller;
}

.p-fluid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
}

.total-emissions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    /* text-transform: uppercase; */
}

.closeDialog,
.closeDialog * {
    font-size: 16px;
}

.dodaj-btn,
.ukloni-btn,
.submitBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    background-color: var(--primary-color);
    color: white;
}

.dodaj-btn *,
.submitBtn * {
    color: white;
}

.dodaj-btn:hover,
.submitBtn:hover {
    background-color: var(--primary-color-hover);
}

.dodaj-btn:active,
.submitBtn:active {
    background-color: var(--primary-color-focus);
}

.ukloni-btn {
    background-color: var(--red-soft);
    color: white;
}

.ukloni-btn * {
    color: white;
}

.ukloni-btn:hover {
    background-color: var(--red-hover);
}

.ukloni-btn:active {
    background-color: var(--red-focus);
}

.ukloni-btn:disabled {
    color: black;
    background-color: #b0b0b0;
    cursor: not-allowed;
}

.ukloni-btn:disabled * {
    color: black;
}

.dizel-tag {
    background-color: var(--text-color) !important;
    color: white;
    /* Ako želiš promijeniti i boju teksta */
}


footer {
    justify-content: flex-end;
}
</style>