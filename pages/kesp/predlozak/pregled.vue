<template>
    <div class="body">
        <main>
            <h1>{{ 'Pregled' }}</h1>

            <div class="main-content">
                <section>
                    <div>
                        <h2>Vremensko razdoblje izračuna</h2>
                        <p>Vremensko razdoblje za kojeg se prikazuju podaci</p>
                    </div>
                    <div class="razdoblje">
                        <!-- <VremenskoRazdoblje style="width: 100%;" /> -->
                        <div>
                            <div v-if="opis" class="opisnap">
                                <label for="opis">
                                    Naziv
                                </label>
                                <InputText id="opis" v-model="opis" type="text" placeholder="Naziv nije unešen"
                                    readonly />
                            </div>
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
                            <div v-if="napomena" class="opisnap">
                                <label for="napomena">
                                    Napomena
                                </label>
                                <Textarea id="napomena" v-model="napomena" placeholder="Napomena nije unešena"
                                    readonly />
                            </div>

                        </div>
                    </div>
                </section>
                <section>
                    <div>
                        <h2>Ukupna emisija - Opseg 1</h2>
                        <p>Ukupni prikaz emisije stakleničkih plinova iz Opsega 1</p>
                    </div>
                    <div class="datatable">
                        <DataTable v-model:selection="odabranaGrupaEmisije" selection-mode="single" data-key="uge_id"
                            :value="groupedData" scrollable scroll-height="400px" table-style="min-width: 50rem"
                            show-gridlines @row-select="dialogEmisijaVisible = true">
                            <!-- -->
                            <template #empty> Nema podataka za prikaz </template>

                            <Column header="Broj" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

                            <Column field="uge_naziv" header="Izvor emisija">
                                <template #body="slotProps">
                                    <span>
                                        <font-awesome-icon :icon="getVehicleIcon(slotProps.data.uge_naziv)" />
                                        {{ slotProps.data.uge_naziv }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="totalEmissions" header="Ukupne emisije CO2 t/god">
                                <template #body="slotProps">
                                    <span>{{ formatNumber(vehicleStore.emisijaZaKategoriju(slotProps.data.uge_naziv) /
                                        1000) }}</span>
                                </template>
                            </Column>

                            <template #footer>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    Ukupno: <strong>{{ formatNumber(vehicleStore.ukupnaEmisija / 1000) }}</strong>
                                    CO<sub>2</sub> t/god
                                </div>
                            </template>
                        </DataTable>

                        <Dialog v-model:visible="dialogEmisijaVisible" :style="{ width: '75vw' }" maximizable modal
                            :content-style="{ height: 'auto' }" @hide="odabranaGrupaEmisije = null">
                            <template #header>
                                <span style="font-size: 1.1rem; font-weight: 600;">
                                    <font-awesome-icon :icon="getVehicleIcon(odabranaGrupaEmisije?.uge_naziv)" />
                                    {{ odabranaGrupaEmisije?.uge_naziv }}
                                </span>
                            </template>
                            <DataTable :value="energentiPotrosnja" table-style="min-width: 50rem" show-gridlines>
                                <template #empty>
                                    <span style="font-style: italic; opacity: 0.75;">
                                        Nema podataka za prikaz.
                                    </span>
                                </template>
                                <Column header="Broj" header-style="width:3rem">
                                    <template #body="slotProps">
                                        {{ slotProps.index + 1 }}
                                    </template>
                                </Column>
                                <Column field="energent" :header="odabranaGrupaEmisije?.uge_lab_uvg">
                                    <template #body="slotProps">
                                        <Tag :value="slotProps.data.energent" :class="[
                                            {
                                                'etanol-tag': slotProps.data.energent === ('Etanol', 'Prirodni plin') ||
                                                    odabranaGrupaEmisije?.uge_naziv == 'Staklenički plinovi (GWP)' &&
                                                    slotProps.data.energent.charAt(0) !== 'R'
                                            },
                                            {
                                                'dizel-tag': slotProps.data.energent === (
                                                    'Dizel' || 'Biodizel' || 'B20 biodizel' || 'Biodizel'
                                                )
                                            },
                                            { 'jet-tag': slotProps.data.energent === ('Jet Fuel', 'Gorivo za mlazne motore') },
                                            { 'lozulje-tag': slotProps.data.energent === 'Loživo ulje' },
                                            {
                                                'lpg-tag': slotProps.data.energent === ('LNG' || 'LPG') ||
                                                    slotProps.data.energent.charAt(0) === 'R'
                                            },
                                            { 'cng-tag': slotProps.data.energent === ('CNG') },
                                        ]" />
                                    </template>
                                </Column>
                                <Column field="ukupnaPotrosnja" header="Ukupna potrošnja" />
                                <Column field="mjernaJedinica" header="Mjerna jedinica" />
                                <Column field="ukupnaEmisija" header="Ukupne emisije CO2 t/god" />
                                <template #footer>
                                    <div class="flex justify-end font-bold w-full mt-4">
                                        Ukupno:
                                        <span>
                                            <strong>{{
                                                formatNumber(vehicleStore.emisijaZaKategoriju(odabranaGrupaEmisije?.uge_naziv)
                                                    /
                                                    1000) }}</strong></span> t/god
                                    </div>
                                </template>
                            </DataTable>
                            <template #footer>
                                <button type="button" class="p-button p-component p-button-secondary"
                                    @click="dialogEmisijaVisible = false">
                                    Zatvori
                                </button>
                            </template>
                        </Dialog>

                    </div>
                </section>
                <section>
                    <div class="data-heading">
                        <h2>Ukupna emisija - Opseg 2</h2>
                        <p>Ukupni prikaz emisije stakleničkih plinova iz Opsega 2</p>
                    </div>
                    <DataTable :value="opseg2Store.izracuni" show-gridlines :rows="5" data-key="id">

                        <Column header="Broj">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>

                        <Column header="Vrsta energije" field="energija">
                            <template #body="slotProps">
                                <template v-if="slotProps.data.energija === 'Električna energija'">
                                    <font-awesome-icon icon="bolt-lightning" style="margin-right: 5px;" />
                                    {{ slotProps.data.energija }}
                                </template>
                                <template v-else-if="slotProps.data.energija === 'Toplinska energija'">
                                    <font-awesome-icon icon="mug-hot" style="margin-right: 5px;" />
                                    {{ slotProps.data.energija }}
                                </template>
                            </template>
                        </Column>

                        <Column header="Neobnovljiva energija (kWh)" field="neobnovljivo">
                            <template #body="slotProps">
                                {{ slotProps.data.neobnovljivo !== null ? formatNumber(slotProps.data.neobnovljivo) :
                                    '0.00' }}
                            </template>
                        </Column>

                        <Column header="Obnovljiva energija (kWh)" field="obnovljivo">
                            <template #body="slotProps">
                                {{ slotProps.data.obnovljivo !== null ? formatNumber(slotProps.data.obnovljivo) : '0.00'
                                }}
                            </template>
                        </Column>

                        <Column header="Ukupna potrošnja (kWh)" field="ukupno">
                            <template #body="slotProps">
                                {{ formatNumber(slotProps.data.ukupno) }}
                            </template>
                        </Column>

                        <Column header="Emisije CO2 t/god" field="emisije">
                            <template #body="slotProps">
                                {{ formatNumber(slotProps.data.emisije.toFixed(2) / 1000) }}
                            </template>
                        </Column>

                        <template #footer>
                            <div class="total-emissions">

                                <span>Ukupno: </span>
                                <strong>{{ formatNumber(totalEmissions) }}</strong> CO<sub>2</sub> t/god

                            </div>
                        </template>
                    </DataTable>
                </section>
                <section>
                    <div class="data-heading">
                        <h2>Popis odabranih kategorija emisija - Opseg 3</h2>
                        <p>Prikaz odabranih kategorija emisija koje su izabrane kao relevantne iz Opsega 3</p>
                    </div>
                    <div class="kategorije">
                        <Accordion v-if="filteredNodes.length && !loadingCategories" multiple>
                            <AccordionPanel v-for="category in filteredNodes" :key="category.key" :value="category.key">
                                <AccordionHeader>
                                    {{ category.ukt_naziv }}
                                </AccordionHeader>
                                <AccordionContent>
                                    <p v-if="category && category.ukt_opis" class="tab-opis">
                                        <span v-for="(segment, index) in formatEndl(category.ukt_opis)" :key="index">
                                            {{ segment }}
                                            <template
                                                v-if="index < formatEndl(category.ukt_opis).length - 1"><br></template>
                                        </span>
                                    </p>
                                    <template v-if="category.children && category.children.length">
                                        <Accordion multiple>
                                            <AccordionPanel v-for="child in category.children" :key="child.key"
                                                :value="child.key">
                                                <AccordionHeader>
                                                    {{ child.ukt_naziv }}
                                                </AccordionHeader>
                                                <AccordionContent>
                                                    <p v-if="child && child.ukt_opis" class="tab-opis">
                                                        <span v-for="(segment, index) in formatEndl(child.ukt_opis)"
                                                            :key="index">
                                                            {{ segment }}
                                                            <template
                                                                v-if="index < formatEndl(child.ukt_opis).length - 1"><br></template>
                                                        </span>
                                                    </p>
                                                </AccordionContent>
                                            </AccordionPanel>
                                        </Accordion>
                                    </template>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                        <span v-else-if="loadingCategories"  style="display: flex; align-items: center; gap: 5px;">
                            <font-awesome-icon icon="spinner" spin /> 
                            <p>
                                Učitavanje kategorija
                            </p>
                        </span>
                        <span v-else  style="display: flex; align-items: center; gap: 5px; opacity: 0.8;">
                            <font-awesome-icon :icon="['fas', 'circle-info']" />
                            <p>Još nema odabranih kategorija emisija.</p>
                        </span>

                    </div>
                </section>
                <section>
                    <div class="data-heading">
                        <h2>Ukupna emisija</h2>
                        <p>Ukupan prikaz stakleničkih plinova - Opseg 1 + Opseg 2 </p>
                    </div>
                    <div class="ukupni-utrosak-o1o2">
                        UKUPNO:
                        <span class="emissions">
                            {{ formatNumber(combinedEmissions) }}
                        </span>

                        CO2 t/god
                    </div>
                </section>
                <div style="width: min-content;">
                    <span class="download-btn" @click="downloadReport(kespId)">
                        <font-awesome-icon icon="download" />
                        <span>Preuzmi izvještaj (.pdf)</span>
                    </span>
                </div>
            </div>
            <div class="stats-content">
                <div class="stats-table">
                    <div v-if="vozila.length" class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub> t/god - Opseg 1 (%)</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="emissionsPieData" :options="chartOptions" />
                    </div>

                    <div v-if="izracuni.some(item => item.neobnovljivo !== null || item.obnovljivo !== null)"
                        class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Ukupna potrošnja energije [kWh] - Opseg 2 (%)</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('polar')" />
                        </span>
                        <Chart type="pie" :data="combinedChartData" :options="chartOptions"
                            class="w-full md:w-[30rem]" />
                    </div>
                </div>
                <!-- Fullscreen Chart Modal -->
                <div v-if="fullscreenChart" class="fullscreen-overlay" @click="closeFullscreen">
                    <div class="fullscreen-chart" @click.stop>
                        <font-awesome-icon icon="times" class="close-icon" @click="closeFullscreen" />
                        <span v-if="fullscreenChart === 'pie'">
                            <h2>Emisije CO<sub>2</sub> t/god - Opseg 1 (%)</h2>
                        </span>
                        <span v-if="fullscreenChart === 'polar'">
                            <h2>Ukupna potrošnja energije [kWh] - Opseg 2 (%)</h2>
                        </span>
                        <Chart v-if="fullscreenChart === 'pie'" type="pie" :data="emissionsPieData"
                            :options="chartOptions" class="fullscreen-chart-content" />
                        <Chart v-if="fullscreenChart === 'polar'" type="pie" :data="combinedChartData"
                            :options="chartOptions" class="fullscreen-chart-content" />
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { useKespStore, useVehicleStore, useOpseg2Store } from '#imports';
import AccordionPanel from 'primevue/accordionpanel';
import { getReport } from '~/service/kesp/fetchHeader';
import { getO3categories } from '~/service/kesp/fetchOpseg3';
import { getEmmisionGroups } from '~/service/kesp/fetchVoziloData';
import { formatNumber } from '~/utils/dataFormatter';

