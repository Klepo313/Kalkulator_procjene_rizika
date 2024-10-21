<template>
    <div class="body">
        <main>
            <h1>{{ activeSectionTitle }}</h1>

            <div class="main-content">
                <section>
                    <div>
                        <h2>Vremensko razdoblje izračuna</h2>
                        <p>Vremensko razdoblje za kojeg se unose podaci</p>
                    </div>
                    <div class="razdoblje">
                        <div>
                            <label for="startDate">Početni datum</label>
                            <DatePicker id="startDate" v-model="startDate" view="month" dateFormat="mm.yy" show-icon
                                fluid icon-display="input" placeholder="Početni datum" @change="onStartDateChange" />
                        </div>
                        <div>
                            <label for="endDate">Krajnji datum</label>
                            <DatePicker id="endDate" v-model="endDate" view="month" dateFormat="mm.yy" show-icon fluid
                                icon-display="input" placeholder="Krajnji datum" :disabled="!startDate"
                                :min-date="startDate" />
                        </div>
                    </div>
                </section>
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
                            <Column field="vrstaVozila" header="Skupina vozila" sortable>
                                <template #body="slotProps">
                                    <font-awesome-icon :icon="getVehicleIcon(slotProps.data.vozilo.skupina)"
                                        style="margin-right: 5px;" />
                                    {{ slotProps.data.vozilo.skupina }}
                                </template>
                            </Column>
                            <Column field="vrstaVozila" header="Vrsta vozila" sortable>
                                <template #body="slotProps">
                                    {{ slotProps.data.vozilo.vrsta }}
                                </template>
                            </Column>


                            <Column field="gorivo" header="Gorivo" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.gorivo.value"
                                        :class="{ 'dizel-tag': slotProps.data.gorivo.value === 'Dizel' }" />
                                </template>
                            </Column>
                            <Column field="potrosnjaGoriva" header="Ukupna potrošnja" sortable />
                            <Column field="gorivo" header="Mjerna jedinica" sortable>
                                <template #body="slotProps">
                                    <span v-html="slotProps.data.gorivo.metric" />
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
                                        Ukupno: <strong>{{ total.toFixed(2) }}</strong> CO<sub>2</sub>/kg
                                    </div>
                                </div>
                            </template>
                        </DataTable>


                        <!-- <div class="field">
                                    <label for="vrstaVozila">Skupina vozila</label>
                                    <Select id="vrstaVozila" v-model="vozilo.vozilo" :options="vrsteVozila"
                                        option-label="label" option-value="value" placeholder="Odaberi skupinu vozila"
                                        required>
                                    </Select>
                                </div>

                                <div class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <Select id="vrstaVozila" v-model="vozilo.vozilo" :options="vrsteVozila"
                                        option-label="label" option-value="value" placeholder="Odaberi vrstu vozila"
                                        required>
                                    </Select>
                                </div> -->

                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="voziloDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="resetVoziloForm">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="skupinaVozila">Skupina vozila</label>
                                    <Select id="skupinaVozila" v-model="vozilo.vozilo.skupina" :options="vrsteVozila"
                                        option-label="value" option-value="value" placeholder="Odaberi skupinu vozila"
                                        required @change="onSkupinaChange" />
                                </div>

                                <div v-if="odabranaSkupina?.children?.length > 0" class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <Select id="vrstaVozila" v-model="vozilo.vozilo.vrsta"
                                        :options="odabranaSkupina.children" option-label="value" option-value="value"
                                        placeholder="Odaberi vrstu vozila" required />
                                </div>

                                <div v-else-if="odabranaSkupina" class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <InputText id="vrstaVozila" v-model="vozilo.vozilo.vrsta"
                                        placeholder="Unesi vrstu vozila" required />
                                </div>

                                <div class="field">
                                    <label for="gorivo">Gorivo</label>
                                    <Select id="gorivo" v-model="vozilo.gorivo.value" :options="vrsteGoriva"
                                        option-label="label" option-value="value" placeholder="Odaberi vrstu goriva"
                                        required />
                                </div>

                                <div class="field">
                                    <label for="potrosnjaGoriva">Ukupan broj potrošenih litara</label>
                                    <InputText id="potrosnjaGoriva" v-model="vozilo.potrosnjaGoriva"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required :disabled="!vozilo.gorivo || !vozilo.gorivo.value" />
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
                                <template v-if="selectedVozilo">
                                    Skupina vozila: <b>{{ selectedVozilo.vozilo.skupina }}</b> <br>
                                    Vrsta vozila: <b>{{ selectedVozilo.vozilo.vrsta }}</b> <br>
                                    Gorivo: <b>{{ selectedVozilo.gorivo.value }}</b> <br>
                                    Potrošnja goriva: <b>{{ selectedVozilo.potrosnjaGoriva + ' ' +
                                        selectedVozilo.gorivo.metric }}</b> <br>
                                    Emisije: <b>{{ selectedVozilo.emisije }}</b>
                                </template>
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
                            <Column field="gorivo" header="Vrsta goriva">
                                <template #body="slotProps">
                                    {{ slotProps.data.vrstaGoriva }}
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

                        <!-- Dialog za Dodavanje/Uređivanje izvora -->
                        <Dialog v-model:visible="izvorDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="resetIzvorForm">
                            <form class="p-fluid" @submit.prevent="saveIzvor">
                                <div class="field">
                                    <label for="vrstaGoriva">Vrsta goriva</label>
                                    <InputText id="vrstaGoriva" v-model="izvor.vrstaGoriva"
                                        placeholder="Unesi vrstu goriva" type="text" required />
                                </div>

                                <div class="field">
                                    <label for="vrstaEnergenata">Vrsta energenata</label>
                                    <Select id="vrstaEnergenata" v-model="izvor.vrstaEnergenata"
                                        :options="vrsteEnergenata" option-label="value"
                                        placeholder="Odaberi vrstu energenta" required
                                        @change="console.log(izvor.vrstaEnergenata)">
                                        <!-- Prikazivanje opcija u dropdownu -->
                                        <template #option="slotProps">
                                            <span>{{ slotProps.option.value }} [{{ slotProps.option.metric }}]</span>
                                        </template>
                                        <!-- Prikazivanje odabrane opcije -->
                                        <template #item="slotProps">
                                            <span v-if="slotProps.modelValue">
                                                {{ slotProps.modelValue.value }} [{{ slotProps.modelValue.metric }}]
                                            </span>
                                        </template>
                                    </Select>
                                </div>

                                <div class="field">
                                    <label for="potrosnjaGoriva">Potrošnja energenata</label>
                                    <InputText id="potrosnjaGoriva" v-model="izvor.potrosnjaEnergenata"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required
                                        :disabled="!izvor.vrstaEnergenata || !izvor.vrstaEnergenata.value" />
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
                                    Vrsta goriva: <b>{{ selectedIzvor.vrstaGoriva }}</b> <br>
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
                <!-- <section id="ukupni-utrosak">
                    <div>
                        <h2>Ukupni utrošak opsega 1</h2>
                        <p>Ukupan prikaz stakleničkih plinova - opseg 1</p>
                    </div>
                    <div class="datatable">

                        <DataTable :value="groupedData" row-group-mode="rowspan" group-rows-by="category"
                            sort-mode="single" sort-field="category" :sort-order="1" scrollable scroll-height="400px"
                            table-style="min-width: 50rem" show-gridlines>
                            <template #empty> Nema podataka za prikaz </template>
                            <Column header="No." header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

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

                            <Column field="type" header="Vrsta vozila/energenata" />

                            <Column field="metric" header="Mjerna jedinica">
                                <template #body="slotProps">
                                    <span v-html="slotProps.data.metric" />
                                </template>
                            </Column>

                            <Column field="totalEmissions" header="Ukupne emisije (CO2/kg)">
                                <template #body="slotProps">
                                    <span>{{ slotProps.data.emisije.toFixed(2) }}</span>
                                </template>
                            </Column>

                            <template #groupfooter>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    dada
                                </div>
                            </template>

                            <template #footer>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    Ukupno: <strong>{{ calculateTotalEmissions().toFixed(2)
                                        }}</strong> CO<sub>2</sub>/kg
                                </div>
                            </template>

                        </DataTable>
                    </div>
                </section> -->
            </div>
            <div class="stats-content">
                <div>
                    <span class="stats-title">
                        <font-awesome-icon icon="chart-pie" />
                        <h2 style="border-bottom: none; padding: 0">Statistika</h2>
                    </span>
                    <!-- <p>Prikaz statističkih podataka za navedene kategorije opsega 1</p> -->
                </div>
                <hr>
                <div class="stats-table">
                    <div class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub>/kg - Sva vozila</p>
                        </span>
                        <Chart type="pie" :data="vozilaChartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>

                    <div class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Emisije CO<sub>2</sub>/kg - Stacionarni izvori</p>
                        </span>
                        <Chart type="pie" :data="izvoriChartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>
                </div>
            </div>
            <button>Spremi</button>
        </main>
        <footer />
    </div>
