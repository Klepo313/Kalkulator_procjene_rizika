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

                        <!-- <Column field="izvor" header="Izvor emisija" min-width="100px" sortable>
                                <template #body="slotProps">
                                    <div style="display: flex; align-items: center; gap: 5px;">
                                        <font-awesome-icon :icon="getVehicleIcon(slotProps.data.uge_naziv)"
                                            style="margin-right: 5px;" />
                                        <span>
                                            {{ slotProps.data.uge_naziv }}
                                        </span>
                                    </div>
                                </template>
                            </Column> -->

                        <!-- DataTable za prikaz vozila -->
                        <DataTable v-model:selection="selectedVozilo" row-group-mode="subheader"
                            group-rows-by="uge_naziv" selection-mode="single" :sort-order="1" scrollable
                            scroll-height="800px" :value="vozila" removable-sort show-gridlines :rows="5"
                            data-key="usi_id" striped-rows>
                            <template #empty> Nema spremljenih emisija </template>
                            <template #loading> Učitavanje emisija. Molimo pričekajte. </template>
                            <!--  row-group-mode="rowspan" group-rows-by="izvor" -->
                            <template #groupheader="slotProps">
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <font-awesome-icon :icon="getVehicleIcon(slotProps.data.uge_naziv)"
                                        style="margin-right: 5px;" />
                                    <span>
                                        {{ slotProps.data.uge_naziv }}
                                    </span>
                                </div>
                            </template>
                            <template #groupfooter="slotProps">
                                <div
                                    style="width: 100%; text-align: right; display: flex; justify-content: space-between;">
                                    <!-- <font-awesome-icon :icon="getVehicleIcon(slotProps.data.uge_naziv)"
                                        style="margin-right: 5px;" /> -->
                                    Ukupno
                                    <strong style="margin-left: 5px;"> {{
                                        formatNumber(vehicleStore.emisijaZaKategoriju(slotProps.data.uge_naziv, 2))
                                    }}</strong>
                                </div>
                            </template>
                            <Column field="uge_naziv" header="Naziv" />
                            <Column header="Broj">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

                            <Column field="vrstaVozila" header="Vrsta izvora" sortable>
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.usi_uvv_naziv">
                                        {{ slotProps.data.usi_uvv_naziv }}
                                    </span>
                                    <span v-else style="font-style: italic; opacity: 0.6;">
                                        Nije odabrano
                                    </span>
                                </template>
                            </Column>

                            <Column field="gorivo" header="Energent" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.uvg_knaziv" :class="[
                                        {
                                            'etanol-tag': slotProps.data.uvg_knaziv === ('Etanol', 'Prirodni plin') ||
                                                odabranaSkupina?.uge_naziv == 'Staklenički plinovi (GWP)' &&
                                                slotProps.data.uvg_knaziv.charAt(0) !== 'R'
                                        },
                                        {
                                            'dizel-tag': slotProps.data.uvg_knaziv === (
                                                'Dizel' || 'Biodizel' || 'B20 biodizel' || 'Biodizel'
                                            )
                                        },
                                        { 'jet-tag': slotProps.data.uvg_knaziv === ('Jet Fuel', 'Gorivo za mlazne motore') },
                                        { 'lozulje-tag': slotProps.data.uvg_knaziv === 'Loživo ulje' },
                                        {
                                            'lpg-tag': slotProps.data.uvg_knaziv === ('LNG' || 'LPG') ||
                                                slotProps.data.uvg_knaziv.charAt(0) === 'R'
                                        },
                                        { 'cng-tag': slotProps.data.uvg_knaziv === ('CNG') },
                                    ]" />
                                </template>
                            </Column>
                            <Column field="potrosnjaGoriva" header="Potrošnja energenata" sortable>
                                <template #body="slotProps">
                                    <span v-if="Number(slotProps.data.usi_kolicina) == 0" style="opacity: 0.6;">
                                        {{ '/' }}
                                    </span>
                                    <span v-else>
                                        {{ formatNumber(slotProps.data.usi_kolicina, 2) }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="gorivo" header="Mjerna jedinica" sortable>
                                <template #body="slotProps">
                                    {{ slotProps.data.usi_jmj }}
                                </template>
                            </Column>
                            <Column field="emisije" header="Emisija eCO2/kg" sortable>
                                <template #body="slotProps">
                                    <span>{{ formatNumber(parseFloat(slotProps.data.usi_emisija, 2)) }}</span>
                                </template>
                            </Column>
                            <template #footer>
                                <div class="total-emissions">
                                    <div>
                                        Ukupno: <strong>{{ formatNumber(ukupnaEmisija, 2) }}</strong> eCO<sub>2</sub>/kg
                                    </div> <!--.toFixed(2)-->
                                </div>
                            </template>
                        </DataTable>

                        <!-- Dialog za Dodavanje/Uređivanje vozila -->
                        <Dialog v-model:visible="voziloDialogVisible" header="Dodaj emisiju" :modal="true"
                            :style="{ width: '500px' }" @hide="resetTempVozilo">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="skupinaVozila">Izvor emisija</label>
                                    <Select id="skupinaVozila" v-model="odabranaSkupina" :options="vrsteSkupina"
                                        option-label="uge_naziv" placeholder="Odaberi izvor emisije" required />
                                    <!--@change="onSkupinaChange"-->
                                </div>

                                <div class="field">
                                    <label for="vrstaVozila">
                                        {{ odabranaSkupina?.uge_lab_uvv || 'Vrsta emisije' }}
                                        <font-awesome-icon v-if="odabranaSkupina?.br_vozila && !vrsteEmisija"
                                            icon="spinner" spin />
                                    </label>
                                    <Select v-if="parseInt(odabranaSkupina?.br_vozila)" id="vrstaVozila"
                                        v-model="odabranaVrstaEmsiije" :options="vrsteEmisija" option-label="uvv_naziv"
                                        :placeholder="odabranaSkupina?.uge_plh_uvv || 'Vrsta emisije'"
                                        :disabled="!vrsteEmisija" required />
                                    <!--@change="onVrstaChange"-->
                                    <InputText v-else id="vrstaVozila" v-model="odabranaVrstaEmsiije"
                                        :placeholder="odabranaSkupina?.uge_plh_uvv || 'Vrsta emisije'"
                                        :disabled="!odabranaSkupina" required />
                                </div>

                                <div class="field">
                                    <label for="gorivo">
                                        {{ odabranaSkupina?.uge_lab_uvg || 'Energent' }}
                                        <font-awesome-icon
                                            v-if="odabranaVrstaEmsiije && (!vrsteEnergenata || !vrsteEnergenata.length)"
                                            icon="spinner" spin />
                                    </label>
                                    <Select id="gorivo" v-model="odabraniEnergent" :options="vrsteEnergenata"
                                        option-label="uvg_knaziv"
                                        :placeholder="odabranaSkupina?.uge_plh_uvg || 'Energent'" required
                                        :disabled="!vrsteEnergenata || !vrsteEnergenata.length">
                                        <!--@change="onGorivoChange"-->
                                        <template #option="slotProps">
                                            {{ slotProps.option?.uvg_knaziv }}/{{ slotProps.option?.uvg_jedmj }}
                                        </template>

                                    </Select>
                                </div>

                                <div v-if="!odabraniEnergent?.uvg_oznaka" class="field">
                                    <label for="potrosnjaGoriva">
                                        {{ odabranaSkupina?.uge_lab_unos || 'Potrošnja energenta' }}
                                        <!-- <span v-if="odabraniEnergent && !odabranaSkupina?.uge_lab_unos">[{{
                                            odabraniEnergent?.uvg_jedmj || '-' }}]</span> -->
                                    </label>
                                    <InputText id="potrosnjaGoriva" v-model="potrosnja" placeholder="0" type="number"
                                        step="any" min="1" required
                                        :disabled="!odabraniEnergent || Object.keys(odabraniEnergent).length == 0"
                                        onfocus="this.select()" />
                                </div>

                                <template v-if="odabraniEnergent?.uvg_oznaka">
                                    <div class="field">
                                        <span class="gwp-calc" @click="openGwpDialog()">
                                            <font-awesome-icon icon="calculator" class="calc-icon" />
                                            <span>Otvori kalkulator</span>
                                        </span>
                                    </div>
                                </template>

                                <div class="dialog-footer">
                                    <button type="button" class="p-button p-component p-button-secondary"
                                        @click="voziloDialogVisible = false">
                                        Odustani
                                    </button>
                                    <button class="submitBtn" type="submit" :disabled="!isFormDirty">Spremi</button>

                                </div>
                            </form>
                        </Dialog>

                        <!-- GWP Dialog -->
                        <Dialog v-model:visible="gwpDialogVisible" :style="{ minWidth: '1000px', maxWidth: '1400px' }"
                            header="Izračun emisija iz rashladnih uređaja" :modal="true" @hide="gwpDialogHide">
                            <span class="field">
                                <label for="vrstaSredstva">Vrsta rashladnog sredstva</label>
                                <InputText id="vrstaSredstva" v-model="odabraniEnergent" style="width: min-content;"
                                    :value="odabraniEnergent?.uvg_naziv" required readonly />
                            </span>
                            <DataTable v-model:editing-rows="gwpRed" data-key="uir_id" :value="gwpIzracuni"
                                edit-mode="row" @row-edit-save="onGwpIzracunSave" @row-edit-cancel="onGwpIzracunCancel">
                                <template #empty>
                                    Nema prethodnih izračuna
                                </template>
                                <Column field="uir_brjed" header="Broj jedinica" style="width: 10%; min-width: 8rem">
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" placeholder="0" min="1" fluid />
                                    </template>
                                </Column>
                                <Column field="ugr_naziv" header="Vrsta rashladnog uređaja"
                                    style="min-width: 12rem; max-width: 14rem;">
                                    <template #editor="{ data, field }">
                                        <Select v-model="data[field]" :options="vrsteRashUredjaja"
                                            option-label="ugr_naziv" option-value="ugr_naziv"
                                            placeholder="Vrsta rashladnog uređaja" fluid />
                                    </template>
                                </Column>
                                <Column field="uir_kapacitet" header="Količina rashladnog sredstva u sustavu (kg)"
                                    style="min-width: 8rem">
                                    <template #editor="{ data, field }">
                                        <InputNumber v-model="data[field]" placeholder="0" min="1" fluid />
                                    </template>
                                </Column>
                                <Column field="uir_ugradnja"
                                    header="Izvještajna godina bila je godina ugradnje rashladnih uređaja">
                                    <!--style="min-width: 8rem"-->
                                    <template #editor="{ data, field }">
                                        <Select v-model="data[field]" :options="daNeOpcije" option-label="value"
                                            option-value="label" placeholder="Da/Ne" fluid>
                                            <template #option="slotProps">
                                                <Tag :value="slotProps.option.value"
                                                    :severity="getStatusLabel(slotProps.option.label)" />
                                            </template>
                                        </Select>
                                    </template>
                                    <template #body="slotProps">
                                        <Tag :value="returnStatus(slotProps.data.uir_ugradnja)"
                                            :severity="getStatusLabel(slotProps.data.uir_ugradnja)" />
                                    </template>
                                </Column>
                                <Column field="uir_rad"
                                    header="Izvještajna godina bila je godina normalnog rada rashladnih uređaja">
                                    <template #editor="{ data, field }">
                                        <Select v-model="data[field]" :options="daNeOpcije" option-label="value"
                                            option-value="label" placeholder="Da/Ne" fluid>
                                            <template #option="slotProps">
                                                <Tag :value="slotProps.option.value"
                                                    :severity="getStatusLabel(slotProps.option.label)" />
                                            </template>
                                        </Select>
                                    </template>
                                    <template #body="slotProps">
                                        <Tag :value="returnStatus(slotProps.data.uir_rad)"
                                            :severity="getStatusLabel(slotProps.data.uir_rad)" />
                                    </template>
                                </Column>
                                <Column field="uir_kraj"
                                    header="Izvještajna godina bile je godina u kojoj se oprema demontirala/zbrinula">
                                    <template #editor="{ data, field }">
                                        <Select v-model="data[field]" :options="daNeOpcije" option-label="value"
                                            option-value="label" placeholder="Da/Ne" fluid>
                                            <template #option="slotProps">
                                                <Tag :value="slotProps.option.value"
                                                    :severity="getStatusLabel(slotProps.option.label)" />
                                            </template>
                                        </Select>
                                    </template>
                                    <template #body="slotProps">
                                        <Tag :value="returnStatus(slotProps.data.uir_kraj)"
                                            :severity="getStatusLabel(slotProps.data.uir_kraj)" />
                                    </template>
                                </Column>
                                <Column field="uir_emisija" header="Emisija eCO2/kg">
                                    <template #body="{ data, field }">
                                        <strong style="text-decoration: none; color: var(--kesp-primary);">{{
                                            formatNumber(data[field], 3) }}</strong>
                                    </template>
                                </Column>
                                <!--pcRowEditorInit, pcRowEditorSave, pcRowEditorCancel-->
                                <Column :row-editor="true" style="min-width: 4rem;" body-style="text-align:center" :pt="{
                                    root: {
                                        class: 'custom-icon-class'
                                    },
                                    // pcRowEditorInit: { class: 'custom-icon-class' },
                                    // pcRowEditorSave: { class: 'custom-icon-class' },
                                    // pcRowEditorCancel: { class: 'custom-icon-class' }
                                }">
                                    <template #roweditoriniticon>
                                        Uredi
                                    </template>
                                    <template #roweditorsaveicon>
                                        Dodaj
                                    </template>
                                    <template #roweditorcancelicon>
                                        Izbriši
                                    </template>
                                </Column>

                                <template #footer>
                                    <span class="gwp-calc" style="margin-top: 20px;" @click="addNewRow">
                                        <font-awesome-icon icon="plus" class="calc-icon" />
                                        <span>Dodaj izračun</span>
                                    </span>
                                </template>
                            </DataTable>
                            <template #footer>
                                <button class="p-button p-component p-button-secondary"
                                    @click="gwpDialogVisible = false">
                                    Odustani
                                </button>
                                <button class="submitBtn" :disabled="!needUpdate" @click="saveGwpIzracun">
                                    Spremi
                                </button>
                            </template>
                        </Dialog>

                        <!-- Confirm Dialog za brisanje -->
                        <Dialog v-model:visible="deleteVoziloDialog" :style="{ width: '450px' }" header="Ukloni emisiju"
                            :modal="true">
                            <div class="flex items-center gap-4">
                                <template v-if="selectedVozilo">
                                    Izvor emisija: <b>{{ selectedVozilo.uge_naziv }}</b> <br>
                                    Emisija: <b>{{ selectedVozilo.uvv_naziv || '/' }}</b> <br>
                                    Energent: <b>{{ selectedVozilo.uvg_knaziv }}</b> <br>
                                    Potrošnja energenata:
                                    <template v-if="Number(selectedVozilo.usi_kolicina)">
                                        <b>
                                            {{ selectedVozilo.usi_kolicina + ' ' +
                                                selectedVozilo.usi_jmj }}
                                        </b>
                                    </template>
                                    <template v-else>
                                        <b>/</b>
                                    </template>
                                    <br>
                                    Emisije CO<sub>2</sub>/kg: <b>{{ Number(selectedVozilo.usi_emisija).toFixed(2)
                                        }}</b>
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
                            <p>Emisije eCO<sub>2</sub>/kg (%)</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>

                    <!-- Energy Consumption Chart -->
                    <div v-if="vozila.length" class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Potrošnja energenata (%)</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('polar')" />
                        </span>
                        <Chart type="pie" :data="polarChartData" :options="chartOptions" class="w-full md:w-[30rem]" />
                    </div>

                    <!-- Fullscreen Chart Modal -->
                    <div v-if="fullscreenChart" class="fullscreen-overlay" @click="closeFullscreen">
                        <div class="fullscreen-chart" @click.stop>
                            <font-awesome-icon icon="times" class="close-icon" @click="closeFullscreen" />
                            <span v-if="fullscreenChart === 'pie'">
                                <h2>Emisije eCO<sub>2</sub>/kg (%)</h2>
                            </span>
                            <span v-if="fullscreenChart === 'polar'">
                                <h2>Potrošnja energenata (%)</h2>
                            </span>
                            <Chart v-if="fullscreenChart === 'pie'" type="pie" :data="chartData" :options="chartOptions"
                                class="fullscreen-chart-content" />
                            <Chart v-if="fullscreenChart === 'polar'" type="pie" :data="polarChartData"
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
import { getCoolingCalculationItems, getCoolingLosses, getEmmisionGroups, getFuelTypes, getVehicles, getVehiclesForEmmisionGroups, saveCoolingCalculation } from '~/service/kesp/fetchVoziloData';
import { addEmission, deleteEmission } from '~/service/kesp/postRequests';
import { useVehicleStore, useKespStore } from '~/stores/main-store';
import { getVehicleIcon, getStatusLabel, calculatePercentage } from '#build/imports';
import InputNumber from 'primevue/inputnumber';

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