const opseg2Store = useOpseg2Store(); // Inicijaliziraj store
const kespStore = useKespStore();
// Dohvati podatke iz storeova
const vehicleStore = useVehicleStore();

const props = defineProps({
    sectionTitle: String,
    uiz_id: String,
});
const kespId = ref(props.uiz_id);

const vozila = computed(() => vehicleStore.vozila);
const skupine = ref([null])

const kategorije = ref([null]);

const groupedData = computed(() => {
    return skupine.value.filter(s => s !== null); // Vraćamo originalne objekte, isključujući null vrednosti
});

const energentiPotrosnja = computed(() => {
    const vozila = vehicleStore.vozila;
    const skupina = odabranaGrupaEmisije.value?.uge_naziv;

    if (!vozila.length || !skupina) {
        return [];
    }

    // Dohvaćanje svih jedinstvenih goriva iz vozila u odabranoj skupini
    const energenti = [...new Set(
        vozila
            .filter(vozilo => vozilo.uge_naziv === skupina)
            .map(vozilo => vozilo.uvg_knaziv) // Izdvajamo naziv goriva (Benzin, Dizel, itd.)
    )];

    // Kreiranje niza s podacima o potrošnji i emisiji za svako gorivo
    return energenti.map(energent => ({
        energent,
        ukupnaPotrosnja: parseFloat(vehicleStore.ukupnaPotrosnjaGorivaZaEnergentIzSkupineEmisija(skupina, energent)) || 0,
        mjernaJedinica: vehicleStore.mjernaJedinicaZaSkupinuEmisija(skupina) || 'LL',
        ukupnaEmisija: (parseFloat(vehicleStore.ukupnaEmisijaGorivaZaEnergentIzSkupineEmisija(skupina, energent)) / 1000).toFixed(2) || 0,
    }));
});

