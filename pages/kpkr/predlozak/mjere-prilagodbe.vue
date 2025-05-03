<template>
  <div class="body-container">
    <main class="page-main">
      <h1>Mjere prilagodbe</h1>

      <div class="content-wrapper">
        <span v-if="!idIzracuna" class="loading-text">
          <font-awesome-icon icon="spinner" spin />
          Učitavanje mjera prilagodbe
        </span>
        <div v-else class="lists-container">
          <!-- Odabrane mjere prilagodbe -->
          <section class="selected-section">
            <h2>Odabrane mjere prilagodbe</h2>
            <DataTable
              :value="odabraneMjerePrilagodbe"
              removableSort
              paginator
              :rows="5"
              stripedRows>
              <template #empty> Nema odabranih mjera prilagodbe. </template>
              <Column field="tva_sif" header="Šifra" sortable />
              <Column field="tva_naziv" header="Naziv" sortable />
              <Column field="tgr_naziv" header="Grupa" sortable />
            </DataTable>
          </section>

          <!-- Popis svih mjera prilagodbe s filtrima -->
          <section class="all-section">
            <h2>Popis mjera prilagodbe</h2>

            <!-- checkbox filter po grupama -->
            <div class="checkbox-group">
              <div
                v-for="cat in grupeMjeraPrilagodbe"
                :key="cat"
                class="checkbox-item">
                <Checkbox
                  v-model="odabraneGrupeMjeraPrilagodbe"
                  :inputId="cat"
                  :value="cat" />
                <label :for="cat">{{ cat }}</label>
              </div>
            </div>

            <!-- data table s ugrađenim globalnim filterom -->
            <DataTable
              v-model:filters="filters"
              v-model:selection="odabraneMjerePrilagodbe"
              :value="filteredMjerePrilagodbe"
              scrollable
              scrollHeight="calc(100vh - 300px)"
              :rows="10"
              dataKey="tva_sif"
              filterDisplay="menu"
              :globalFilterFields="['tva_sif', 'tva_naziv', 'tgr_naziv']"
              @update:selection="onSelectionChange">
              <template #header>
                <div class="flex justify-between">
                  <IconField>
                    <InputIcon>
                      <font-awesome-icon icon="search" />
                    </InputIcon>
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Pretraži mjere prilagodbe" />
                  </IconField>
                </div>
              </template>
              <template #empty>
                Nijedna grupa mjera prilagodba nije odabrana.
              </template>
              <template #loading>
                Učitavanje mjera prilagodbe. Molimo pričekajte.
              </template>
              <Column
                selectionMode="multiple"
                header="#"
                headerStyle="width: 3rem" />
              <Column field="tva_sif" header="Šifra" style="min-width: 7rem">
                <template #body="{ data }">
                  {{ data.tva_sif }}
                </template>
              </Column>
              <Column field="tva_naziv" header="Naziv" style="min-width: 14rem">
                <template #body="{ data }">
                  <div
                    class="template-div flex items-center gap-2"
                    @click="toggleOp(data.tva_id, $event)"
                    @mouseenter="toggleOp(data.tva_id, $event)"
                    @mouseleave="toggleOp(data.tva_id, $event)">
                    <span>{{ data.tva_naziv }}</span>
                  </div>
                  <!-- Dinamički popover :title="data.tva_opis" -->
                  <Popover :ref="setPopoverRef(data.tva_id)">
                    <div class="popover">
                      <ul>
                        <li
                          v-for="(item, index) in splitOpis(data.tva_opis)"
                          :key="index">
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                  </Popover>
                </template>
              </Column>
              <Column field="tgr_naziv" header="Grupa">
                <template #body="{ data }">
                  {{ data.tgr_naziv }}
                </template>
              </Column>
            </DataTable>
          </section>
        </div>
      </div>
    </main>

    <footer class="page-footer">
      <button
        class="footer-btn"
        @click="navigateWithParameter('/kpkr/predlozak', 'id', idIzracuna!)">
        <font-awesome-icon icon="arrow-left-long" /> Opći podaci
      </button>
      <button
        class="footer-btn"
        @click="
          navigateWithParameter(
            '/kpkr/predlozak/rizik-sazetak',
            'id',
            idIzracuna!
          )
        ">
        Izračunaj rizik <font-awesome-icon icon="arrow-right-long" />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAdaptStore, type Mjera } from "~/stores/main-store";

