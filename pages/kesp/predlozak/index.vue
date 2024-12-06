<template>
    <div class="body">
        <main>
            <h1>{{ activeSectionTitle }}</h1>
            <Toast />
            <div class="main-content">
                <section>
                    <div>
                        <h2>Vremensko razdoblje izračuna</h2>
                        <p>Vremensko razdoblje za kojeg se unose podaci</p>
                    </div>
                    <div class="razdoblje">
                        <!-- <VremenskoRazdoblje /> -->
                        <!-- <span>
                            <label for="godina">
                                Godina<span class="required">*</span>
                            </label>
                            <DatePicker v-model="godina" show-icon fluid icon-display="input" view="year"
                                date-format="yy" placeholder="Godina izračuna" readonly @change="onYearChange" />
                        </span> -->
                        <div>
                            <div>
                                <label for="startDate">
                                    Početak razdoblja: <!--<span class="required">*</span>-->
                                </label>
                                <DatePicker id="startDate" v-model="datumOd" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Početni datum" readonly />
                            </div>
                            <div>
                                <label for="endDate">
                                    Kraj razdoblja: <!--<span class="required">*</span>-->
                                </label>
                                <DatePicker id="endDate" v-model="datumDo" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Krajnji datum" readonly />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="sva-vozila">
                    <div>
                        <h2>Izravne emisije stakleničkih plinova</h2>
                        <p>Emisije iz izvora stakleničkih plinova u vlasništvu ili pod kontrolom
                            organizacije:</p>
                        <ul>
                            <li>Izravne emisije iz pokretnih energetskih izvora (vozila, pokretni strojevi i oprema)
                            </li>
                            <li>Izravne emisije iz nepokretnih energetskih izvora
                                <ul>
                                    <li>Točkasti: postrojenja, tehnološki procesi, industrijski pogoni, uređaji,
                                        građevine i sl.</li>
                                    <li>Difuzni: uređaji, određene aktivnosti, površine i druga mjesta</li>
                                </ul>
                            </li>
                            <li>Izravne fugitivne emisije (emisija iz rashladnih uređaja i postrojenja te protupožarnih
                                aparata)</li>
                        </ul>
                    </div>
                    <div class="datatable">
                        <!-- Toolbar za Dodavanje/Uklanjanje vozila -->
                        <Toolbar class="mb-6" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" @click="openNewVozilo">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj emisiju
                                </button>
                            </template>
                            <template #end>
                                <!-- <button class="edit-btn" :disabled="!selectedVozilo" @click="enableEdit">
                                    <font-awesome-icon icon="pen-to-square" /> Uredi vozilo
                                </button> -->
                                <button class="ukloni-btn" :disabled="!selectedVozilo" @click="openVoziloDeleteDialog">
                                    <font-awesome-icon icon="minus" /> Ukloni emisiju
                                </button>
                            </template>
                        </Toolbar>

                        <!-- DataTable za prikaz vozila -->
                        <DataTable v-model:selection="selectedVozilo" selection-mode="single" :sort-order="1"
                            :value="vozila" removable-sort show-gridlines :rows="5" data-key="id" striped-rows
                            @cell-edit-complete="onCellEditComplete">
                            <template #empty> Nema odabranih vozila </template>
                            <!--  row-group-mode="rowspan" group-rows-by="izvor" -->

                            <Column header="Broj">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="izvor" header="Izvor emisija" min-width="100px" sortable>
                                <template #body="slotProps">
                                    <div style="display: flex; align-items: center; gap: 5px;">
                                        <font-awesome-icon :icon="getVehicleIcon(slotProps.data.vozilo.skupina)"
                                            style="margin-right: 5px;" />
                                        <span>
                                            {{ slotProps.data.vozilo.skupina }}
                                        </span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="vrstaVozila" header="Vrsta izvora" sortable>
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.vozilo.vrsta">
                                        {{ slotProps.data.vozilo.vrsta }}
                                    </span>
                                    <span v-else style="font-style: italic; opacity: 0.6;">
                                        Nije odabrano
                                    </span>
                                </template>
                            </Column>

                            <Column field="gorivo" header="Energent" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.gorivo.label" :class="[
                                        {
                                            'dizel-tag': slotProps.data.gorivo.label === (
                                                'Dizel' || 'Biodizel' || 'B20 biodizel' || 'Biodizel'
                                            )
                                        },
                                        { 'jet-tag': slotProps.data.gorivo.label === 'JETFU' },
                                        { 'lozulje-tag': slotProps.data.gorivo.label === 'Lož ulje' },
                                        { 'lpg-tag': slotProps.data.gorivo.label === ('LNG' || 'LPG') },
                                        { 'cng-tag': slotProps.data.gorivo.label === 'CNG' },
                                        { 'etanol-tag': slotProps.data.gorivo.label === 'Etanol' },
                                    ]" />
                                </template>
                            </Column>
                            <Column field="potrosnjaGoriva" header="Potrošnja energenata" sortable
                                :editable="isEditing">
                                <template #editor="slotProps">
                                    <InputNumber v-model="slotProps.data.potrosnjaGoriva" mode="decimal"
                                        :show-buttons="true" min="0" @change="updateCell(slotProps.data)" />
                                </template>
                                <template #body="slotProps">
                                    <span>{{ slotProps.data.potrosnjaGoriva }}</span>
                                </template>
                            </Column>
                            <Column field="gorivo" header="Mjerna jedinica" sortable>
                                <template #body="slotProps">
                                    <span v-html="slotProps.data.gorivo.metric" />
                                </template>
                            </Column>
                            <Column field="emisije" header="Emisije CO₂/kg" sortable>
                                <template #body="slotProps">
                                    <span>{{ formatNumber(parseFloat(slotProps.data.emisije).toFixed(2)) }}</span>
                                </template>
                            </Column>
                            <Column header-style="width: 5rem; text-align: center"
                                body-style="text-align: center; overflow: visible">
                                <template #body="slotProps">
                                    <Button type="button" class="trash-btn" icon="pi pi-trash"
                                        style="border: none; background: none !important; color: var(--red-soft);"
                                        rounded @click="confirmDelete(slotProps.data)" />
                                </template>
                            </Column>
                            <template #footer>
                                <div class="total-emissions">
                                    <div>
                                        Ukupno: <strong>{{ formatNumber(total.toFixed(2)) }}</strong> CO<sub>2</sub>/kg
                                    </div> <!--.toFixed(2)-->
                                </div>
                            </template>
                        </DataTable>

                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="voziloDialogVisible" header="Dodaj emisiju" :modal="true"
                            :style="{ width: '450px' }" @hide="resetTempVozilo">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="skupinaVozila">Izvor emisija</label>
                                    <Select id="skupinaVozila" v-model="tempVozilo.vozilo.skupina"
                                        :options="vehicleStore.vrsteVozila" option-label="value" option-value="value"
                                        placeholder="Odaberi skupinu vozila" required @change="onSkupinaChange" />
                                </div>

                                <div v-if="odabranaSkupina?.children?.length > 0" class="field">
                                    <label for="vrstaVozila">Vozilo</label>
                                    <Select id="vrstaVozila" v-model="selectedVrsta" :options="odabranaSkupina.children"
                                        option-label="value" placeholder="Odaberi vrstu vozila" required
                                        @change="onVrstaChange" />

                                </div>

                                <div v-else-if="odabranaSkupina" class="field">
                                    <label for="vrstaVozila">
                                        {{ odabranaSkupina && odabranaSkupina.label != 'STACI' ?
                                            'Vozilo' : 'Izvori' }}
                                    </label>
                                    <InputText id="vrstaVozila" v-model="tempVozilo.vozilo.vrsta"
                                        :placeholder="odabranaSkupina && odabranaSkupina.label != 'STACI' ? 'Unesi vrstu vozila' : 'Unesi vrstu izvora'"
                                        required />
                                </div>

                                <div class="field">
                                    <label for="gorivo">
                                        {{ (odabranaSkupina?.children?.length > 0 && odabranaSkupina.label != 'STACI')
                                            || odabranaSkupina &&
                                            odabranaSkupina.label == 'STROJ' ?
                                            'Energent' : 'Energent' }}
                                    </label>
                                    <Select id="gorivo" v-model="tempVozilo.gorivo.label" :options="selectedFuelOptions"
                                        option-label="label" option-value="label"
                                        :placeholder="(odabranaSkupina?.children?.length > 0 && odabranaSkupina.label != 'STACI')
                                            || odabranaSkupina &&
                                            odabranaSkupina.label == 'STROJ' ? 'Odaberi vrstu energenta' : 'Odaberi vrstu energenta'" required
                                        :disabled="!tempVozilo.vozilo.skupina" @change="onGorivoChange" />
                                </div>

                                <div class="field">
                                    <label for="potrosnjaGoriva">Potrošnja energenata</label>
                                    <InputText id="potrosnjaGoriva" v-model="tempVozilo.potrosnjaGoriva"
                                        placeholder="Unesi ukupan broj potrošenih litara" type="number" step="any"
                                        min="1" required :disabled="!tempVozilo.gorivo || !tempVozilo.gorivo.value"
                                        onfocus="this.select()" />
                                </div>

                                <!-- <div class="field">
                                    <label for="emisije">Emisije CO2/kg</label>
                                    <InputText id="emisije" v-model="tempVozilo.emisije" :value="formattedEmisije"
                                        placeholder="Emisija CO₂/kg" required readonly />
                                </div> -->

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
                        <Dialog v-model:visible="deleteVoziloDialog" :style="{ width: '450px' }" header="Ukloni emisiju"
                            :modal="true">
                            <div class="flex items-center gap-4">
                                <i class="pi pi-exclamation-triangle !text-3xl" />
                                <template v-if="selectedVozilo">
                                    Izvor emisija: <b>{{ selectedVozilo.vozilo.skupina }}</b> <br>
                                    Emisija: <b>{{ selectedVozilo.vozilo.vrsta || '/' }}</b> <br>
                                    Energent: <b>{{ selectedVozilo.gorivo.label }}</b> <br>
                                    Potrošnja energenata: <b>{{ selectedVozilo.potrosnjaGoriva + ' ' +
                                        selectedVozilo.gorivo.metric }}</b> <br>
                                    Emisije CO<sub>2</sub>/kg: <b>{{ selectedVozilo.emisije }}</b>
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
            </div>
            <div class="stats-content">
                <div class="stats-table">
                    <!-- CO2 Emissions Chart -->
                    <div v-if="vozila.length" class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub>/kg</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>

                    <!-- Energy Consumption Chart -->
                    <div v-if="vozila.length" class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Potrošnja energenata</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('polar')" />
                        </span>
                        <Chart type="polarArea" :data="polarChartData" :options="chartOptions"
                            class="w-full md:w-[30rem]" />
                    </div>

                    <!-- Fullscreen Chart Modal -->
                    <div v-if="fullscreenChart" class="fullscreen-overlay" @click="closeFullscreen">
                        <div class="fullscreen-chart" @click.stop>
                            <font-awesome-icon icon="times" class="close-icon" @click="closeFullscreen" />
                            <span v-if="fullscreenChart === 'pie'">
                                <h2>Emisije CO<sub>2</sub>/kg</h2>
                            </span>
                            <span v-if="fullscreenChart === 'polar'">
                                <h2>Potrošnja energenata</h2>
                            </span>
                            <Chart v-if="fullscreenChart === 'pie'" type="pie" :data="chartData" :options="chartOptions"
                                class="fullscreen-chart-content" />
                            <Chart v-if="fullscreenChart === 'polar'" type="polarArea" :data="polarChartData"
                                :options="chartOptions" class="fullscreen-chart-content" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { addEmission, deleteEmission } from '~/service/kesp/postRequests';
