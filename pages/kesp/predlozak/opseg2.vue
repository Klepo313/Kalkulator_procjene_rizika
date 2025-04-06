<template>
  <div class="body">
    <Toast />
    <main>
      <h1>{{ "Opseg 2" }}</h1>
      <div class="main-content">
        <section>
          <div>
            <h2>Vremensko razdoblje izračuna</h2>
            <p>Vremensko razdoblje za kojeg se unose podaci</p>
          </div>
          <div class="razdoblje">
            <!-- <VremenskoRazdoblje /> -->
            <div>
              <div>
                <label for="startDate"> Početak razdoblja </label>
                <DatePicker
                  id="startDate"
                  v-model="datumOd"
                  date-format="dd.mm.yy"
                  show-icon
                  fluid
                  icon-display="input"
                  placeholder="Početni datum"
                  readonly
                />
              </div>
              <div>
                <label for="endDate"> Kraj razdoblja </label>
                <DatePicker
                  id="endDate"
                  v-model="datumDo"
                  date-format="dd.mm.yy"
                  show-icon
                  fluid
                  icon-display="input"
                  placeholder="Krajnji datum"
                  readonly
                />
              </div>
            </div>
          </div>
        </section>
        <section class="main-data">
          <div class="data-heading">
            <h2>Neizravne emisije stakleničkih plinova</h2>
            <p>
              Emisije iz kupljene energije koje nastaju izvan lokacije
              organizacije:
            </p>
            <ul>
              <li>Neizravne emisije zbog potrošnje električne energije</li>
              <li>Neizravne emisije zbog potrošnje toplinske energije</li>
              <li>Neizravne emisije zbog proizvodnje električne energije iz
                obnovljivih izvora
              </li>
            </ul>
          </div>
          <EnergyTable
            :editable="isEditable"
            :data="izracuni"
            @save="spremiPromjene"
          />
        </section>
      </div>
      <div
        v-if="
          izracuni.some(
            (item) => item.neobnovljivo !== null || item.obnovljivo !== null
          )
        "
        class="stats-content"
      >
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
              <p>Emisije eCO<sub>2</sub>/kg (%)</p>
              <font-awesome-icon
                icon="expand"
                class="expand-icon"
                @click="openFullscreen('pie')"
              />
            </span>
            <Chart
              type="pie"
              :data="combinedChartData"
              :options="chartOptions"
              class="w-full md:w-[30rem]"
            />
          </div>
          <div class="chart-container" style="margin-top: 20px">
            <span>
              <p>Ukupna potrošnja energije [kWh] (%)</p>
              <font-awesome-icon
                icon="expand"
                class="expand-icon"
                @click="openFullscreen('polar')"
              />
            </span>
            <Chart
              type="pie"
              :data="O2polarChartData"
              :options="chartOptions"
              class="w-full md:w-[30rem]"
            />
          </div>
        </div>
        <!-- Fullscreen Chart Modal -->
        <div
          v-if="fullscreenChart"
          class="fullscreen-overlay"
          @click="closeFullscreen"
        >
          <div class="fullscreen-chart" @click.stop>
            <font-awesome-icon
              icon="times"
              class="close-icon"
              @click="closeFullscreen"
            />
            <span v-if="fullscreenChart === 'pie'">
              <h2>Emisije eCO<sub>2</sub>/kg (%)</h2>
            </span>
            <span v-if="fullscreenChart === 'polar'">
              <h2>Ukupna potrošnja energije [kWh] (%)</h2>
            </span>
            <Chart
              v-if="fullscreenChart === 'pie'"
              type="pie"
              :data="combinedChartData"
              :options="chartOptions"
              class="fullscreen-chart-content"
            />
            <Chart
              v-if="fullscreenChart === 'polar'"
              type="pie"
              :data="O2polarChartData"
              :options="chartOptions"
              class="fullscreen-chart-content"
            />
          </div>
        </div>
      </div>
    </main>
    <footer />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useOpseg2Store } from "~/stores/main-store";
import EnergyTable from "~/components/kesp/EnergyTable.vue";

const opseg2Store = useOpseg2Store(); // Inicijaliziraj store
const kespStore = useKespStore();

const toast = useToast();

const isEditable = ref(true);
const izracuni = computed(() =>
  JSON.parse(JSON.stringify(opseg2Store.izracuni))
);
const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, "."));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, "."));

const sortedIzracuni = computed(() =>
  [...izracuni.value].sort((a, b) =>
    a.energija === "Električna energija"
      ? -1
      : b.energija === "Električna energija"
      ? 1
      : 0
  )
);

const originalData = ref([]);
const imaPromjena = ref(false);

function getRowClass(rowData) {
  return rowData.neobnovljivo > 100 ? "high-energy-row" : "";
}

const props = defineProps({
  uiz_id: {
    type: String,
    required: true,
  },
});

const kespId = ref(props.uiz_id);

const fetchData = async () => {
  await opseg2Store.fetchEnergySources(kespId.value);
  originalData.value = JSON.parse(JSON.stringify(opseg2Store.izracuni)); // Duboka kopija
  imaPromjena.value = false;
};

// Provjera promjena u tablici
const checkForChanges = () => {
  imaPromjena.value = izracuni.value.some((item, index) => {
    return JSON.stringify(item) !== JSON.stringify(originalData.value[index]);
  });
};

// Klasa za isticanje promijenjenih vrijednosti
const getCellClass = (row, field) => {
  const originalRow = originalData.value.find((item) => item.id === row.id);
  if (!originalRow) return "";
  return row[field] !== originalRow[field] ? "highlighted-cell" : "";
};