const kespId = ref(props.uiz_id);
// console.log("kespId u index: " + kespId.value);

const vozila = computed(() => vehicleStore.vozila);
const ukupnaEmisija = computed(() => vehicleStore.ukupnaEmisija)
// console.log("Evo vozila: ", vozila, " | ", ukupnaEmisija.value);

// Varijabla za pohranu odabrane skupine vozila
const odabranaSkupina = ref(null);
const odabranaVrstaEmsiije = ref(null);
const odabraniEnergent = ref(null);
const potrosnja = ref(null);

const isFormDirty = computed(() =>
    odabranaSkupina.value &&
    odabranaVrstaEmsiije.value &&
    odabraniEnergent.value &&
    potrosnja.value
);

const needUpdate = ref(false)

const vrsteSkupina = ref(null);
const vrsteEmisija = ref(null);
const vrsteEnergenata = ref(null);

const gwpIzracuni = ref([]);
const vrsteRashUredjaja = ref([null]);
const gwpRed = ref([]);
const daNeOpcije = ref([
    { label: 'D', value: 'Da' },
    { label: 'N', value: 'Ne' },
])

const gwpDialogVisible = ref(false);

const returnStatus = (status) => {
    switch (status) {
        case 'D':
            return 'Da';
        case 'N':
            return 'Ne';
        default:
            return null;
    }
}