import { useVehicleStore, useIzvoriStore, useOpseg2Store, useKespStore } from '~/stores/main-store';
import { shadeColor } from '~/utils/getColorClass';

definePageMeta({
    middleware: [
        'auth',
        'kesp'
    ],
});

const props = defineProps({
    sectionTitle: String,
    uiz_id: String,
});

const vehicleStore = useVehicleStore();
// const izvoriStore = useIzvoriStore();
const kespStore = useKespStore();

const toast = useToast();

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));
const vozila = computed(() => vehicleStore.vozila);
console.log("Evo vozila: ", vozila);
// const vrstaVozila = computed(() => vehicleStore.vrsteVozila);
const vrsteGoriva = computed(() => vehicleStore.vrsteGoriva);

const selectedFuelOptions = computed(() => {
    return vehicleStore.filteredVrsteGoriva;
});

const tempVozilo = ref({
    id: null,
    uiz_id: null,
    uge_id: null,
    vozilo: {
        id: null,
        skupina: '',
        vrsta: ''
    },
    gorivo: {
        id: null,
        uvg_id: null,
        label: '',
        value: '',
        metric: '',
    },
    potrosnjaGoriva: 0,
    emisije: 0.00
})

const resetTempVozilo = () => {
    tempVozilo.value = {
        id: null,
        uiz_id: null,
        uge_id: null,
        vozilo: {
            id: null,
            skupina: '',
            vrsta: ''
        },
        gorivo: {
            id: null,
            uvg_id: null,
            label: '',
            value: '',
            metric: '',
        },
        potrosnjaGoriva: 0,
        emisije: 0.00
    }
    odabranaSkupina.value = null;
}

