<template>
    <div class="body">
        <main>
            <h1>{{ 'GHG opseg 2' }}</h1>
            <div class="main-content">
                <section class="main-heading">
                    <div>
                        <h2>Metoda izračuna:</h2>
                        <p>
                            U GHG Scope 2 (Opseg 2) spada potrošnja električne
                            energije kupljena od opskrbljivača i
                            potrošnja toplinske energije nabavljene od dobavljača.
                            <br>
                            Podaci o količini mogu se očitati sa mjerila (ukoliko posoji) ili sa računa dobavljača.

                        </p>
                    </div>
                </section>
                <section class="main-data">
                    <div class="data-heading">
                        <h2>Izračun GHG opseg 2</h2>
                        <span>
                            <label for="godina">Godina</label>
                            <Dropdown id="godina" v-model="selectedYear" :options="yearOptions" optionLabel="year"
                                placeholder="Odaberi godinu" @change="updateIzracuni" />
                        </span>
                    </div>
                    <div class="data-item">
                        <!-- <Toolbar class="mb-6" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" @click="openNewIzracun">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj izračun
                                </button>
                            </template>
<template #end>
                                <button class="ukloni-btn" :disabled="!selectedIzracun"
                                    @click="openIzracunDeleteDialog">
                                    <font-awesome-icon icon="minus" /> Ukloni izračun
                                </button>
                            </template>
</Toolbar> -->

                        <DataTable :value="izracuni" show-gridlines edit-mode="cell" :rows="5" data-key="id"
                            @cell-edit-complete="onCellEditComplete">

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
                                        mode="decimal" @change="updateCalculations(slotProps.data)" />
                                </template>
                                <template #body="slotProps">
                                    {{ slotProps.data.neobnovljivo !== null ? slotProps.data.neobnovljivo : '' }}
                                </template>
                            </Column>

                            <Column header="Obnovljivo (kWh)" field="obnovljivo">
                                <template #editor="slotProps">
                                    <InputNumber v-model="slotProps.data.obnovljivo" :show-buttons="true" mode="decimal"
                                        @change="updateCalculations(slotProps.data)" />
                                </template>
                                <template #body="slotProps">
                                    {{ slotProps.data.obnovljivo !== null ? slotProps.data.obnovljivo : '' }}
                                </template>
                            </Column>

                            <Column header="Ukupna potrošnja (kWh)" field="ukupno" sortable>
                                <template #body="slotProps">
                                    {{ slotProps.data.ukupno }}
                                </template>
                            </Column>

                            <Column header="Emisije CO2/kg" field="emisije" sortable>
                                <template #body="slotProps">
                                    {{ slotProps.data.emisije.toFixed(2) }}
                                </template>
                            </Column>

                            <template #footer>
                                <div class="total-emissions">
                                    <div>
                                        <span>Ukupno emisija CO<sub>2</sub>: </span>
                                        <strong>{{ totalEmissions }}</strong> kg
                                    </div>
                                </div>
                            </template>
                        </DataTable>

                        <!-- <Dialog v-model:visible="voziloDialogVisible" header="Dodaj vozilo" :modal="true"
                            :style="{ width: '450px' }" @hide="resetVoziloForm">
                            <form class="p-fluid" @submit.prevent="saveVozilo">
                                <div class="field">
                                    <label for="skupinaVozila">Skupina vozila</label>
                                    <Select id="skupinaVozila" v-model="vozilo.vozilo.skupina" :options="vrsteVozila"
                                        option-label="value" option-value="value" placeholder="Odaberi skupinu vozila"
                                        @change="onSkupinaChange" required />
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
                        </Dialog> -->
                    </div>
                </section>
            </div>
            <div class="stats-content">
                <div>
                    <span class="stats-title">
                        <font-awesome-icon icon="chart-pie" />
                        <h2 style="border-bottom: none; padding: 0">Statistika</h2>
                    </span>
                </div>
                <hr>
                <div class="stats-table">
                    <div class="chart-container">
                        <span>
                            <p>Ukupne emisije CO<sub>2</sub>/kg</p>
                        </span>
                        <Chart type="pie" :data="combinedChartData" :options="chartOptions"
                            class="w-full md:w-[30rem]" />
                    </div>
                </div>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Opcije godina od 2015. do 2022.
