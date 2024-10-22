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
                        <!-- <VremenskoRazdoblje /> -->
                        <span>
                            <label for="godina">
                                Godina<span class="required">*</span>
                            </label>
                            <DatePicker v-model="godina" show-icon fluid icon-display="input" view="year"
                                date-format="yy" placeholder="Godina izračuna" readonly @change="onYearChange" />
                        </span>
                        <div>
                            <div>
                                <label for="startDate">
                                    Početak razdoblja<span class="required">*</span>
                                </label>
                                <DatePicker id="startDate" v-model="datumOd" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Početni datum" readonly />
                            </div>
                            <div>
                                <label for="endDate">
                                    Kraj razdoblja<span class="required">*</span>
                                </label>
                                <DatePicker id="endDate" v-model="datumDo" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Krajnji datum" readonly />
                            </div>
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
                        <DataTable v-model:selection="selectedVozilo" :value="vehicleStore.vozila" removable-sort
                            show-gridlines selection-mode="single" :rows="5" data-key="id"
                            @row-edit-save="onRowEditSave">
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

                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="voziloDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="vehicleStore.resetVoziloForm">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="skupinaVozila">Skupina vozila</label>
                                    <Select id="skupinaVozila" v-model="vehicleStore.vozilo.vozilo.skupina"
                                        :options="vehicleStore.vrsteVozila" option-label="value" option-value="value"
                                        placeholder="Odaberi skupinu vozila" required @change="onSkupinaChange" />
                                </div>

                                <div v-if="odabranaSkupina?.children?.length > 0" class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <Select id="vrstaVozila" v-model="vehicleStore.vozilo.vozilo.vrsta"
                                        :options="odabranaSkupina.children" option-label="value" option-value="value"
                                        placeholder="Odaberi vrstu vozila" required />
                                </div>

                                <div v-else-if="odabranaSkupina" class="field">
                                    <label for="vrstaVozila">Vrsta vozila</label>
                                    <InputText id="vrstaVozila" v-model="vehicleStore.vozilo.vozilo.vrsta"
                                        placeholder="Unesi vrstu vozila" required />
                                </div>

                                <div class="field">
                                    <label for="gorivo">Gorivo</label>
                                    <Select id="gorivo" v-model="vehicleStore.vozilo.gorivo.value"
                                        :options="vehicleStore.vrsteGoriva" option-label="label" option-value="value"
                                        placeholder="Odaberi vrstu goriva" required />
                                </div>

                                <div class="field">
                                    <label for="potrosnjaGoriva">Ukupan broj potrošenih litara</label>
                                    <InputText id="potrosnjaGoriva" v-model="vehicleStore.vozilo.potrosnjaGoriva"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required
                                        :disabled="!vehicleStore.vozilo.gorivo || !vehicleStore.vozilo.gorivo.value" />
                                </div>

                                <div class="field">
                                    <label for="emisije">Emisije CO2/kg</label>
                                    <InputText id="emisije" v-model="vehicleStore.vozilo.emisije"
                                        placeholder="Emisija CO2/kg" readonly />
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
                        <DataTable v-model:selection="selectedIzvor" :value="izvoriStore.izvori" removable-sort
                            show-gridlines selection-mode="single" :rows="5" data-key="id"
                            @row-edit-save="onRowEditSave">
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
                            :style="{ width: '450px' }" @hide="izvoriStore.resetIzvorForm">
                            <form class="p-fluid" @submit.prevent="saveIzvor">
                                <div class="field">
                                    <label for="vrstaGoriva">Vrsta goriva</label>
                                    <InputText id="vrstaGoriva" v-model="izvoriStore.izvor.vrstaGoriva"
                                        placeholder="Unesi vrstu goriva" type="text" required />
                                </div>

                                <div class="field">
                                    <label for="vrstaEnergenata">Vrsta energenata</label>
                                    <Select id="vrstaEnergenata" v-model="izvoriStore.izvor.vrstaEnergenata"
                                        :options="izvoriStore.vrsteEnergenata" option-label="value"
                                        placeholder="Odaberi vrstu energenta" required>
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
                                    <InputText id="potrosnjaGoriva" v-model="izvoriStore.izvor.potrosnjaEnergenata"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="0" required
                                        :disabled="!izvoriStore.izvor.vrstaEnergenata || !izvoriStore.izvor.vrstaEnergenata.value" />
                                </div>

                                <div class="field">
                                    <label for="emisije">Emisije CO2/kg</label>
                                    <InputText id="emisije" v-model="izvoriStore.izvor.emisije"
                                        placeholder="Emisija CO2/kg" readonly />
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
                                    Emisije: <b>{{ selectedIzvor.emisije }} CO<sub>2</sub>/kg</b>
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
            </div>
            <div class="stats-content">
                <!-- <div>
                    <span class="stats-title">
                        <font-awesome-icon icon="chart-pie" />
                        <h2 style="border-bottom: none; padding: 0">Statistika</h2>
                    </span>
                </div> -->
                <!-- <hr> -->
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
            <div class="spremiBtn-container">
                <button id="saveBtn" type="button" @click="saveFormData">
                    <font-awesome-icon icon="save" class="save-icon" />
                    Spremi
                </button>
                <span>
                    *Potrebno je popuniti sva obvezna polja (<span class="required">*</span>) kako bi se predložak mogao
                    spremiti i
                    kako biste mogli
                    nastaviti u sljedeći korak.
                </span>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useVehicleStore, useIzvoriStore, useOpseg2Store, useKespStore } from '~/stores/main-store';