</template>

<script setup>
import Column from 'primevue/column';
import { ref, watch } from 'vue';
import { useKespStore } from '~/stores/main-store';

definePageMeta({
    middleware: [
        'auth',
    ],
});

const kespStore = useKespStore();

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
        ['#8d813b', '#baac5a', '#575024'] // Možeš prilagoditi boje za stacionarne izvore
    );
});

const chartOptions = setChartOptions();

const props = defineProps({
    sectionTitle: String,
});

const activeSectionTitle = ref('Opseg 1');

const startDate = ref(null);
const endDate = ref(null);

// Funkcija za upravljanje promjenom početnog datuma
const onStartDateChange = () => {
    // Ako je postavljen novi početni datum, resetuj krajnji datum
    if (endDate.value && endDate.value < startDate.value) {
        endDate.value = null; // Resetuj krajnji datum ako je manji od novog početnog
    }
};

// Pratimo promjene prop-a
watch(() => props.sectionTitle, (newTitle) => {
    activeSectionTitle.value = newTitle;
});

const getVehicleIcon = (vrstaVozila) => {
    switch (vrstaVozila) {
        case 'Osobno vozilo':
            return 'car-side'; // Ikona za osobno vozilo
        case 'Teretno vozilo':
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
        case 'UNP':
            return 'bottle-droplet'; // Ikona za stroj
        default:
            return null; // Default ikona ako nije specificirano
    }
};


