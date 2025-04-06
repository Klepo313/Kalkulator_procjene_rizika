<template>
  <div>
    <Toolbar class="toolbar" style="display: flex; gap: 5px">
      <template #start>
        <button class="dodaj-btn" @click="$emit('open-new-user-dialog')">
          <font-awesome-icon icon="plus" />
          Dodaj korisnički račun
        </button>
      </template>
      <template #end>
        <button
          class="dodaj-partnera-btn"
          @click="$emit('open-partner-dialog')"
        >
          <font-awesome-icon icon="user-plus" />
          Dodaj partnera
        </button>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      v-model:expanded-rows="expandedRows"
      :value="processedPRVpartneri"
      :rows="10"
      scrollable
      scroll-height="800px"
      :sort-order="1"
      :loading="loading"
      loadingMode="icon"
      size="normal"
      removable-sort
      :global-filter-fields="[
        'epr_naziv',
        'epr_oib',
        'user_accounts_num',
        'epr_adresa',
        'epr_mjesto',
        'fizOsobeText',
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
              placeholder="Pretraži tvrtke"
            />
          </IconField>
          <div class="global-search-iconfield refresh" @click="refreshData">
            <font-awesome-icon icon="rotate-right" class="refresh-icon" />
          </div>
        </div>
      </template>

      <template #rowtoggleicon>
        <span>
          <font-awesome-icon icon="chevron-down" />
        </span>
      </template>

      <template #empty> Nema pravnih osoba. </template>

      <template #loading>
        Učitavanje pravnih osoba. Molimo pričekajte.
      </template>

      <template #footer>
        <div class="total-emissions">
          Ukupno pravnih osoba: <strong>{{ PRVpartneri.length }}</strong>
        </div>
      </template>

      <Column expander style="width: 5rem" />
      <Column field="epr_naziv" header="Naziv">
        <template #body="slotProps">
          <strong>{{ slotProps.data.epr_naziv }}</strong>
        </template>
      </Column>
      <Column field="epr_oib" header="OIB" />
      <Column field="epr_adresa" header="Adresa" />
      <Column field="epr_mjesto" header="Mjesto" />
      <Column field="employees_num" header="Broj aktivnih korisnika" />

      <template #expansion="slotProps">
        <slot name="expansion" :data="slotProps.data">
          <div
            v-if="
              !(slotProps.data.users && slotProps.data.users.length > 0) &&
              !userEmptyMessage
            "
            class="loading-container"
          >
            <font-awesome-icon icon="spinner" spin />
            Učitavanje korisnika
          </div>
          <div v-else class="inside-table">
            <DataTable :value="slotProps.data.users">
              <template #empty>
                <span style="opacity: 0.6">
                  Nema korisnika za ovaj pravni subjekt.
                </span>
              </template>
              <template #loading>
                Učitavanje korisnika tvrtke{{
                  " " + slotProps.data?.epr_naziv || ""
                }}. Molimo pričekajte.
              </template>
              <template #footer>
                <div style="margin: 5px 0px">
                  <span
                    class="dodaj-korisnika"
                    @click="$emit('open-new-user-dialog', slotProps.data)"
                  >
                    <font-awesome-icon icon="plus" />
                    Dodaj korisnički račun
                  </span>
                </div>
              </template>
              <Column header="#" header-style="width:3rem">
                <template #body="colProps">
                  {{ colProps.index + 1 }}
                </template>
              </Column>
              <Column
                field="epr_ime"
                header="Ime"
                header-style="width: 20%; min-width: 10rem"
              />
              <Column
                field="epr_prezime"
                header="Prezime"
                header-style="width: 20%; min-width: 10rem"
              />
              <Column
                field="epr_email"
                header="Email"
                header-style="width: 25%; min-width: 10rem"
              >
                <template #body="{ data }">
                  <a
                    v-if="data?.epr_email"
                    target="_blank"
                    :href="'mailto:' + data?.epr_email"
                    >{{ data?.epr_email }}</a
                  >
                  <span v-else style="font-style: italic; opacity: 0.6">/</span>
                </template>
              </Column>
              <Column
                field="aktivan"
                header="Status"
                :show-filter-menu="false"
                style="width: 3rem"
              >
                <template #body="{ data }">
                  <Tag
                    :value="data?.aktivan ? 'Aktivan' : 'Neaktivan'"
                    :severity="getSeverity(data?.aktivan)"
                  />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <Select
                    v-model="filterModel.value"
                    :options="statuses"
                    placeholder="Odaberi status"
                    style="min-width: 12rem"
                    :show-clear="true"
                    @change="filterCallback"
                  >
                    <template #option="slotProps">
                      <Tag
                        :value="slotProps.option"
                        :severity="getSeverity(slotProps.option)"
                      />
                    </template>
                  </Select>
                </template>
              </Column>
              <Column header-style="width: 5rem;">
                <template #body="{ data }">
                  <div
                    style="display: flex; justify-content: flex-end; gap: 10px"
                  >
                    <span
                      v-if="!data?.eko_inicijalno && data?.epr_email"
                      v-tooltip.left="'Pošalji email korisniku'"
                      class="edit-btn"
                      @click="
                        $emit('send-mail', data?.eko_id, data?.eko_par_id_za)
                      "
                    >
                      <font-awesome-icon icon="envelope" />
                    </span>
                    <span
                      class="edit-btn"
                      @click="$emit('edit-user', data)"
                      v-tooltip.left="'Uredi korisnika'"
                    >
                      <font-awesome-icon icon="user-pen" />
                    </span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </slot>
      </template>
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
  epr_ime: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_prezime: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_tvrtka: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_oib: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_adresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
  epr_mjesto: { value: null, matchMode: FilterMatchMode.CONTAINS },
  employees_num: { value: null, matchMode: FilterMatchMode.EQUALS },
  epr_aktivan: { value: null, matchMode: "equals" },
});
const userEmptyMessage = ref(null);

const korisniciStore = useKorisniciStore();

const expandedRows = computed(() => korisniciStore.expandedRows);
const PRVpartneri = computed(() => korisniciStore.pravneOsobe);
const searchFIZosobe = computed(() => korisniciStore.searchFizickeOsobe);
const statuses = ref(["Aktivan", "Neaktivan"]);

const processedPRVpartneri = computed(() => {
  return PRVpartneri.value.map((partner) => {
    const povezaneOsobe = searchFIZosobe.value.filter(
      (osoba) => osoba.eko_par_id_za === partner.epr_id
    );
    const fizOsobeText = povezaneOsobe
      .map((osoba) => `${osoba.epr_ime} ${osoba.epr_prezime}`)
      .join(" ");
    return { ...partner, fizOsobeText };
  });
});

const onRowExpand = async (event) => {
  userEmptyMessage.value = null;
  try {
    const response = await korisniciStore.fetchKorisniciForLegalPartner(
      event.data.epr_id
    );
    if (response?.message) userEmptyMessage.value = response.message;
  } catch (error) {
    // console.error(
    //   "Error fetching korisnici for legal partner:",
    //   event.data.epr_id,
    //   error
    // );
  }
};

const refreshData = async () => {
  korisniciStore.expandedRows = [];
  await korisniciStore.fetchPravneOsobe();
  korisniciStore.fizickeOsobe = [];
};

const getSeverity = (status) => {
  switch (status) {
    case 1:
      return "success";
    case false:
      return "danger";
    default:
      return "info";
  }
};

onMounted(async () => {
  await korisniciStore.fetchPravneOsobe();
});
</script>

<style scoped>
.datatable,
.toolbar {
  max-width: 1300px;
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