const addNewRow = () => {
    const newRow = {
        uir_id: null,
        uir_brjed: null,
        ugr_naziv: null,
        uir_kapacitet: null,
        uir_ugradnja: '',
        uir_rad: '',
        uir_kraj: '',
        uir_emisija: null,
        uir_usi_id: null,
        uir_ugr_id: null,
        uir_uvg_id: null,
        uvg_naziv: null,
    };
    gwpIzracuni.value.push(newRow);

    // Editor za novi red
    gwpRed.value = [...gwpRed.value, newRow];
};

const onGwpIzracunCancel = () => {
    gwpRed.value = [];

    // Pronalazi indeks reda sa `uir_id === null`
    const index = gwpIzracuni.value.findIndex(row => row.uir_id === null);

    // Uklanja red na pronađenom indeksu
    if (index !== -1) {
        gwpIzracuni.value = gwpIzracuni.value.filter((_, i) => i !== index);
    }
    needUpdate.value = false
};

const gwpDialogHide = async () => {
    if (needUpdate.value) {
        await vehicleStore.fetchVehicles(kespId.value)
    }
    gwpDialogVisible.value = false;
}

async function onGwpIzracunSave(event) {
    let { newData, index } = event;
    // console.log("newData: ", newData);
    // console.log("index: ", index);

    const getUsiId = async () => {
        const foundVehicle = vozila.value.find(item => item?.usi_uvg_id === odabraniEnergent.value?.uvg_id);
        return foundVehicle ? foundVehicle.usi_id : null;
    };

    const getEmisija = async (usiId) => {
        try {
            const gwpItems = await getCoolingCalculationItems(usiId);
            // console.log("Svi GWP izračuni: ", gwpItems);

            const emisija = gwpItems.find(item =>
                item.uir_ugr_id == newData.uir_ugr_id &&
                item.uir_brjed == newData.uir_brjed &&
                item.uir_uvg_id == newData.uir_uvg_id &&
                item.uir_kapacitet == newData.uir_kapacitet &&
                item.uir_ugradnja == newData.uir_ugradnja &&
                item.uir_rad == newData.uir_rad &&
                item.uir_kraj == newData.uir_kraj
            )?.uir_emisija;

            if (!emisija) {
                // console.error("GWP izračun za ovaj red ne postoji");
                return null;
            }
            // console.log("Emisija: ", Number(emisija).toFixed(4));
            return emisija;
        } catch (error) {
            // console.error("Error fetching GWP for cooling losses:", error);
            return null;
        }
    };

    const updateNewData = async () => {
        const usiId = await getUsiId();
        const ugrGroup = vrsteRashUredjaja.value.find(item => item?.ugr_naziv === newData?.ugr_naziv);

        if (!ugrGroup) {
            // console.log(usiId, ', ', ugrGroup)
            // console.error("Nedostaju podaci za ažuriranje newData");
            //return null;
        }

        return {
            ...newData,
            uiz_id: kespId.value,
            uir_usi_id: usiId,
            uir_ugr_id: ugrGroup.ugr_id,
            uir_uvg_id: odabraniEnergent.value?.uvg_id,
            uvg_naziv: odabraniEnergent.value?.uvg_naziv,
        };
    };

    if (!newData?.uir_usi_id || !newData?.uir_ugr_id || !newData?.uir_uvg_id) {
        // console.log("Nisu popunjena sva polja za gwp izračun");
        newData = await updateNewData();
        if (!newData) return;
    }

    try {
        const { data, status } = await saveCoolingCalculation(newData);
        if (status === 200 && !data?.message) {
            if (newData?.uir_id) showSaveSuccess(true, newData.ugr_naziv);
            else {
                newData = { ...newData, uir_id: data?.coolingCalculationId };
                showSaveSuccess(false, newData.ugr_naziv);
            }

            let usiId;
            if (!newData?.uir_usi_id) {
                // console.log("Nema za ovo plinova")
                try {
                    const newVehicles = await getVehicles(kespId.value)
                    usiId = newVehicles.find(item =>
                        item?.usi_uvg_id == odabraniEnergent.value?.uvg_id
                    )?.usi_id
                    // console.log("usi_id: " + usiId)
                } catch (error) {
                    // console.error("Error saving vehicle:", error);
                    return;
                }
            }

            const emisija = await getEmisija(newData.uir_usi_id || usiId);
            if (emisija) newData.uir_emisija = emisija;

            // console.log("Save Successful: ", data);
            gwpIzracuni.value[index] = newData;
            needUpdate.value = true;
        } else {
            // console.error("Save Failed: ", data);
            showSaveFailed(data.message);
            gwpIzracuni.value[index] = null;
        }
    } catch (error) {
        // console.error("Error saving cooling calculation:", error);
        gwpIzracuni.value[index] = null;
    }
}