const vozila = ref([
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
]);

const vrsteGoriva = ref([
    { label: 'Benzin', value: 'Benzin', metric: 'L', koeficijent: 0.443 },
    { label: 'Dizel', value: 'Dizel', metric: 'L', koeficijent: 0.243 },
]);

const vrsteVozila = ref([
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
]);

const vrsteEnergenata = ref([
    { label: 'Plin', value: 'Prirodni plin', metric: 'm³', metricHTML: 'm<sup>3</sup>', koeficijent: 1.6 },
    { label: 'Ulje', value: 'Loživo ulje', metric: 'L', koeficijent: 2.6 },
    { label: 'UNP', value: 'UNP', metric: 'L', koeficijent: 3.6 },
]);

const izvori = ref([
    {
        id: 1,
        vrstaGoriva: 'Plinski bojler',
        vrstaEnergenata: {
            label: vrsteEnergenata.value[0].label,
            value: vrsteEnergenata.value[0].value,
            metric: vrsteEnergenata.value[0].metric,
            koeficijent: vrsteEnergenata.value[0].koeficijent
        },
        potrosnjaEnergenata: 1200,
        emisije: 154.8
    },
    {
        id: 2,
        vrstaGoriva: 'Termogen',
        vrstaEnergenata: {
            label: vrsteEnergenata.value[1].label,
            value: vrsteEnergenata.value[1].value,
            metric: vrsteEnergenata.value[1].metric,
            koeficijent: vrsteEnergenata.value[1].koeficijent
        },
        potrosnjaEnergenata: 800,
        emisije: 103.2
    }
]);