watch(groupedData, () => {
    console.log("Grouped data:", groupedData.value);
})

const fullscreenChart = ref(null);
const dialogEmisijaVisible = ref(false);

const odabranaGrupaEmisije = ref(null);

watch(odabranaGrupaEmisije, () => {
    console.log("Odabrana grupa emisije:", odabranaGrupaEmisije.value);
})

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

// Ukupne emisije
const totalEmissions = computed(() => opseg2Store.totalEmissions / 1000);

const combinedEmissions = computed(() => {
    // const opseg1 = parseFloat(calculateTotalEmissions().toFixed(2)) / 1000;
    const opseg1 = parseFloat(vehicleStore.ukupnaEmisija / 1000);
    const opseg2 = parseFloat(totalEmissions.value);
    const ukupno = opseg1 + opseg2;
    console.log("opseg1: ", opseg1, "opseg2: ", opseg2, "ukupno: ", ukupno);
    return ukupno.toFixed(2);
});

const filterNodes = (nodeList) => {
    if (!Array.isArray(nodeList)) return []; // Osiguraj da je nodeList polje
    return nodeList
        .filter((node) => node?.relevant) // Provjeri postoji li `node` i je li `relevant`
        .map((node) => ({
            ...node,
            children: node.children ? filterNodes(node.children) : [], // Provjeri ima li `children`
        }));
};