function mapVrsteRashUredjaja() {
    gwpIzracuni.value = gwpIzracuni.value.map(item => {
        const matchingVrsta = vrsteRashUredjaja.value.find(
            vrsta => vrsta.ugr_naziv === item.ugr_naziv
        );
        return {
            ...item,
            ugr_naziv: matchingVrsta || item.ugr_naziv, // Ako nema podudaranja, ostavlja trenutnu vrednost
        };
    });
}

onMounted(async () => {
    try {
        vrsteSkupina.value = await getEmmisionGroups();
        vrsteRashUredjaja.value = await getCoolingLosses();
        mapVrsteRashUredjaja()
        // console.log("Evo vrste skupina: ", vrsteSkupina.value);
        // console.log("Evo vrste rashleda: ", vrsteRashUredjaja.value);
        // console.log("Gwp izračuni: ", gwpIzracuni.value);
    } catch (error) {
        // console.error('Error fetching emission groups or cooling losses:', error);
    }
})

watch(odabranaSkupina, async () => {

    if (!odabranaSkupina.value) return;

    // console.log("Odabrana skupina: ", odabranaSkupina.value);
    // console.log("Broj vozila: ", parseInt(odabranaSkupina.value?.br_vozila));

    odabranaVrstaEmsiije.value = null;
    odabraniEnergent.value = null

    vrsteEmisija.value = null
    vrsteEnergenata.value = null;

    try {
        vrsteEmisija.value = await getVehiclesForEmmisionGroups(parseInt(odabranaSkupina.value.uge_id));
        // console.log("Evo vrste vozila: ", vrsteEmisija.value);
    } catch (error) {
        // console.error('Error fetching vrste vozila:', error);
    }

    if (!parseInt(odabranaSkupina.value?.br_vozila)) {
        try {
            vrsteEnergenata.value = await getFuelTypes(parseInt(odabranaSkupina.value.uge_id));
            // console.log("Evo vrste goriva: ", vrsteEnergenata.value);
        } catch (error) {
            // console.error('Error fetching fuels:', error);
        }
    } else {
        // console.log("Ima vrste vozila");
    }
})