const izvor = ref({
    id: null,
    vrstaGoriva: '',
    vrstaEnergenata: { value: '', metric: '' },
    potrosnjaEnergenata: null,
    emisije: null,
})

// Varijabla za pohranu odabrane skupine vozila
const odabranaSkupina = ref(null);

// Funkcija koja se poziva kada korisnik promijeni skupinu vozila
const onSkupinaChange = () => {
    // Pronađi odabranu skupinu vozila unutar vrsteVozila niza
    odabranaSkupina.value = vrsteVozila.value.find(
        (skupina) => skupina.value === vozilo.value?.vozilo?.skupina
    );

    // Resetiraj odabranu vrstu vozila kada se promijeni skupina
    if (vozilo.value?.vozilo) {
        vozilo.value.vozilo.vrsta = '';
    }
};

const voziloDialogVisible = ref(false);
const deleteVoziloDialog = ref(false);
const izvorDialogVisible = ref(false);
const deleteIzvorDialog = ref(false);
const vozilo = ref({
    id: null,
    redniBroj: null,
    vozilo: { skupina: '', vrsta: '' }, // Ispravna inicijalizacija vozilo objekta
    gorivo: { value: '', metric: 'L' },
    potrosnjaGoriva: null,
    emisije: null
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
    // Pronađi koeficijent goriva na osnovu odabranog tipa goriva
    const odabranoGorivo = vrsteGoriva.value.find(g => g.value === vozilo.value.gorivo.value);

    const potroseneLitreNum = parseFloat(vozilo.value.potrosnjaGoriva);

    // Množenje potrošnje goriva s odgovarajućim koeficijentom goriva
    vozilo.value.emisije = isNaN(potroseneLitreNum) || !odabranoGorivo
        ? 0
        : potroseneLitreNum * odabranoGorivo.koeficijent;

    // Uvijek postavi 'L' kao metric za gorivo
    vozilo.value.gorivo.metric = 'L';

    if (vozilo.value.id) {
        const index = vozila.value.findIndex(v => v.id === vozilo.value.id);
        if (index !== -1) {
            vozila.value[index] = { ...vozilo.value };
        }
    } else {
        vozilo.value.id = Date.now(); // Generiši ID
        vozilo.value.redniBroj = vozila.value.length + 1;
        vozila.value.push({ ...vozilo.value });
    }

    voziloDialogVisible.value = false; // Zatvori dialog
    odabranaSkupina.value = null;
};



const saveIzvor = () => {
    const potrosnjaEnergenataNum = parseFloat(izvor.value.potrosnjaEnergenata);

    // Izračunaj emisije na temelju koeficijenta iz odabranog energenta
    if (izvor.value.vrstaEnergenata && potrosnjaEnergenataNum) {
        izvor.value.emisije = potrosnjaEnergenataNum * izvor.value.vrstaEnergenata.koeficijent;
    }

    if (izvor.value.id) {
        const index = izvori.value.findIndex(v => v.id === izvor.value.id);
        if (index !== -1) izvori.value[index] = { ...izvor.value };
    } else {
        izvor.value.id = Date.now(); // Generiši ID
        izvori.value.push({ ...izvor.value });
    }

    izvorDialogVisible.value = false;
};




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
    selectedIzvor.value = null;
};


