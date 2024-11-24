<template>
    <div class="body">
        <Toast />
        <main>
            <h1>{{ 'Opseg 2' }}</h1>
            <div class="main-content">
                <!-- <section class="main-heading">
                    <div>
                        <h2>Metoda izračuna:</h2>
                        <p>
                            U GHG Scope 2 (Opseg 2) spada potrošnja električne energije kupljena od opskrbljivača i
                            potrošnja toplinske energije nabavljene od dobavljača.
                            <br>
                            Podaci o količini mogu se očitati sa mjerila (ukoliko postoji) ili sa računa dobavljača.
                        </p>
                    </div>
                </section> -->
                <section>
                    <div>
                        <h2>Vremensko razdoblje izračuna</h2>
                        <p>Vremensko razdoblje za kojeg se unose podaci</p>
                    </div>
                    <div class="razdoblje">
                        <!-- <VremenskoRazdoblje /> -->
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
                <section class="main-data">
                    <div class="data-heading">
                        <h2>Izračun Opseg 2</h2>
                        <p>Unesi podatke neobnovljivih i obnovljivih izvora energije</p>
                    </div>
                    <div class="data-item">
                        <DataTable :value="sortedIzracuni" show-gridlines edit-mode="cell" :rows="5" data-key="id"
                            :rowClass="getRowClass" @cell-edit-complete="onCellEditComplete">
                            <template #empty> Nema energija </template>

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
                                <template #editor="slotProps">
                                    <InputNumber v-model="slotProps.data.neobnovljivo" :show-buttons="true"
                                        mode="decimal" min="0" />
                                </template>
                                <template #body="slotProps">
                                    <span
                                        v-if="slotProps.data.neobnovljivo !== null && slotProps.data.neobnovljivo !== undefined">
                                        {{ slotProps.data.neobnovljivo == 0 ? '0' :
                                            formatNumber(slotProps.data.neobnovljivo) }}
                                    </span>
                                    <span v-else style="font-style: italic; opacity: 0.6;">
                                        {{ '0' }}
                                    </span>
                                </template>
                            </Column>

                            <Column header="Obnovljivo (kWh)" field="obnovljivo">
                                <template #editor="slotProps">
                                    <InputNumber v-model="slotProps.data.obnovljivo" :show-buttons="true" mode="decimal"
                                        min="0" />
                                </template>
                                <template #body="slotProps">
                                    <span
                                        v-if="slotProps.data.obnovljivo !== null && slotProps.data.obnovljivo !== undefined">
                                        {{ slotProps.data.obnovljivo == 0 ? '0' :
                                            formatNumber(slotProps.data.obnovljivo) }}
                                    </span>
                                    <span v-else style="font-style: italic; opacity: 0.6;">
                                        {{ '0' }}
                                    </span>
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
                                    <div>
                                        <span>Ukupno emisija CO<sub>2</sub>: </span>
                                        <strong>{{ formatNumber(totalEmissions) }}</strong> kg
                                    </div>
                                </div>
                            </template>
                        </DataTable>


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
                            <p>Ukupne emisije CO<sub>2</sub>/kg</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('pie')" />
                        </span>
                        <Chart type="pie" :data="combinedChartData" :options="chartOptions"
                            class="w-full md:w-[30rem]" />
                    </div>
                    <div class="chart-container" style="margin-top: 20px;">
                        <span>
                            <p>Ukupna potrošnja energije (kWh)</p>
                            <font-awesome-icon icon="expand" class="expand-icon" @click="openFullscreen('polar')" />
                        </span>
                        <Chart type="polarArea" :data="O2polarChartData" :options="chartOptions"
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
                        <Chart v-if="fullscreenChart === 'pie'" type="pie" :data="combinedChartData"
                            :options="chartOptions" class="fullscreen-chart-content" />
                        <Chart v-if="fullscreenChart === 'polar'" type="polarArea" :data="O2polarChartData"
                            :options="chartOptions" class="fullscreen-chart-content" />
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue';
import { useOpseg2Store } from '~/stores/main-store';

const opseg2Store = useOpseg2Store(); // Inicijaliziraj store
const kespStore = useKespStore();

const toast = useToast();

const izracuni = computed(() => opseg2Store.izracuni);
const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));

const sortedIzracuni = computed(() => {
    return izracuni.value.sort((a, b) => {
        if (a.energija === 'Električna energija' && b.energija !== 'Električna energija') {
            return -1; // A dolazi prije B
        }
        if (a.energija !== 'Električna energija' && b.energija === 'Električna energija') {
            return 1; // B dolazi prije A
        }
        return 0; // Ako su obje iste energije, ostavi redoslijed kakav je
    });
});

function getRowClass(rowData) {
    return rowData.neobnovljivo > 100 ? 'high-energy-row' : '';
}

const kespId = ref(null);

onMounted(async () => {
    const res = await initializeCookie('kesp-id');
    kespId.value = parseInt(res['kesp-id']);
    // opseg2Store.clearStore();
    // await opseg2Store.fetchEnergySources(kespId.value);
})

// const showSuccess = (skupina, vrsta) => {
//     toast.add({ severity: 'success', summary: 'Uspješno dodano', detail: ``, life: 3000 });
// };

const showError = () => {
    toast.add({ severity: 'error', summary: 'Došlo je do greške!', detail: `Vrijednost izvora neuspješno ažurirana.`, life: 3000 });
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

// Ukupne emisije
const totalEmissions = computed(() => opseg2Store.totalEmissions); // Preuzmi ukupne emisije iz getter-a

// Funkcija za završetak uređivanja ćelije
const onCellEditComplete = async (event) => {
    const status = await opseg2Store.onCellEditComplete(event); // Poziva akciju za uređivanje ćelija
    console.log("Status: ", status);

    if (status !== 200 && status !== undefined) {
        showError();
    }
};

// Kombinovani podaci za grafikon
const combinedChartData = computed(() => opseg2Store.combinedChartData); // Preuzmi podatke za grafikon iz getter-a

const O2polarChartData = computed(() => {
    const baseColor = '#f8ae5b';
    const ukupnoPoEnergiji = {};

    // Grupiraj ukupnu potrošnju energije po tipu energije
    izracuni.value.forEach((entry) => {
        const { energija, ukupno } = entry;
        ukupnoPoEnergiji[energija] = (ukupnoPoEnergiji[energija] || 0) + ukupno;
    });

    const labels = Object.keys(ukupnoPoEnergiji);
    const data = Object.values(ukupnoPoEnergiji);
    const colors = labels.map((_, index) => shadeColor(baseColor, index * 10));

    console.log("Ukupno po energiji: ", ukupnoPoEnergiji, labels, data, colors);

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

// Opcije za grafikon
const setChartOptions = () => {
    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: '#000' // Default color
                }
            }
        }
    };
};

const chartOptions = setChartOptions(); // Postavi opcije za grafikon
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

.total-emissions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    /* text-transform: uppercase; */
}

.unos-polje {
    background-color: #be8282;
}

strong {
    /* color: green; */
    text-decoration: underline;
    font-size: 16px;
}

.data-heading span {
    display: flex;
    align-items: center;
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

.required {
    color: var(--red-soft);
}

.p-row-even {
    background-color: #b0b0b0;
}

.high-energy-row {
    background-color: #ffcccc;
    /* Blago crvena pozadina */
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