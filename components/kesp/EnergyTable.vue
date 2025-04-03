<template>
  <div class="data-item">
    <DataTable
      :value="sortedIzracuni"
      show-gridlines
      edit-mode="cell"
      :rows="5"
      data-key="id"
      :rowClass="getRowClass"
      @cell-edit-complete="onCellEditComplete"
    >
      <template #empty> Nema energija </template>

      <Column header="Broj">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <Column header="Vrsta energije" field="energija">
        <template #body="slotProps">
          <template v-if="slotProps.data.energija === 'Električna energija'">
            <font-awesome-icon
              icon="bolt-lightning"
              style="margin-right: 5px"
            />
            {{ slotProps.data.energija }}
          </template>
          <template
            v-else-if="slotProps.data.energija === 'Toplinska energija'"
          >
            <font-awesome-icon icon="mug-hot" style="margin-right: 5px" />
            {{ slotProps.data.energija }}
          </template>
        </template>
      </Column>

      <Column header="Neobnovljiva energija (kWh)" field="neobnovljivo">
        <template v-if="editable" #editor="slotProps">
          <InputNumber
            v-model="slotProps.data.neobnovljivo"
            :show-buttons="true"
            mode="decimal"
            min="0"
          />
        </template>
        <template #body="slotProps">
          <span :class="getCellClass(slotProps.data, 'neobnovljivo')">
            {{ formatNumber(slotProps.data.neobnovljivo) }}
          </span>
        </template>
      </Column>

      <Column
        header="Obnovljiva energija predana u mrežu (kWh)"
        field="obnovljivo"
      >
        <template v-if="editable" #editor="slotProps">
          <InputNumber
            v-model="slotProps.data.obnovljivo"
            :show-buttons="true"
            mode="decimal"
            min="0"
          />
        </template>
        <template #body="slotProps">
          <span :class="getCellClass(slotProps.data, 'obnovljivo')">
            {{ formatNumber(slotProps.data.obnovljivo) }}
          </span>
        </template>
      </Column>
      <Column header="Osnova za izračun emisija (kWh)" field="ukupno">
        <template #body="slotProps">
          {{ formatNumber(slotProps.data.ukupno) }}
        </template>
      </Column>
      <Column
        :header="`Emisija eCO2/${editable ? 'kg' : 't'} (prema tržištu)`"
        field="emisije"
      >
        <template #body="slotProps">
          <span
            :class="getCellClass(slotProps.data, 'emisije')"
            v-tooltip.top="getTooltip(slotProps.data)"
          >
            {{
              editable
                ? formatNumber(slotProps.data.emisije, 2)
                : formatNumber(slotProps.data.emisije / 1000, 2)
            }}
          </span>
        </template>
      </Column>
      <Column
        :header="`Emisija eCO2/${editable ? 'kg' : 't'} (prema lokaciji)`"
        field="emisije_lok"
      >
        <template #body="slotProps">
          <span
            :class="getCellClass(slotProps.data, 'emisije')"
            v-tooltip.top="getTooltip(slotProps.data)"
          >
            {{
              editable
                ? formatNumber(slotProps.data.emisije_lok, 2)
                : formatNumber(slotProps.data.emisije_lok / 1000, 2)
            }}
          </span>
        </template>
      </Column>

      <template #footer>
        <div class="total-emissions">
          <div>
            <span
              >Ukupna emisija (prema tržištu) eCO<sub>2</sub>/{{
                editable ? "kg" : "t"
              }}:
            </span>
            <strong
              >{{
                editable
                  ? formatNumber(totalEmissions, 4)
                  : formatNumber(totalEmissions / 1000, 2)
              }}
            </strong>
          </div>
          <div>
            <span>
              Ukupna emisija (prema lokaciji) eCO<sub>2</sub>/{{
                editable ? "kg" : "t"
              }}:
            </span>
            <strong>{{
              editable
                ? formatNumber(totalLokEmissions, 4)
                : formatNumber(totalLokEmissions / 1000, 2)
            }}</strong>
          </div>
        </div>
      </template>
    </DataTable>

    <button
      v-if="editable"
      class="dodaj-btn spremi-promjene"
      @click="spremiPromjene"
      :disabled="!imaPromjena || !isValidData"
    >
      <font-awesome-icon icon="floppy-disk" />
      Spremi promjene
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  editable: Boolean,
  data: Array,
});

const opseg2Store = useOpseg2Store();

const emit = defineEmits(["save"]);

const toast = useToast();
const originalData = ref(JSON.parse(JSON.stringify(props.data)));
const izracuni = ref(JSON.parse(JSON.stringify(props.data)));
const imaPromjena = ref(false);

// Ukupne emisije
const totalEmissions = computed(() => opseg2Store.totalEmissions); // Preuzmi ukupne emisije iz getter-a
const totalLokEmissions = computed(() => opseg2Store.totalLokEmissions); // Preuzmi ukupne emisije iz getter-a
const totalCO2Emissions = computed(() => opseg2Store.totalCO2Emissions);

const sortedIzracuni = computed(() =>
  [...izracuni.value].sort((a, b) =>
    a.energija === "Električna energija"
      ? -1
      : b.energija === "Električna energija"
      ? 1
      : 0
  )
);

watch(
  () => props.data,
  (newData) => {
    originalData.value = JSON.parse(JSON.stringify(newData));
    izracuni.value = JSON.parse(JSON.stringify(newData));
  },
  { immediate: true, deep: true }
);

const getTooltip = (row) => {
  const originalRow = originalData.value.find((item) => item.id === row.id);
  if (!originalRow) return "";
  return row.emisije !== originalRow.emisije
    ? "Vrijednost možda nije istinita jer su se desile nespremljene promjene na formi."
    : "";
};

const onCellEditComplete = (event) => {
  const { data, newValue, field } = event;
  data[field] = newValue;
  checkForChanges();
};

function getRowClass(rowData) {
  return rowData.neobnovljivo > 100 ? "high-energy-row" : "";
}

const checkForChanges = () => {
  imaPromjena.value =
    JSON.stringify(izracuni.value) !== JSON.stringify(originalData.value);
};

const spremiPromjene = () => {
  if (!isValidData.value) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Podaci ne smiju imati negativne vrijednosti.",
      life: 3000,
    });
    return;
  }
  imaPromjena.value = false;
  emit("save", izracuni.value);
};

const vratiOriginalno = () => {
  izracuni.value = JSON.parse(JSON.stringify(originalData.value));
  imaPromjena.value = false;
};

const getCellClass = (row, field) => {
  const originalRow = originalData.value.find((item) => item.id === row.id);
  if (!originalRow) return "";
  return row[field] !== originalRow[field] ? "highlighted-cell" : "";
};

const isValidData = computed(() => {
  return izracuni.value.every(
    (row) => row.neobnovljivo >= 0 && row.obnovljivo >= 0
  );
});
</script>

<style scoped>
.highlighted-cell {
  background-color: #ffeeba;
  font-weight: bold;
  color: #d48712 !important;
  text-decoration: underline 2px;
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

.dodaj-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: white;
}

.dodaj-btn * {
  color: white;
}
.vrati-promjene * {
  color: var(--text-color);
}

.spremi-promjene {
  cursor: pointer;
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

.spremi-promjene:disabled * {
  color: var(--text-color) !important;
}

.vrati-promjene {
  cursor: pointer;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  color: var(--text-color);
}

.vrati-promjene:hover {
  background-color: #e0e0e0;
}

.vrati-promjene:active {
  background-color: #d0d0d0;
}

.vrati-promjene:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
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
</style>
