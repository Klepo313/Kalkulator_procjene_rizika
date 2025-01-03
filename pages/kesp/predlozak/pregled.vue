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
                        <DataTable :value="groupedData" scrollable scroll-height="400px" table-style="min-width: 50rem"
                            show-gridlines>
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

                    </div>
                </section>
                <section>
                    <div class="data-heading">
                        <h2>Ukupna emisija - Opseg 2</h2>
                        <p>UUkupni prikaz emisije stakleničkih plinova iz Opsega 2</p>
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
                    <span v-tooltip.top="'Još nije u funkciji.'" class="download-btn">
                        <font-awesome-icon icon="download" />
                        <span>Preuzmi izvještaj</span>
                    </span>
                </div>
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
                    <div v-if="vozila.length" class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub> t/god - Opseg 1</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="emissionsPieData" :options="chartOptions" />
                    </div>

                    <div v-if="izracuni.some(item => item.neobnovljivo !== null || item.obnovljivo !== null)"
                        class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Emisije CO<sub>2</sub> t/god - Opseg 2</p>
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
                            <h2>Emisije CO<sub>2</sub>/kg</h2>
                        </span>
                        <span v-if="fullscreenChart === 'polar'">
                            <h2>Ukupna potrošnja energije (kWh)</h2>
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
import { getEmmisionGroups } from '~/service/kesp/fetchVoziloData';
import { formatNumber } from '~/utils/dataFormatter';

const opseg2Store = useOpseg2Store(); // Inicijaliziraj store
const kespStore = useKespStore();
// Dohvati podatke iz storeova
const vehicleStore = useVehicleStore();

const vozila = computed(() => vehicleStore.vozila);
const skupine = ref([null])

// const groupedData = computed(() => {
//     return skupine.value
//         .filter(s => s !== null) // Filtriraj null vrednosti
//         .map(s => s.uge_naziv);
// });

const groupedData = computed(() => {
    return skupine.value.filter(s => s !== null); // Vraćamo originalne objekte, isključujući null vrednosti
});

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

const kespId = ref(null);

onMounted(async () => {
    const res = await initializeCookie('kesp-id');
    kespId.value = parseInt(res['kesp-id']);
    try {
        skupine.value = await getEmmisionGroups();
        // const sks = await getEmmisionGroups();
        // skupine.value = sks.map(s => s)
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

// const combinedChartData = computed(() => opseg2Store.combinedChartData); // Preuzmi podatke za grafikon iz getter-a
const combinedChartData = computed(() => {
    const labels = izracuni.value.map(row => row.energija);
    const data = izracuni.value.map(row => row.emisije);

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
    const data = Object.values(emisijePoSkupini); // Ukupne emisije za svaku kategoriju
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
</style>