watch(odabranaVrstaEmsiije, async () => {

    if (!odabranaVrstaEmsiije.value) return;

    // console.log("Odabrana vrsta emisija: ", odabranaVrstaEmsiije.value);

    if (parseInt(odabranaSkupina.value?.br_vozila)) {
        try {
            vrsteEnergenata.value = await getFuelTypes(parseInt(odabranaSkupina.value.uge_id), parseInt(odabranaVrstaEmsiije.value.uvv_id));
            // console.log("Evo vrste goriva: ", vrsteEnergenata.value);
        } catch (error) {
            // console.error('Error fetching fuels:', error);
        }
    } else {
        // console.log("Energent već dohvaćen: ", vrsteEnergenata.value);
    }
})

watch(odabraniEnergent, async () => {
    // console.log("Odabrani energent: ", odabraniEnergent.value);

    if (odabraniEnergent.value?.uvg_oznaka) {
        gwpIzracuni.value = [];
        const foundGwp = vozila.value.find(item => item?.uvg_naziv === odabraniEnergent.value?.uvg_naziv);
        // console.log("GWP izračun: ", foundGwp)
        if (foundGwp) {
            const usi_id = foundGwp?.usi_id;
            try {
                gwpIzracuni.value = await getCoolingCalculationItems(usi_id);
                // console.log("Evo GWP za rashladni uređaji: ", gwpIzracuni.value);
            } catch (error) {
                // console.error('Error fetching GWP for cooling losses:', error);
            }
        }
    }

    /*  !!
    NAPRAVITI PROVJERU AKO SU SKUPINA, VRSTA I ENERGENT ISTI DA SE NE PRAVI NOVI
    REDAK U TABLICI NEGO DA SE AŽURIRA VEĆ POSTOJEĆI
    */

})