/** 1) Props iz `NuxtPage` */
interface Props {
  aizId: string | null;
  izracun: any;
  vrsteIzracuna: any[];
  vrsteImovine: any[];
  djelatnosti: any[];
  scenariji: any[];
  katastarskeOpcine: any[];
  mjerePrilagodbe: any[];
  loading: boolean;
}
const props = defineProps<Props>();
const adaptStore = useAdaptStore();

const filters = ref({
  global: { value: "" },
});

const popoverRefs = ref({});
const idIzracuna = computed(() => props.aizId);

const mjerePrilagodbe = computed<Mjera[]>(() =>
  [...adaptStore.adaptacijske_mjere].sort(
    (a, b) => parseInt(a.tva_sif) - parseInt(b.tva_sif)
  )
);

const odabraneMjerePrilagodbe = computed(() =>
  adaptStore.odabrane_mjere.sort(
    (a, b) => parseInt(a.tva_sif) - parseInt(b.tva_sif)
  )
);

watch(
  idIzracuna,
  async () => {
    console.log("idIzracuna", idIzracuna.value);
    if (idIzracuna.value) {
      await adaptStore.fetchMetrictypes(idIzracuna.value);
      console.log("mjerePrilagodbe", mjerePrilagodbe.value);
      console.log("odabraneMjerePrilagodbe", odabraneMjerePrilagodbe.value);
    }
  },
  { immediate: true }
);

const grupeMjeraPrilagodbe = computed<string[]>(() =>
  Array.from(new Set(mjerePrilagodbe.value.map((m) => m.tgr_naziv)))
);
const odabraneGrupeMjeraPrilagodbe = ref<string[]>([]);

watch(
  grupeMjeraPrilagodbe,
  () => {
    odabraneGrupeMjeraPrilagodbe.value = [...grupeMjeraPrilagodbe.value];
  },
  { immediate: true }
);

const filteredMjerePrilagodbe = computed<Mjera[]>(() => {
  // ako nema nijedne grupe, prikaži sve
  if (odabraneGrupeMjeraPrilagodbe.value.length === 0) {
    return [];
  }
  return mjerePrilagodbe.value.filter((m) =>
    odabraneGrupeMjeraPrilagodbe.value.includes(m.tgr_naziv)
  );
});

const onSelectionChange = async (newSelection: Mjera[]) => {
  const id = idIzracuna.value;
  if (!id) return;

  const current = adaptStore.odabrane_mjere;

  // 1) Izračunaj koje treba dodati i koje obrisati
  const toAdd = newSelection.filter(
    (m) => !current.some((c) => c.tva_sif === m.tva_sif)
  );
  const toRemove = current.filter(
    (m) => !newSelection.some((n) => n.tva_sif === m.tva_sif)
  );

  // 2) Pošalji sve API pozive paralelno
  await Promise.all([
    ...toAdd.map((m) => adaptStore.addMetrictype(id, m.tva_id)),
    ...toRemove.map((m) => adaptStore.deleteMetrictype(id, m.tva_id)),
  ]);

  // 3) Ažuriraj lokalni state odabrane_mjere jednom listom
  adaptStore.odabrane_mjere = [
    // zadrži stare koje nisu uklonjene
    ...current.filter((m) => !toRemove.some((r) => r.tva_sif === m.tva_sif)),
    // dodaj nove
    ...toAdd,
  ];
};

// Funkcija za dinamično postavljanje ref-a
const setPopoverRef = (id) => {
  return (el) => {
    if (el) {
      popoverRefs.value[id] = el;
    }
  };
};

const toggleOp = (id: string, event: any) => {
  const popover = popoverRefs.value[id];
  if (popover) {
    popover.toggle(event); // Otvori ili zatvori odgovarajući popover
  }
};
</script>

