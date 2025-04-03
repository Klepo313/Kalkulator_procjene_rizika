<template>
  <div>
    <Toolbar class="toolbar" style="display: flex; gap: 5px">
      <template #start>
        <button class="dodaj-btn" @click="$emit('open-new-contract-dialog')">
          <font-awesome-icon icon="plus" />
          Dodaj ugovor
        </button>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      :value="ugovori"
      :rows="10"
      scrollable
      scroll-height="800px"
      :sort-order="1"
      :loading="loading"
      loadingMode="icon"
      size="normal"
      removable-sort
      :global-filter-fields="[
        'ugv_broj',
        'epr_naziv',
        'epr_nazv_tv',
        'ugv_datugv',
        'ugv_datod',
        'ugv_datdo',
        'ugv_kpkr_max',
        'ugv_kesp_max',
      ]"
      table-style="min-width: 60rem"
      @row-expand="onRowExpand"
    >
      <template #header>
        <div class="global-search-container">
          <IconField class="global-search-iconfield input">
            <InputIcon>
              <font-awesome-icon icon="search" />
            </InputIcon>
            <InputText
              v-model="filters.global.value"
              placeholder="Pretraži ugovore"
            />
          </IconField>
          <div class="global-search-iconfield refresh" > <!--@click="refreshData"-->
            <font-awesome-icon icon="rotate-right" class="refresh-icon" />
          </div>
        </div>
      </template>

      <template #empty> Nema potpisanih ugovora. </template>

      <template #loading> Učitavanje ugovora. Molimo pričekajte. </template>

      <template #footer>
        <div class="total-emissions">
          Ukupno potpisanih ugovora: <strong>{{ ugovori.length }}</strong>
        </div>
      </template>

      <!-- <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column> -->

      <Column field="ugv_broj" header="Broj ugovora" headerStyle="width:3rem"/>
      <Column field="epr_naziv" header="Tvrtka">
        <template #body="slotProps">
          <strong>{{ slotProps.data.epr_naziv }}</strong>
        </template>
      </Column>
      <!-- <Column field="epr_nazv_tv" header="Tvrtka ugovaratelja" /> -->
      <Column field="ugv_datugv" header="Datum ugovaranja" sortable>
        <template #body="slotProps">
          {{ formatDateToDMY(slotProps.data.ugv_datugv, '.') }}
        </template>
      </Column>
      <Column field="ugv_datod" header="Početni datum ugovora" sortable>
        <template #body="slotProps">
          {{ formatDateToDMY(slotProps.data.ugv_datod, '.') }}
        </template>
      </Column>
      <Column field="ugv_datdo" header="Krajnji datum ugovora" sortable>
        <template #body="slotProps">
          {{ formatDateToDMY(slotProps.data.ugv_datdo, '.') }}
        </template>
      </Column>
      <Column field="ugv_kpkr_max" header="Broj izračuna za KPKR" sortable/>
      <Column field="ugv_kesp_max" header="Broj izračuna za KESP" sortable/>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useKorisniciStore } from "#build/imports";

const loading = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ugv_broj: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_naziv: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_naziv_tv: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ugv_datugv: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ugv_datod: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ugv_datdo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ugv_kpkr_max: { value: null, matchMode: FilterMatchMode.EXACT },
  ugv_kesp_max: { value: null, matchMode: FilterMatchMode.EXACT },
});

const korisniciStore = useKorisniciStore();

// const ugovori = [
//   {
//     ugv_id: 88101,
//     ugv_epr_id: 8035,
//     epr_naziv: "INFINIA",
//     ugv_epr_id_tv: 7929,
//     epr_nazv_tv: "ATD SOLUCIJE D.O.O.",
//     ugv_broj: "1",
//     ugv_aneks: 0,
//     ugv_vru_id: 1,
//     ugv_datugv: "2025-03-20",
//     ugv_datod: "2025-03-20",
//     ugv_datdo: "2026-03-20",
//     ugv_kpkr_max: 50,
//     ugv_kesp_max: 100,
//     eko_korime: "SBIGEC",
//     ugv_eko_kreirao: 7957,
//     ugv_kreirano: "2025-03-20T14:56:00.735Z",
//     ugv_eko_mijenjao: null,
//     ugv_mijenjano: null,
//   },
// ];
const ugovori = computed(() => korisniciStore.ugovori);

const refreshData = async () => {
  korisniciStore.expandedRows = [];
  await korisniciStore.fetchPravneOsobe();
  korisniciStore.fizickeOsobe = [];
};

onMounted(async () => {
  await korisniciStore.fetchPravneOsobe();
  await korisniciStore.fetchUgovori();
});
</script>

<style scoped>
.datatable,
.toolbar {
  max-width: 1100px;
}
.global-search-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.global-search-iconfield.input {
  width: 100% !important;
}
.global-search-iconfield.refresh {
  width: 26px;
  height: 26px;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.global-search-iconfield:hover {
  background: rgb(236, 236, 236);
}
.global-search-iconfield:hover .refresh-icon {
  transform: rotate(45deg);
}
.global-search-iconfield:active .refresh-icon {
  transform: rotate(120deg);
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  height: 100%;
  padding: 8px;
}
.total-emissions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

:deep(.p-datatable-row-toggle-button) {
  width: auto !important;
  height: auto !important;
}

.dodaj-btn,
.dodaj-partnera-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.dodaj-btn {
  background-color: var(--text-color);
  color: white;
}

.dodaj-btn * {
  color: white;
}

.dodaj-btn:hover {
  background-color: var(--text-color-hover);
}

.dodaj-btn:active {
  background-color: var(--text-color-focus);
}

.dodaj-btn:disabled {
  color: black;
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.dodaj-btn:disabled * {
  color: black;
}

.dodaj-partnera-btn {
  background-color: white;
  border: var(--border);
  color: black;
}

.dodaj-partnera-btn * {
  color: black;
}

.dodaj-partnera-btn:hover {
  background-color: var(--text-color);
  color: white;
}

.dodaj-partnera-btn:hover * {
  color: white;
}

.dodaj-partnera-btn:active {
  background-color: var(--text-color-focus);
}

.dodaj-partnera-btn:active * {
  color: white;
}

.dodaj-korisnika {
  font-weight: 500;
  opacity: 0.8;
  cursor: pointer;
  /* opacity: 0.4;
      cursor: not-allowed; */
}

.dodaj-korisnika:hover {
  opacity: 1;
  text-decoration: underline;
}

.dodaj-korisnika:active {
  opacity: 0.8;
}

.edit-btn {
  color: var(--text-color);
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}
.edit-btn.no-email {
  color: var(--red-soft);
}
.edit-btn.disabled {
  opacity: 0.3;
  cursor: default;
}

.edit-btn:hover {
  background-color: rgb(236, 236, 236);
}

.edit-btn:active {
  background-color: rgb(223, 223, 223);
}

.edit-btn.disabled:hover {
  background-color: rgb(236, 236, 236);
}

.edit-btn.disabled:active {
  background-color: rgb(223, 223, 223);
}

.ukloni-btn:disabled,
.edit-btn:disabled {
  color: var(--text-color);
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.ukloni-btn:disabled *,
.edit-btn:disabled * {
  color: var(--text-color);
}
</style>