watch(energentiPotrosnja, () => {
    console.log("Energenti potrosnja:", energentiPotrosnja.value);
})

// Filtrirani čvorovi za prikaz u stablu
const filteredNodes = computed(() => {
    return kategorije.value ? filterNodes(kategorije.value) : [];
});

const loadingCategories = ref(false);

onMounted(async () => {
    try {
        skupine.value = await getEmmisionGroups();
        const kats = await getO3categories(kespId.value);
        kategorije.value = transformCategories(kats);
        console.log("fetchane kategorije: ", kategorije.value)
        console.log("filtrirane kategorije: ", filteredNodes.value)
        console.log("Skupine: ", skupine.value)
        console.log("VOZILA: ", vehicleStore.vozila)
        console.log("Energenti potrošnja: ", energentiPotrosnja.value) //)
        loadingCategories.value = false;
    } catch (error) {
        console.error("Greška prilikom dohvaćanja emisijskih grupa:", error);
    }
    console.log("IZIIZ: ", izracuni.value)
})

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));
const opis = computed(() => kespStore.naziv);
const napomena = computed(() => kespStore.napomena);

const izracuni = computed(() => opseg2Store.izracuni);

const downloadReport = async (id) => {
    const pdfBlob = await getReport(id);

    if (!pdfBlob) {
        console.error('Neuspješno dohvaćanje PDF-a.');
        return;
    }

    const blob = new Blob([pdfBlob], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

// const combinedChartData = computed(() => opseg2Store.combinedChartData); // Preuzmi podatke za grafikon iz getter-a
const combinedChartData = computed(() => {
    const labels = izracuni.value.map(row => row.energija);
    const data = calculatePercentage(izracuni.value.map(row => row.emisije));

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: ['#f8ae5b', '#ffc875'], // Zeleno za električnu energiju, žuto za toplinsku
                hoverBackgroundColor: ['#f8ae5b', '#ffc875']
            }
        ]
    };
}); // Preuzmi podatke za grafikon iz getter-a