// Computed property for handling placeholder vs value
const displayPotrosnjaGoriva = computed({
    get() {
        // Return empty string to show placeholder if value is 0
        return tempVozilo.value.potrosnjaGoriva === 0 ? '' : tempVozilo.value.potrosnjaGoriva;
    },
    set(value) {
        // Update the real value, parsing as a number
        tempVozilo.value.potrosnjaGoriva = value === '' ? 0 : parseFloat(value);
    },
});

// Method to select text on focus
function selectText(event) {
    event.target.select();
}

const formattedEmisije = computed(() => formatNumber(tempVozilo.value.emisije))

const kespId = ref(props.uiz_id);
// const kespId = ref(props.uiz_id == 'null' ? getIdFromUrl() : props.uiz_id);

watch(() => tempVozilo.value.gorivo.label, (newLabel) => {
    // Pronalazimo odgovarajući objekt u `vrsteGoriva` na osnovu `label`
    const odabranoGorivo = vehicleStore.vrsteGoriva.find(gorivo => gorivo.label === newLabel);

    // Ako je pronađeno odgovarajuće gorivo, ažuriramo sve podatke u `tempVozilo.value.gorivo`
    if (odabranoGorivo) {
        tempVozilo.value.gorivo.id = odabranoGorivo.id;
        tempVozilo.value.gorivo.label = odabranoGorivo.label;
        tempVozilo.value.gorivo.value = odabranoGorivo.value;
        tempVozilo.value.gorivo.metric = odabranoGorivo.metric;
        tempVozilo.value.gorivo.koeficijent = odabranoGorivo.koeficijent;
    } else {
        // Ako odabrano gorivo nije pronađeno, resetujemo `gorivo` podobjekt
        tempVozilo.value.gorivo = {
            id: null,
            label: '',
            value: '',
            metric: '',
            koeficijent: 0,
        };
    }
});

