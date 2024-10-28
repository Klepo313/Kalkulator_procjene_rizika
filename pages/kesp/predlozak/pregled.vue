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
                                <InputText v-model="opis" type="text" id="opis" placeholder="Naziv nije unešen"
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
                                <Textarea v-model="napomena" id="napomena" placeholder="Napomena nije unešena"
                                    readonly />
                            </div>

                        </div>
                    </div>
                </section>
                <section>
                    <div>
                        <h2>Ukupni utrošak - Opseg 1</h2>
                        <p>Ukupan prikaz stakleničkih plinova - opseg 1</p>
                    </div>
                    <div class="datatable">
                        <DataTable :value="groupedData" scrollable scroll-height="400px" table-style="min-width: 50rem"
                            show-gridlines>
                            <template #empty> Nema podataka za prikaz </template>

                            <Column header="No." header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

                            <Column field="category" header="Izvor emisija">
                                <template #body="slotProps">
                                    <span v-if="slotProps.data.category === 'Osobna vozila'">
                                        <font-awesome-icon icon="car-side" /> {{ slotProps.data.category }}
                                    </span>
                                    <span v-else-if="slotProps.data.category === 'Teretna vozila'">
                                        <font-awesome-icon icon="truck" /> {{ slotProps.data.category }}
                                    </span>
                                    <span v-else-if="slotProps.data.category === 'Strojevi'">
                                        <font-awesome-icon icon="tractor" /> {{ slotProps.data.category }}
                                    </span>
                                    <span v-else-if="slotProps.data.category === 'Stacionarni izvori'">
                                        <font-awesome-icon icon="charging-station" /> {{ slotProps.data.category }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="totalEmissions" header="Ukupne emisije CO2 t/god">
                                <template #body="slotProps">
                                    <span>{{ formatNumber(slotProps.data.totalEmissions.toFixed(2)) }}</span>
                                </template>
                            </Column>

                            <template #footer>
                                <div class="flex justify-end font-bold w-full mt-4">
                                    Ukupno: <strong>{{ formatNumber(calculateTotalEmissions().toFixed(2)) }}</strong>
                                    CO<sub>2</sub> t/god
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </section>
                <section>
                    <div class="data-heading">
                        <h2>Ukupni utrošak - Opseg 2</h2>
                        <p>Ukupan prikaz stakleničkih plinova - opseg 2</p>
                    </div>
                    <DataTable :value="opseg2Store.izracuni" show-gridlines :rows="5" data-key="id">

                        <Column header="No.">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>

                        <Column header="Energija" field="energija">
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

                        <Column header="Neobnovljivo (kWh)" field="neobnovljivo">
                            <template #body="slotProps">
                                {{ slotProps.data.neobnovljivo !== null ? formatNumber(slotProps.data.neobnovljivo) :
                                    '0.00' }}
                            </template>
                        </Column>

                        <Column header="Obnovljivo (kWh)" field="obnovljivo">
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

                        <Column header="Emisije CO2/kg" field="emisije">
                            <template #body="slotProps">
                                {{ formatNumber(slotProps.data.emisije.toFixed(2)) }}
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
                        <h2>Ukupni utrošak - Opseg 1 + Opseg 2</h2>
                        <p>Ukupan prikaz stakleničkih plinova - opseg 1 + opseg 2 </p>
                    </div>
                    <div class="ukupni-utrosak-o1o2">
                        UKUPNO:
                        <span class="emissions">
                            {{ formatNumber(combinedEmissions) }}
                        </span>

                        CO2 t/god
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
                    <div v-if="vozila.length" class="chart-container">
                        <span>
                            <p>Emisije CO<sub>2</sub> t/god - Opseg 1</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="emissionsPieData" :options="chartOptions" />
                    </div>

                    <div class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Emisije CO<sub>2</sub> t/god - Opseg 2</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('polar')" />
                        </span>
                        <Chart type="polarArea" :data="combinedChartData" :options="chartOptions"
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
                        <Chart v-if="fullscreenChart === 'polar'" type="polarArea" :data="combinedChartData"
                            :options="chartOptions" class="fullscreen-chart-content" />
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { useKespStore, useVehicleStore, useIzvoriStore, useOpseg2Store } from '#imports';
import { formatNumber } from '~/utils/dataFormatter';

const opseg2Store = useOpseg2Store(); // Inicijaliziraj store
const kespStore = useKespStore();
// Dohvati podatke iz storeova
const vehicleStore = useVehicleStore();

const groupedData = computed(() => {
    // Kreiramo grupirane podatke na osnovu strukture vrsteVozila
    return vehicleStore.vrsteVozila.map(vrsta => {
        // Filtriramo vozila koja pripadaju trenutnoj vrsti vozila
        const vozilaForVrsta = vehicleStore.vozila.filter(vozilo => vozilo.vozilo.skupina === vrsta.value);

        // Izračunavamo ukupne emisije za trenutnu vrstu vozila
        const totalEmissions = vozilaForVrsta.reduce((sum, vozilo) => sum + vozilo.emisije, 0);

        // Vraćamo objekt s podacima za trenutnu vrstu vozila
        return {
            category: vrsta.value,
            totalEmissions
        };
    });
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

// Funkcija za grupisanje podataka i izračun emisija
// const groupedData = computed(() => {
//     const grouped = JSON.parse(JSON.stringify(categories)); // Duboko kloniranje kategorija

//     // Grupisanje podataka iz vozila
//     vehicleStore.vozila.forEach(vozilo => {
//         if (vozilo.vozilo.skupina === 'Osobno vozilo') {
//             grouped[0].totalEmissions += vozilo.emisije; // Osobna vozila
//         } else if (vozilo.vozilo.skupina === 'Teretno vozilo') {
//             grouped[1].totalEmissions += vozilo.emisije; // Teretna vozila
//         } else if (vozilo.vozilo.skupina === 'Stroj') {
//             grouped[2].totalEmissions += vozilo.emisije; // Strojevi
//         }
//     });

//     // Grupisanje podataka iz izvora
//     izvoriStore.izvori.forEach(izvor => {
//         grouped[3].totalEmissions += izvor.emisije; // Stacionarni izvori
//     });

//     return grouped;
// });

// Funkcija za izračun ukupnih emisija
const calculateTotalEmissions = () => {
    return groupedData.value.reduce((total, item) => total + item.totalEmissions, 0);
};

// Ukupne emisije
const totalEmissions = computed(() => opseg2Store.totalEmissions);

const combinedEmissions = computed(() => {
    const opseg1 = parseFloat(calculateTotalEmissions().toFixed(2));
    const opseg2 = parseFloat(totalEmissions.value);
    const ukupno = parseFloat((opseg1 + opseg2)).toFixed(2)
    return ukupno;
});

const kespId = ref(null);

onMounted(async () => {
    const res = await initializeCookie('kesp-id');
    kespId.value = parseInt(res['kesp-id']);
})

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));
const opis = computed(() => kespStore.naziv);
const napomena = computed(() => kespStore.napomena);

const vozila = computed(() => vehicleStore.vozila);
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
    const labels = groupedData.value.map(item => item.category);
    const data = groupedData.value.map(item => item.totalEmissions);
    const backgroundColors = ['#3e2b61', '#57447a', '#715e94', '#241147']; // Color for each category

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors, // Optional: same color on hover
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