async function openGwpDialog() {
    gwpDialogVisible.value = true;
}

async function saveGwpIzracun() {
    try {
        await vehicleStore.fetchVehicles(kespId.value);
    } catch (error) {
        // console.error('Error fetching vehicles:', error);
    }
    needUpdate.value = false;
    gwpDialogVisible.value = false;
    voziloDialogVisible.value = false;
}

const resetTempVozilo = () => {
    odabranaSkupina.value = null;
    odabranaVrstaEmsiije.value = null;
    odabraniEnergent.value = null;
    potrosnja.value = null;

    vrsteEmisija.value = null;
    vrsteEnergenata.value = null;
}

const chartData = computed(() => {
    const baseColor = '#241147';
    const emisijePoSkupini = {};

    vozila.value.forEach((vozilo) => {
        const kategorija = vozilo.uge_naziv;
        if (!emisijePoSkupini[kategorija]) {
            emisijePoSkupini[kategorija] = vehicleStore.emisijaZaKategoriju(kategorija);
        }
    });

    const labels = Object.keys(emisijePoSkupini); // Nazivi kategorija
    const data = calculatePercentage(Object.values(emisijePoSkupini)); // Ukupne emisije za svaku kategoriju
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10)); // Generisanje boja

    // console.log("Emisije po skupini: ", data);

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

    vozila.value.forEach((vozilo) => {
        const kategorija = vozilo.uge_naziv;
        if (!potrosnjaPoSkupini[kategorija]) {
            potrosnjaPoSkupini[kategorija] = vehicleStore.potrosnjaGorivaZaKategoriju(kategorija);
        }
    });

    const labels = Object.keys(potrosnjaPoSkupini);
    const data = calculatePercentage(Object.values(potrosnjaPoSkupini)); // Ukupne emisije za svaku kategoriju
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10));

    // console.log("Potrošnja po skupini: ", potrosnjaPoSkupini, labels, data, colors);

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
        datalabels: {
            formatter: (value, ctx) => {
                // Dohvaćanje podataka iz trenutnog skupa podataka
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;

                // Izračunavanje ukupne sume vrijednosti
                dataArr.forEach(data => {
                    sum += data;
                });

                // Izračun postotka za trenutnu vrijednost
                let percentage = ((value / sum) * 100).toFixed(2) + "%";
                return percentage;
            },
            color: '#fff', // Boja teksta
            font: {
                size: 14, // Veličina fonta
            },
            anchor: 'end', // Pozicija prikaza
            align: 'end', // Poravnanje teksta
        },
    },
    tooltips: {
        enabled: false, // Onemogućavanje defaultnih tooltipova (opcionalno)
    },
};