// Tooltip za emisije ako su nespremljene promjene
const getTooltip = (row) => {
  const originalRow = originalData.value.find((item) => item.id === row.id);
  if (!originalRow) return "";
  return row.emisije !== originalRow.emisije
    ? "Vrijednost možda nije istinita jer su se desile nespremljene promjene na formi."
    : "";
};

onMounted(async () => {
  await fetchData();
});

watch(izracuni, checkForChanges, { deep: true });

const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Uspješno dodano",
    detail: `Vrijednost izvora uspješno ažurirana.`,
    life: 3000,
  });
};

const showError = () => {
  toast.add({
    severity: "error",
    summary: "Došlo je do greške!",
    detail: `Vrijednost izvora neuspješno ažurirana.`,
    life: 3000,
  });
};

const fullscreenChart = ref(null);

function openFullscreen(chartType) {
  fullscreenChart.value = chartType;
  document.body.style.overflow = "hidden"; // Disable scrolling
}

function closeFullscreen() {
  fullscreenChart.value = null;
  document.body.style.overflow = ""; // Re-enable scrolling
}

onBeforeUnmount(() => {
  document.body.style.overflow = ""; // Reset overflow on component unmount
});

// Ukupne emisije
const totalEmissions = computed(() => opseg2Store.totalEmissions); // Preuzmi ukupne emisije iz getter-a
const totalLokEmissions = computed(() => opseg2Store.totalLokEmissions); // Preuzmi ukupne emisije iz getter-a

const noviPodaci = ref([]);

// Funkcija za završetak uređivanja ćelije
const onCellEditComplete = async (event) => {
  const { data, newValue, field } = event;
  data[field] = newValue;

  // Pronađi indeks objekta s istom energijom unutar opseg2Store.izracuni
  const index = opseg2Store.izracuni.findIndex(
    (item) => item.energija === data.energija
  );

  if (index !== -1) {
    // Zamijeni postojeći objekt novim objektom data
    opseg2Store.izracuni[index] = { ...data };
    noviPodaci.value.push = { ...data };
    // console.log("Ažuriran objekt u opseg2Store:", opseg2Store.izracuni[index], noviPodaci.value);
  } else {
    console.warn("Objekt s tom energijom nije pronađen u opseg2Store.");
  }

  checkForChanges();
};

const spremiPromjene = async (podaci) => {
  console.log("podaci: ", podaci);
  try {
    opseg2Store.izracuni = podaci;
    await opseg2Store.updateEnergyItems();
    await fetchData();
    toast.add({
      severity: "success",
      summary: "Uspješno",
      detail: "Podaci uspješno spremljeni.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Došlo je do greške prilikom spremanja.",
      life: 3000,
    });
  }
};

// Kombinovani podaci za grafikon
const combinedChartData = computed(() => opseg2Store.combinedChartData); // Preuzmi podatke za grafikon iz getter-a

const O2polarChartData = computed(() => {
  const baseColor = "#f8ae5b";
  const ukupnoPoEnergiji = {};

  // Grupiraj ukupnu potrošnju energije po tipu energije
  izracuni.value.forEach((entry) => {
    const { energija, ukupno } = entry;
    ukupnoPoEnergiji[energija] = (ukupnoPoEnergiji[energija] || 0) + ukupno;
  });

  const labels = Object.keys(ukupnoPoEnergiji);
  const data = calculatePercentage(Object.values(ukupnoPoEnergiji));
  const colors = labels.map((_, index) => shadeColor(baseColor, index * 10));

  // console.log("Ukupno po energiji: ", ukupnoPoEnergiji, labels, data, colors);

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
          color: "#000", // Default color
        },
      },
    },
  };
};

const chartOptions = setChartOptions(); // Postavi opcije za grafikon
</script>

<style scoped>
.highlighted-cell {
  font-weight: bold;
  color: #d48712 !important;
  text-decoration: underline 2px;
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

/* Osigurava da se sadržaj ne širi izvan viewporta */
main {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 250px);
  grid-template-rows: min-content auto;
  gap: 34px;
  width: 100%;
  max-width: 100vw; /* main se ne širi izvan širine viewporta */
  margin: 0;
  height: 100%;
  overflow: hidden; /* sprječava prelijevanje sadržaja */
}

main > * {
  overflow: hidden; /* sprječava prelijevanje sadržaja */
}

/* Ograniči širinu .main-content i centriraj sadržaj */
.main-content {
  width: 100%;
  max-width: 1100px; /* maksimalna širina sadržaja */
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin: 0; /* centriranje unutar grid stupca */
  box-sizing: border-box;
}

/* .stats-content ostaje isto, uz responzivno sužavanje */
.stats-content {
  width: clamp(200px, 100%, 300px);
  padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.stats-content .chart-container,
.stats-content .chart-container > * {
  width: 100% !important;
  max-width: 100%;
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

section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

section > div {
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

.stats-content > div {
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

.chart-container > span {
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

.spremi-promjene {
  margin-top: 8px;
  align-self: flex-end;
  width: 200px;

  background-color: var(--kesp-primary);
}

.spremi-promjene:hover {
  background-color: var(--kesp-primary-hover);
}

.spremi-promjene:active {
  background-color: var(--kesp-primary-focus);
}

.spremi-promjene:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
  color: var(--text-color) !important;
}

.razdoblje {
  max-width: 500px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.razdoblje > div,
.razdoblje > div > div,
.razdoblje > span {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.razdoblje > div {
  flex-direction: row;
}

.razdoblje > span {
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

.fullscreen-chart-content > canvas {
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