// Metoda za potvrdu brisanja
function confirmDelete(vozilo) {
    console.log("Vozilo za brisanje: ", vozilo);
    selectedVozilo.value = vozilo; // Postavite odabrano vozilo
    deleteVoziloDialog.value = true; // Otvorite dijalog
}

const chartData = computed(() => {
    const baseColor = '#241147';
    const emisijePoSkupini = {};

    console.log("Vozila: ", vozila.value);

    vozila.value.forEach((vozilo) => {
        const { skupina } = vozilo.vozilo;
        // console.log("Skupina: ", skupina, "Emisije po skupini: ", emisijePoSkupini[skupina]);
        emisijePoSkupini[skupina] = (emisijePoSkupini[skupina] || 0) + vozilo.emisije;
    });

    const labels = Object.keys(emisijePoSkupini);
    const data = Object.values(emisijePoSkupini);
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10));

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            },
        ],
    };
});

const polarChartData = computed(() => {
    const baseColor = '#de9441';
    const potrosnjaPoSkupini = {};

    // Pravilno grupisanje potrošnje goriva po svakoj skupini
    vozila.value.forEach((vozilo) => {
        const { skupina } = vozilo.vozilo;
        const potrosnjaGoriva = parseFloat(vozilo.potrosnjaGoriva) || 0;
        potrosnjaPoSkupini[skupina] = (potrosnjaPoSkupini[skupina] || 0) + potrosnjaGoriva;
    });

    const labels = Object.keys(potrosnjaPoSkupini);
    const data = Object.values(potrosnjaPoSkupini);
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10));

    console.log("Potrošnja po skupini: ", potrosnjaPoSkupini, labels, data, colors);

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            },
        ],
    };
});

// Opcije za chart
const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

const activeSectionTitle = ref('Opseg 1');

// Pratimo promjene prop-a
watch(() => props.sectionTitle, (newTitle) => {
    activeSectionTitle.value = newTitle;
});