<style scoped>
:deep(.p-datatable-column-header-content .p-checkbox) {
  display: none !important;
}
.content-wrapper {
  margin-top: 1rem;
}

.lists-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.selected-section,
.all-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Checkbox filter */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* prostor između checkboxa i labele */
}

/* Footer */
.page-footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.footer-btn {
  padding: 0.5rem 1rem;
}

.template-div {
  cursor: pointer;
}

.mjere-list,
.mjere-list-odabrane,
.main-content-container {
  /* outline: auto; */

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-content-container {
  gap: 26px;
}

.mjere-list-table {
  position: relative;
  /* Ovo je potrebno za pozicioniranje gradijenta */
  overflow-y: auto;
  /* Omogućava vertikalni scroll */
}

.mjere-list-table::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  pointer-events: none;
}

.mjere-list-header {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
}

.p-checkbox {
  width: auto;
}

.p-checkbox-label {
  margin-left: 5px;
}

.body-container {
  height: 100%;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  /* align-items: space-between; */
  gap: 26px;
}

h1 {
  width: 100%;
  text-align: left;
  padding-bottom: 7px;
  border-bottom: 2px solid var(--text-color);
}

.page-main {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

h2 {
  font-size: 18px;
  color: var(--primary-color);
}

.main-content {
  width: 80%;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.custom-table th,
.custom-table td {
  height: 42.5px;
  padding: 5px 12px;

  color: var(--text-color);
  text-align: left;
  border-bottom: var(--border);
}

.custom-table thead th {
  background-color: var(--input-focus-color);
  font-weight: bold;
}

.empty-th {
  color: var(--red) !important;
  text-align: right !important;
}

.minus-icon {
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.minus-icon:hover {
  background-color: #a32b2b20;
}

th:first-child {
  border-top-left-radius: 5px;
}

th:last-child {
  border-top-right-radius: 5px;
}

.custom-table tbody tr:nth-child(even) {
  background-color: var(--bg-color);
}

.custom-table tbody tr:nth-child(odd) {
  background-color: var(--bg-color);
}

.grid-item {
  outline: auto;
}

.action-div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info {
  margin-top: 10px;
  opacity: 0.5;
}

#saveBtn {
  width: 150px;
  background: none;
  border: var(--border);
  color: var(--text-color);
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

#saveBtn:hover {
  background-color: var(--primary-color);
  color: white;
}

#saveBtn:hover > .save-icon {
  color: white;
}

#saveBtn:active {
  background-color: var(--primary-color-focus);
}

.newRow {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.select-mjere {
  width: 100%;
}

.newMjeraBtn {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.newMjeraBtn span {
  text-wrap: nowrap;
}

.p-select {
  height: 38px !important;
  width: 100%;
  padding-top: 2px !important;
  background-color: var(--input-color) !important;
  border: var(--border) !important;
  border-radius: var(--border-form-radius) !important;
  color: var(--text-color);
}

.p-select-label {
  display: flex !important;
  align-items: center !important;
}

.p-select-label.p-placeholder span {
  opacity: 0.4;
}

.ui-tooltip {
  border: 1px solid #ccc;
  box-shadow: 0 0 10px 0 #ddd;
  -moz-box-shadow: 0 0 10px 0 #ddd;
  -webkit-box-shadow: 0 0 10px 0 #ddd;
  color: #666;
  background: #f8f8f8;
}

.p-popover-content {
  background-color: var(--input-color) !important;
}

.popover {
  max-width: 600px;
  background-color: var(--input-color);
  padding: 10px;
  border-radius: 5px;
}

.popover ul {
  list-style-type: disc;
  /* Ili možeš staviti 'none' za bez oznaka */
  padding-left: 1.2rem;
  /* Udaljenost lijevo za stavke liste */
}

.popover li {
  margin-bottom: 0.3rem;
  /* Razmak između stavki */
}

@media screen and (max-width: 1500px) {
  .main-content {
    width: 80%;
  }
}

@media screen and (max-width: 1280px) {
  .main-content {
    width: 100%;
  }
}
</style>