const activeSectionTitle = ref('Opseg 1');

// Pratimo promjene prop-a
watch(() => props.sectionTitle, (newTitle) => {
    activeSectionTitle.value = newTitle;
});

const voziloDialogVisible = ref(false);
const deleteVoziloDialog = ref(false);

const selectedVozilo = ref(null);

const openNewVozilo = () => {
    resetTempVozilo();
    voziloDialogVisible.value = true;
};

const showSuccess = (skupina, vrsta) => {
    toast.add({ severity: 'success', summary: 'Uspješno dodano', detail: `Izvor: ${skupina}\nVrsta: ${vrsta}`, life: 3000 });
};

const showSaveSuccess = (isEdit, vrsta) => {
    toast.add({ severity: 'success', summary: isEdit ? 'Uspješno uređeno' : 'Uspješno dodano', detail: `Vrsta: ${vrsta}`, life: 3000 });
};

const showSaveFailed = (message) => {
    toast.add({ severity: 'warn', summary: 'Došlo je do greške', detail: message, life: 3000 });
}

const showDeleteVozilo = () => {
    toast.add({ severity: 'success', summary: 'Uspješno obrisano', detail: `Obrisano vozilo`, life: 3000 });
}

const showError = () => {
    toast.add({ severity: 'error', summary: 'Došlo je do greške', detail: `Nije uspješno izvršena radnja`, life: 3000 });
};

const showWarning = (message) => {
    toast.add({ severity: 'warn', summary: 'Upozorenje', detail: `${message}`, life: 3000 });
}

const checkSameEmisije = (skupinaId, vrsta, gorivoId) => {
    return vozila.value.find(
        (vozilo) => vozilo.usi_uge_id == skupinaId &&
            vozilo.uvv_naziv === vrsta &&
            vozilo.usi_uvg_id == gorivoId)?.usi_id || null
}