const getVehicleIcon = (vrstaVozila) => {
    switch (vrstaVozila) {
        case 'Osobna vozila':
            return 'car-side'; // Ikona za osobno vozilo
        case 'Teretna vozila':
            return 'truck'; // Ikona za teretno vozilo
        case 'Strojevi':
            return 'tractor'; // Ikona za stroj
        case 'Lož ulje':
            return 'oil-can'; // Ikona za osobno vozilo
        case ('Biodizel', 'B20 biodizel', 'Stacionarni izvori'):
            return 'gas-pump'; // Ikona za teretno vozilo
        case ('UNP', 'LPG', 'CNG', 'E85 Etanol'):
            return 'bottle-droplet'; // Ikona za stroj
        default:
            return 'car'; // Default ikona ako nije specificirano
    }
};

// Varijabla za pohranu odabrane skupine vozila
const odabranaSkupina = ref(null);

const onGorivoChange = () => {
    // Pronađi odabrano gorivo unutar filteredVrsteGoriva
    const odabranoGorivo = vehicleStore.filteredVrsteGoriva.find(
        (gorivo) => gorivo.label === tempVozilo.value.gorivo.label
    );

    if (odabranoGorivo) {
        // Ažuriraj sva polja u vozilo.gorivo
        tempVozilo.value.gorivo.id = odabranoGorivo.id;
        tempVozilo.value.gorivo.uvg_id = odabranoGorivo.uvg_id;
        tempVozilo.value.gorivo.value = odabranoGorivo.value;
        tempVozilo.value.gorivo.metric = odabranoGorivo.metric;
    } else {
        // Ako nije pronađeno, resetiraj gorivo
        tempVozilo.value.gorivo = {
            id: null,
            uvg_id: null,
            label: '',
            value: '',
            metric: '',
        };
    }

    console.log("Odabrano gorivo: ", tempVozilo.value.gorivo);
};

// Funkcija koja se poziva kada korisnik promijeni skupinu vozila
const onSkupinaChange = () => {
    // Pronađi odabranu skupinu vozila unutar vrsteVozila niza
    odabranaSkupina.value = vehicleStore.vrsteVozila.find(
        (skupina) => skupina.value === tempVozilo.value?.vozilo?.skupina
    );

    // Pridodaj uge_id za odabranu skupinu
    tempVozilo.value.uge_id = odabranaSkupina.value?.id;

    console.log("Odabrana skupina: ", odabranaSkupina.value);

    // Ažuriraj vrste goriva prema odabranoj skupini
    if (odabranaSkupina.value) {
        vehicleStore.filteredVrsteGoriva = vehicleStore.vrsteGoriva.filter(
            (gorivo) => gorivo.uge_id === odabranaSkupina.value.id
        );
    } else {
        vehicleStore.filteredVrsteGoriva = [];
    }

    // Resetiraj odabranu vrstu vozila kada se promijeni skupina
    if (tempVozilo.value?.vozilo) {
        tempVozilo.value.vozilo.vrsta = '';
        tempVozilo.value.gorivo.label = ''; // Resetiraj odabrano gorivo
    }
};

const selectedVrsta = ref(null);

const onVrstaChange = (event) => {
    // Prvo uzimamo odabranu opciju
    const odabranaOpcija = event.value; // Koristite event.value za Select

    console.log("Odabrana opcija: ", odabranaOpcija);

    // Provjerite je li odabrana opcija definirana
    if (odabranaOpcija) {
        // Postavite svojstva vozila iz odabrane opcije
        tempVozilo.value.vozilo.id = odabranaOpcija.id || null; // Id vozila
        tempVozilo.value.vozilo.vrsta = odabranaOpcija.value || ''; // Vrsta
    } else {
        // Ako ništa nije odabrano, resetirajte vozilo
        tempVozilo.value.vozilo.id = null;
        tempVozilo.value.vozilo.vrsta = '';
    }

    console.log("Status vozila nakon promjene emisije: ", tempVozilo.value);
};

const voziloDialogVisible = ref(false);
const deleteVoziloDialog = ref(false);
// const izvorDialogVisible = ref(false);
// const deleteIzvorDialog = ref(false);

const selectedVozilo = ref(null);
// const selectedIzvor = ref(null);

const isEditing = ref(false);

const enableEdit = () => {
    isEditing.value = true;
};