const emissionsPieData = computed(() => {
    const baseColor = '#241147';
    const emisijePoSkupini = {};

    vozila.value.forEach((vozilo) => {
        const kategorija = vozilo.uge_naziv;
        if (!emisijePoSkupini[kategorija]) {
            emisijePoSkupini[kategorija] = Number(vehicleStore.emisijaZaKategoriju(kategorija)).toFixed(2) / 1000;
        }
    });

    const labels = Object.keys(emisijePoSkupini); // Nazivi kategorija
    const data = calculatePercentage(Object.values(emisijePoSkupini)); // Ukupne emisije za svaku kategoriju
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10)); // Generisanje boja

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

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: '#000' // Default color for SSR
                }
            }
        }
    };
};

const chartOptions = setChartOptions();

</script>

<style scoped>
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

hr {
    width: 100%;
    border: none;
    border-top: var(--border-line-sidebar);
}

h3 {
    font-weight: 500;
}

.tab-opis {
    font-size: 16px;
    white-space: pre-wrap;
    line-height: 1.5;
}

strong {
    /* color: green; */
    text-decoration: underline;
    font-size: 16px;
}

strong,
.ukupni-utrosak-o1o2>span {
    font-size: 16px;
}

.ukupni-utrosak-o1o2 {
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 13px;
    border-radius: 5px;
    background-color: green;
    background-color: var(--kesp-primary);
}

.ukupni-utrosak-o1o2>span {
    line-height: normal;
    font-size: 18px;
    color: white;
    font-weight: 600;
}

.ukupni-utrosak-o1o2 * {
    color: white;
}

.emissions {
    width: min-content;
    text-decoration: underline;
}

.razdoblje>div {
    gap: 10px;
}

.download-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 10px;

    border: 1px solid transparent;
    background: none !important;
    color: var(--text-color);
    cursor: pointer;
}

.download-btn span {
    width: 100%;
    text-wrap: nowrap;
}

.download-btn:hover {
    text-decoration: underline;
}

.download-btn:active {
    transform: scale(0.98);
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

.close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
}

:deep(.p-datatable-row-selected) {
    background: var(--kesp-bg) !important;
    color: var(--kesp-primary) !important;
    border: var(--kesp-primary) !important;
}

:deep(.p-datatable-row-selected > td) {
    /* border-block-color: var(--kesp-primary) !important; */
    border-block-end-color: #24114728 !important;
}

:deep(.p-datatable-tbody > tr:has(+ .p-datatable-row-selected) > td) {
    border-block-end-color: #24114728 !important;
}


.dizel-tag {
    background-color: var(--text-color) !important;
    color: white !important;
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
</style>