const saveVozilo = async () => {
    if (
        Object.keys(odabranaSkupina.value).length === 0 ||
        Object.keys(odabraniEnergent.value).length === 0 ||
        !odabranaVrstaEmsiije.value ||
        potrosnja.value <= 0
    ) { showError(); return; }

    const tempSkupina = odabranaSkupina.value?.uge_naziv
    const tempVrsta = odabranaVrstaEmsiije.value?.uvv_naziv || odabranaVrstaEmsiije.value;

    // console.log("Spremanje: ", odabranaSkupina.value?.uge_id, odabranaVrstaEmsiije.value?.uvv_naziv || odabranaVrstaEmsiije.value, odabraniEnergent.value?.uvg_id)

    const itemId = checkSameEmisije(
        odabranaSkupina.value?.uge_id,
        odabranaVrstaEmsiije.value?.uvv_naziv || odabranaVrstaEmsiije.value,
        odabraniEnergent.value?.uvg_id
    )

    // console.log("itemId: ", itemId)

    const data = {
        itemId: itemId,
        calculationId: kespId.value,
        emissionGroupId: odabranaSkupina.value?.uge_id,
        veichleTypeId: typeof odabranaVrstaEmsiije.value === 'object'
            ? odabranaVrstaEmsiije.value?.uvv_id
            : null,
        veichleTypeName: typeof odabranaVrstaEmsiije.value === 'object'
            ? odabranaVrstaEmsiije.value?.uvv_naziv
            : odabranaVrstaEmsiije.value, // Ako je string, uzmi njegovu vrijednost
        fuelTypeId: odabraniEnergent.value?.uvg_id,
        quantity: Number(potrosnja.value),
    };

    // console.log("Podaci: ", data)

    try {
        const response = await addEmission(data);

        const { id, status, message } = response;

        if (status === 200 && !message) {
            const usi_id = id;
            // console.log("Vozilo ID: ", usi_id);

            showSuccess(tempSkupina, tempVrsta);

            try {
                await vehicleStore.fetchVehicles(kespId.value);
            } catch (error) {
                // console.log("Greska pri filtriranju novih vozila.", error);
            }


        } else if (status === 200 && message) {
            showWarning(message);
            // console.log("Poruka: ", message)
        }

        else {
            // console.log("Greska pri dodavanju vozila.");
            showError();
        }
    } catch (error) {
        // console.log("Greska pri dodavanju vozila.", error);
        showError();
    }

    voziloDialogVisible.value = false; // Zatvori dialog
    odabranaSkupina.value = null;
};
const deleteVozilo = async () => {
    try {
        // console.log("Vozilo za brisanje: ", selectedVozilo.value);
        const response = await deleteEmission(selectedVozilo.value.usi_id);
        const { status } = response;

        if (status === 200) {
            const index = vozila.value.findIndex(v => v?.usi_id === selectedVozilo.value?.usi_id);
            if (index !== -1) {
                vozila.value.splice(index, 1);
            }
            showDeleteVozilo();
        } else {
            // console.log("Greska pri brisanju stavke.");
            showError();
        }
    } catch (error) {
        // console.log("Greska pri brisanju stavke.", error);
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

// Prati promjene na odabranom vozilu
watch(selectedVozilo, (newValue) => {
    if (!newValue) {
        resetTempVozilo() // Resetirati formu ako nema odabranog vozila
    }
});

</script>


<style scoped>
* {
    color: var(--text-color);
}

/* :deep(.p-datatable-row-group-header) {
    outline: 2px solid var(--kesp-primary) !important;
} */

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
    width: 100%;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.field-split {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.field-split>div {
    width: 300px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    flex: 1;
}

.gwp-calc {
    background-color: none;
    border: none;
    cursor: pointer;
}

.gwp-calc span {
    margin-left: 5px;
}

.gwp-calc * {
    color: var(--primary-color);
}

.gwp-calc:hover span,
.gwp-calc:active span {
    text-decoration: underline;
}

.radio {
    margin-top: 3px;
    display: flex;
    align-items: center;
    gap: 13px;
}

.radio-group {
    width: min-content;
    display: flex;
    gap: 5px;
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

.submitBtn:disabled {
    color: var(--text-color);
    background-color: #d3d3d3;
    cursor: not-allowed;
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

.custom-icon-class * {
    all: unset !important;
    background-color: red;
}

:deep(.p-button-rounded) {
    font-size: 14px;
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