const onCellEditComplete = (event) => {
    // Kada je uređivanje ćelije završeno, onemogući uređivanje
    isEditing.value = false;
};

const updateCell = (updatedData) => {
    // Logika za ažuriranje podataka nakon uređivanja ćelije
    console.log("Ažurirani podaci:", updatedData);
    // Dodaj potrebnu logiku za spremanje ili ažuriranje vrijednosti na serveru ili stanju
};

// Izvadi emisije po vrstama i ukupne emisije
// const emissions = computed(() => totalEmissionsFromSources.value);
const total = computed(() => emissionsByType.value.totalEmissions);

const openNewVozilo = () => {
    resetTempVozilo();
    voziloDialogVisible.value = true;
};
// const openNewIzvor = () => {
//     izvoriStore.resetIzvorForm();
//     izvorDialogVisible.value = true;
// };

const showSuccess = (skupina, vrsta) => {
    toast.add({ severity: 'success', summary: 'Uspješno dodano', detail: `Izvor: ${skupina}\nVrsta: ${vrsta}`, life: 3000 });
};

const showDeleteVozilo = () => {
    toast.add({ severity: 'success', summary: 'Uspješno obrisano', detail: `Obrisano vozilo`, life: 3000 });
}

const showError = () => {
    toast.add({ severity: 'error', summary: 'Došlo je do greške', detail: `Nije uspješno izvršena radnja`, life: 3000 });
};


const saveVozilo = async () => {
    // Pronađi koeficijent goriva na osnovu odabranog tipa goriva
    const odabranoGorivo = vehicleStore.vrsteGoriva.find(g => g.label === tempVozilo.value.gorivo.label);

    const potroseneLitreNum = parseFloat(tempVozilo.value.potrosnjaGoriva) || 0;

    // Množenje potrošnje goriva s odgovarajućim koeficijentom goriva
    tempVozilo.value.emisije = odabranoGorivo
        ? potroseneLitreNum * odabranoGorivo.koeficijent
        : 0;

    // Uvijek postavi 'L' kao metric za gorivo
    tempVozilo.value.gorivo.metric = odabranoGorivo?.metric || '';

    if (tempVozilo.value.id) {
        const index = vehicleStore.vozila.findIndex(v => v.id === tempVozilo.value.id);
        if (index !== -1) {
            vehicleStore.vozila[index] = { ...tempVozilo.value };
        }
    } else {
        tempVozilo.value.id = Date.now(); // Generiši ID
        tempVozilo.value.redniBroj = vehicleStore.vozila.length + 1;
    }

    console.log("Vozilo objekt: ", tempVozilo.value);

    const data = {
        p_usi_id: null,
        p_uiz_id: kespId.value,
        p_uge_id: tempVozilo.value.uge_id,
        p_uvv_id: tempVozilo.value.vozilo.id === null
            ? null
            : tempVozilo.value.vozilo.id,
        p_uvv_naziv: tempVozilo.value.vozilo.vrsta,
        p_uvg_id: tempVozilo.value.gorivo.uvg_id === null
            ? null
            : tempVozilo.value.gorivo.uvg_id,
        p_kolicina: Number(tempVozilo.value.potrosnjaGoriva),
    }

    try {
        const response = await addEmission(data);

        const { id, status } = response;

        if (status === 200) {
            const usi_id = id;
            console.log("Vozilo ID: ", usi_id);

            tempVozilo.value.id = usi_id;
            vehicleStore.vozila.push({ ...tempVozilo.value });
            showSuccess(tempVozilo.value.vozilo.skupina, tempVozilo.value.vozilo.vrsta);
        } else {
            console.log("Greska pri dodavanju izračuna.");
            showError();
        }
    } catch (error) {
        console.log("Greska pri dodavanju izračuna.", error);
        showError();
    }

    console.log("Vozilo objekt nakon savea: ", tempVozilo.value);

    voziloDialogVisible.value = false; // Zatvori dialog
    odabranaSkupina.value = null;
};
const deleteVozilo = async () => {
    const index = vehicleStore.vozila.findIndex(v => v.id === selectedVozilo.value.id);
    if (index !== -1) {
        vehicleStore.vozila.splice(index, 1);
    }
    try {
        console.log("Vozilo za brisanje: ", selectedVozilo.value);
        const response = await deleteEmission(selectedVozilo.value.id);
        const { status } = response;

        if (status === 200) {
            showDeleteVozilo();
        } else {
            console.log("Greska pri brisanju stavke.");
            showError();
        }
    } catch (error) {
        console.log("Greska pri brisanju stavke.", error);
        showError();
    }
    deleteVoziloDialog.value = false;
    selectedVozilo.value = null; // Reset selected vozilo
};