definePageMeta({
    middleware: [
        'auth',
    ],
});

const vehicleStore = useVehicleStore();
const izvoriStore = useIzvoriStore();
const opseg2Store = useOpseg2Store();
const kespStore = useKespStore();

// Kompjutirane vrijednosti za pristup iz storea
// const godina = computed(() => kespStore.godina);
// const datumOd = computed(() => kespStore.datumOd);
// const datumDo = computed(() => kespStore.datumDo);

// Create computed properties for the store values
const godina = computed({
    get: () => kespStore.godina,
    set: (value) => kespStore.setGodina(value),
});

const datumOd = computed(() => kespStore.datumOd);
const datumDo = computed(() => kespStore.datumDo);



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
    return vehicleStore.vrsteVozila.map(type => calculateSubcategoryEmissions('vozila', type.value));
});

// Izračun emisija po podkategorijama za stacionarne izvore
const izvoriEmisije = computed(() => {
    return izvoriStore.vrsteEnergenata.map(type => calculateSubcategoryEmissions('izvori', type.value));
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
        izvoriStore.vrsteEnergenata.map(type => type.label),
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


// Varijabla za pohranu odabrane skupine vozila
const odabranaSkupina = ref(null);

// Funkcija koja se poziva kada korisnik promijeni skupinu vozila
const onSkupinaChange = () => {
    // Pronađi odabranu skupinu vozila unutar vrsteVozila niza
    odabranaSkupina.value = vehicleStore.vrsteVozila.find(
        (skupina) => skupina.value === vehicleStore.vozilo?.vozilo?.skupina
    );

    // Resetiraj odabranu vrstu vozila kada se promijeni skupina
    if (vehicleStore.vozilo?.vozilo) {
        vehicleStore.vozilo.vozilo.vrsta = '';
    }
};

const voziloDialogVisible = ref(false);
const deleteVoziloDialog = ref(false);
const izvorDialogVisible = ref(false);
const deleteIzvorDialog = ref(false);

const selectedVozilo = ref(null);
const selectedIzvor = ref(null);

// Izvadi emisije po vrstama i ukupne emisije
const emissions = computed(() => totalEmissionsFromSources.value);
const total = computed(() => emissionsByType.value.totalEmissions);

const openNewVozilo = () => {
    vehicleStore.resetVoziloForm();
    voziloDialogVisible.value = true;
};
const openNewIzvor = () => {
    izvoriStore.resetIzvorForm();
    izvorDialogVisible.value = true;
};

const saveVozilo = () => {
    // Pronađi koeficijent goriva na osnovu odabranog tipa goriva
    const odabranoGorivo = vehicleStore.vrsteGoriva.find(g => g.value === vehicleStore.vozilo.gorivo.value);

    const potroseneLitreNum = parseFloat(vehicleStore.vozilo.potrosnjaGoriva);

    // Množenje potrošnje goriva s odgovarajućim koeficijentom goriva
    vehicleStore.vozilo.emisije = isNaN(potroseneLitreNum) || !odabranoGorivo
        ? 0
        : potroseneLitreNum * odabranoGorivo.koeficijent;

    // Uvijek postavi 'L' kao metric za gorivo
    vehicleStore.vozilo.gorivo.metric = 'L';

    if (vehicleStore.vozilo.id) {
        const index = vehicleStore.vozila.findIndex(v => v.id === vehicleStore.vozilo.id);
        if (index !== -1) {
            vehicleStore.vozila[index] = { ...vehicleStore.vozilo };
        }
    } else {
        vehicleStore.vozilo.id = Date.now(); // Generiši ID
        vehicleStore.vozilo.redniBroj = vehicleStore.vozila.length + 1;
        vehicleStore.vozila.push({ ...vehicleStore.vozilo });
    }

    voziloDialogVisible.value = false; // Zatvori dialog
    odabranaSkupina.value = null;
};


const saveIzvor = () => {
    const potrosnjaEnergenataNum = parseFloat(izvoriStore.izvor.potrosnjaEnergenata);

    // Izračunaj emisije na temelju koeficijenta iz odabranog energenta
    if (izvoriStore.izvor.vrstaEnergenata && potrosnjaEnergenataNum) {
        izvoriStore.izvor.emisije = potrosnjaEnergenataNum * izvoriStore.izvor.vrstaEnergenata.koeficijent;
    }

    if (izvoriStore.izvor.id) {
        const index = izvoriStore.izvori.findIndex(v => v.id === izvoriStore.izvor.id);
        if (index !== -1) izvoriStore.izvori[index] = { ...izvoriStore.izvor };
    } else {
        izvoriStore.izvor.id = Date.now(); // Generiši ID
        izvoriStore.izvori.push({ ...izvoriStore.izvor });
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
    const index = vehicleStore.vozila.findIndex(v => v.id === selectedVozilo.value.id);
    if (index !== -1) {
        vehicleStore.vozila.splice(index, 1);
    }
    deleteVoziloDialog.value = false;
    selectedVozilo.value = null; // Reset selected vozilo
};

const deleteIzvor = () => {
    const index = izvoriStore.izvori.findIndex(v => v.id === selectedIzvor.value.id);
    if (index !== -1) {
        izvoriStore.izvori.splice(index, 1);
    }
    deleteIzvorDialog.value = false;
    selectedIzvor.value = null;
};

// Funkcija koja računa ukupne emisije za svaku podkategoriju
const calculateSubcategoryEmissions = (category, type) => {
    if (category === 'vozila') {
        return vehicleStore.vozila
            .filter(v => v.vozilo.skupina === type)
            .reduce((total, v) => total + (v.emisije || 0), 0);
    } else if (category === 'izvori') {
        return izvoriStore.izvori
            .filter(i => i.vrstaEnergenata.value === type)
            .reduce((total, i) => total + (i.emisije || 0), 0);
    }
    return 0;
};

const emissionsByType = computed(() => {
    const result = {};
    let totalEmissions = 0;

    vehicleStore.vozila.forEach((v) => {
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

    izvoriStore.izvori.forEach((izvor) => {
        const emisije = izvor.emisije || 0;
        totalEmissions += emisije; // Zbrajaj emisije iz svakog izvora
    });

    return totalEmissions;
});


// Prati promjene na odabranom vozilu
watch(selectedVozilo, (newValue) => {
    if (newValue) {
        vehicleStore.vozilo = { ...newValue }; // Učitati podatke u formu
    } else {
        vehicleStore.resetVoziloForm(); // Resetirati formu ako nema odabranog vozila
    }
});

watch(() => vehicleStore.vozilo.potrosnjaGoriva, (newVal) => {
    const odabranoGorivo = vehicleStore.vrsteGoriva.find(g => g.value === vehicleStore.vozilo.gorivo.value);
    const potroseneLitreNum = parseFloat(newVal);

    // Ažuriraj emisije samo ako postoji odabrano gorivo i važeći unos potrošnje
    vehicleStore.vozilo.emisije = isNaN(potroseneLitreNum) || !odabranoGorivo
        ? 0
        : potroseneLitreNum * odabranoGorivo.koeficijent;
});


watch(() => izvoriStore.izvor.potrosnjaEnergenata, (newVal) => {
    const potrosnjaEnergenataNum = parseFloat(newVal);
    const odabraniEnergent = izvoriStore.vrsteEnergenata.find(e => e.value === izvoriStore.izvor.vrstaEnergenata.value);

    if (odabraniEnergent && !isNaN(potrosnjaEnergenataNum)) {
        izvoriStore.izvor.emisije = potrosnjaEnergenataNum * odabraniEnergent.koeficijent;
    } else {
        izvoriStore.izvor.emisije = 0;
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
    flex-direction: column;
    gap: 10px;
}

.razdoblje>div,
.razdoblje>div>div,
.razdoblje>span {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.razdoblje>div {
    flex-direction: row;
}

.razdoblje>span {
    width: auto;
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

.spremiBtn-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.spremiBtn-container span {
    font-style: italic;
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

strong {
    /* color: green; */
    text-decoration: underline;
    font-size: 16px;
}

.required {
    color: var(--red-soft);
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


#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
    font-weight: 500;

    background-color: var(--kesp-primary);
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

#saveBtn * {
    color: white;
}


#saveBtn:hover {
    background-color: var(--kesp-primary-hover);
    color: white;
}

#saveBtn:hover>.save-icon {
    color: white;
}

#saveBtn:active {
    background-color: var(--kesp-primary-focus);
}


#saveBtn:disabled {
    background: rgb(216, 216, 216);
    /* Svijetlo siva pozadina */
    color: var(--text-color);
    /* border: none; */
    /* Boja teksta */
    cursor: not-allowed;
    /* Pokazivač miša pokazuje da nije moguće kliknuti */
    pointer-events: none;
    /* Onemogućava sve interakcije miša */
    opacity: 0.6;
    /* Smanjena vidljivost */
}

#saveBtn:disabled * {
    color: var(--text-color);
}

#saveBtn:disabled:hover,
#saveBtn:disabled:active,
#saveBtn:disabled>.save-icon {
    background-color: rgb(232, 232, 232);
    /* Uklanja hover i active efekte */
    color: var(--text-color);
    /* Zadržava boju teksta */
}


footer {
    justify-content: flex-end;
}
</style>