const yearOptions = computed(() => {
    const years = [];
    for (let year = 2015; year < new Date().getFullYear(); year++) {
        years.push({ year });
    }
    return years;
});

const selectedYear = ref(null); // Trenutno odabrana godina

// Funkcija za ažuriranje 'izracuni' na osnovu odabrane godine
const updateIzracuni = () => {
    if (selectedYear.value) {
        // Ovdje možeš dodati logiku za ažuriranje podataka
        console.log(`Odabrana godina: ${selectedYear.value.year}`);
        // Na primer, možeš resetovati podatke ili učitati specifične podatke za odabranu godinu
    }
};

// Početni podaci za izračune
const izracuni = ref([
    {
        id: 1,
        energija: 'Električna energija',
        neobnovljivo: null,
        obnovljivo: null,
        ukupno: 0,
        emisije: 0,
        koeficijent: 0.12 // Koeficijent za emisije CO2
    },
    {
        id: 2,
        energija: 'Toplinska energija',
        neobnovljivo: null,
        obnovljivo: null,
        ukupno: 0,
        emisije: 0,
        koeficijent: 0.4 // Koeficijent za emisije CO2
    }
]);

// Funkcija za izračunavanje ukupne potrošnje i emisija
const updateCalculations = (rowData) => {
    const neobnovljivo = rowData.neobnovljivo || 0;
    const obnovljivo = rowData.obnovljivo || 0;
    rowData.ukupno = neobnovljivo + obnovljivo;
    rowData.emisije = rowData.ukupno * rowData.koeficijent;
};

// Ukupne emisije
const totalEmissions = computed(() => {
    return izracuni.value.reduce((total, row) => total + row.emisije, 0).toFixed(2);
});

// Ažurirana funkcija za završetak uređivanja ćelije
const onCellEditComplete = (event) => {
    const { data, newValue, field } = event;

    switch (field) {
        case 'neobnovljivo':
        case 'obnovljivo':
            if (isPositiveInteger(newValue)) {
                data[field] = newValue;
                updateCalculations(data); // Ažuriraj izračune nakon unosa
            } else {
                event.preventDefault(); // Spriječi unos ako nije pozitivan cijeli broj
            }
            break;

        default:
            if (newValue.trim().length > 0) {
                data[field] = newValue;
                updateCalculations(data); // Ažuriraj izračune nakon unosa
            } else {
                event.preventDefault(); // Spriječi unos ako je prazan
            }
            break;
    }
};

// Funkcija za provjeru pozitivnih cijelih brojeva
const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();

    if (!str) {
        return false;
    }

    str = str.replace(/^0+/, '') || '0';
    const n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
};

const combinedChartData = computed(() => {
    // Proveri da li postoji barem jedan obnovljivi ili neobnovljivi izvor
    const hasData = izracuni.value.some(row => row.neobnovljivo !== null || row.obnovljivo !== null);

    const labels = izracuni.value.map(row => row.energija);
    const data = izracuni.value.map(row => row.emisije);

    if (!hasData) {
        return {
            labels,
            datasets: [
                {
                    data: [0, 0], // Prikazuje [0, 0] kada nema podataka
                    backgroundColor: ['#2cc23f', '#1e822a'], // Zeleno za električnu energiju, Žute za toplinsku
                    hoverBackgroundColor: ['#2cc23a', '#1e8211']
                }
            ]
        };
    }


    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: ['#2cc23f', '#1e822a'], // Zeleno za električnu energiju, Žute za toplinsku
                hoverBackgroundColor: ['#2cc23a', '#1e8211']
            }
        ]
    };
});



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

.total-emissions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    /* text-transform: uppercase; */
}

.data-heading span {
    display: flex;
    align-items: center;
    gap: 10px;
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
</style>