const fullscreenChart = ref(null);

function openFullscreen(chartType) {
    fullscreenChart.value = chartType;
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

function closeFullscreen() {
    fullscreenChart.value = null;
    document.body.style.overflow = ''; // Re-enable scrolling
}

onBeforeUnmount(() => {
    document.body.style.overflow = ''; // Reset overflow on component unmount
});

const openVoziloDeleteDialog = () => {
    deleteVoziloDialog.value = true;
};

const emissionsByType = computed(() => {
    const result = {};
    let totalEmissions = 0;

    vehicleStore.vozila.forEach((v) => {
        const vrsta = v.vrstaVozila;
        const emisije = parseFloat(v.emisije) || 0;

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


// Prati promjene na odabranom vozilu
watch(selectedVozilo, (newValue) => {
    if (newValue) {
        tempVozilo.value = { ...newValue }; // Učitati podatke u formu
    } else {
        resetTempVozilo() // Resetirati formu ako nema odabranog vozila
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
    background-color: none;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.opisnap {
    width: 100%;
    grid-column: span 2;
}

textarea {
    resize: vertical;
    max-height: 100px;
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

.expand-icon,
.close-icon {
    padding: 7px;
    background-color: none;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    cursor: pointer;
}

.expand-icon:hover,
.close-icon:hover {
    background-color: var(--input-hover-color);
}

.expand-icon:active,
.close-icon:active {
    background-color: var(--input-focus-color);
}

.chart-container>span {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
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

p,
ul {
    opacity: 0.8;
}

ul {
    list-style-position: inside;
    list-style-type: disc;
    margin: 0;
    padding: 0 0 0 20px;
}

ul ul {
    list-style-type: circle;
    margin: 0;
    padding: 0 0 0 30px;
    opacity: 1;
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

.trash-btn {
    border: none;
    background-color: none;
    cursor: pointer;
    color: var(--red-soft);
}

.trash-btn:hover {
    background-color: rgb(234, 234, 234);
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
.submitBtn,
.edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    background-color: var(--kesp-primary);
    color: white;
}

.dodaj-btn *,
.submitBtn * {
    color: white;
}

.dodaj-btn:hover,
.submitBtn:hover {
    background-color: var(--kesp-primary-hover);
}

.dodaj-btn:active,
.submitBtn:active {
    background-color: var(--kesp-primary-focus);
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

.ukloni-btn:disabled,
.edit-btn:disabled {
    color: black;
    background-color: #b0b0b0;
    cursor: not-allowed;
}

.ukloni-btn:disabled *,
.edit-btn:disabled * {
    color: black;
}

.edit-btn {
    margin-right: 10px;
    background-color: var(--primary-color);
    color: white;
}

.edit-btn:hover {
    background-color: var(--primary-color-hover);
}

.edit-btn:active {
    background-color: var(--primary-color-focus);
}

.edit-btn>* {
    color: white;
}

.dizel-tag {
    background-color: var(--text-color) !important;
    color: white;
    /* Ako želiš promijeniti i boju teksta */
}

.jet-tag {
    background-color: lightskyblue;
    color: var(--text-color);
}

.lozulje-tag {
    background-color: gold;
    color: var(--text-color);
}

.lpg-tag,
.lng-tag {
    background-color: var(--red-soft);
    color: white;
}

.cng-tag {
    background-color: green;
    color: white;
}

.etanol-tag {
    background-color: lightslategray;
    color: white;
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

.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 26px;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

.fullscreen-chart {
    position: relative;

    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 26px;
    border-radius: 5px;
    animation: scaleUp 0.3s ease;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
}

.fullscreen-chart-content {
    margin: auto;
    width: 100%;
    height: 90%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.fullscreen-chart-content>canvas {
    margin: auto;
}

/* .fullscreen-chart-content>canvas {
    max-width: 30vw;
    max-height: 40vh;
} */

.close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleUp {
    from {
        transform: scale(0.8);
    }

    to {
        transform: scale(1);
    }
}
</style>