// Funkcija za resetiranje forme
const resetVoziloForm = () => {
    vozilo.value = {
        id: null,
        redniBroj: null,
        vozilo: { skupina: '', vrsta: '' },
        gorivo: { value: '', metric: '' },
        potrosnjaGoriva: null,
        emisije: null,
    };
};
const resetIzvorForm = () => {
    izvor.value = {
        id: null,
        vrstaGoriva: '',
        vrstaEnergenata: { value: '', metric: '', koeficijent: 0 },
        potrosnjaEnergenata: '',
        emisije: '',
    };
};


// Grupiranje podataka u dvije kategorije
// const groupedData = computed(() => {
//     // Mapiramo sve podkategorije unutar kategorija
//     const vozilaData = vrsteVozila.value.map(type => ({
//         category: 'Sva vozila',
//         type: type.value,
//         metric: 'L',
//         emisije: calculateSubcategoryEmissions('vozila', type.value)
//     }));

//     const izvoriData = vrsteEnergenata.value.map(type => ({
//         category: 'Stacionarni izvori',
//         type: type.value,
//         metric: type.metric,
//         emisije: calculateSubcategoryEmissions('izvori', type.value)
//     }));

//     return [...vozilaData, ...izvoriData];
// });

// Funkcija koja računa ukupne emisije za svaku podkategoriju
const calculateSubcategoryEmissions = (category, type) => {
    console.log("calculateSubcategoryEmissions: ", category, type);
    if (category === 'vozila') {
        return vozila.value
            .filter(v => v.vozilo.skupina === type)
            .reduce((total, v) => total + (v.emisije || 0), 0);
    } else if (category === 'izvori') {
        return izvori.value
            .filter(i => i.vrstaEnergenata.value === type)
            .reduce((total, i) => total + (i.emisije || 0), 0);
    }
    return 0;
};

// Funkcija koja računa ukupne emisije po kategoriji (Sva vozila ili Stacionarni izvori)
// const calculateCategoryTotal = (category) => {
//     if (category === 'Sva vozila') {
//         return vozila.value.reduce((total, v) => total + (v.emisije || 0), 0);
//     } else if (category === 'Stacionarni izvori') {
//         return izvori.value.reduce((total, i) => total + (i.emisije || 0), 0);
//     }
//     return 0;
// };

// // Funkcija koja računa ukupne emisije za sve kategorije
// const calculateTotalEmissions = () => {
//     const totalVozila = vozila.value.reduce((total, v) => total + (v.emisije || 0), 0);
//     const totalIzvori = izvori.value.reduce((total, i) => total + (i.emisije || 0), 0);
//     return totalVozila + totalIzvori;
// };


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

watch(() => vozilo.value.potrosnjaGoriva, (newVal) => {
    const odabranoGorivo = vrsteGoriva.value.find(g => g.value === vozilo.value.gorivo.value);
    const potroseneLitreNum = parseFloat(newVal);

    // Ažuriraj emisije samo ako postoji odabrano gorivo i važeći unos potrošnje
    vozilo.value.emisije = isNaN(potroseneLitreNum) || !odabranoGorivo
        ? 0
        : potroseneLitreNum * odabranoGorivo.koeficijent;
});


watch(() => izvor.value.potrosnjaEnergenata, (newVal) => {
    const potrosnjaEnergenataNum = parseFloat(newVal);
    const odabraniEnergent = vrsteEnergenata.value.find(e => e.value === izvor.value.vrstaEnergenata.value);
    console.log(potrosnjaEnergenataNum, odabraniEnergent);

    if (odabraniEnergent && !isNaN(potrosnjaEnergenataNum)) {
        izvor.value.emisije = potrosnjaEnergenataNum * odabraniEnergent.koeficijent;
    } else {
        izvor.value.emisije = 0;
    }
});

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

.razdoblje {
    max-width: 500px;

    display: flex;
    flex-direction: row;
    align-items: center;
}

.razdoblje>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
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