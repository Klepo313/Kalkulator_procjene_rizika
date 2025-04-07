<template>
  <div class="body">
    <Toast />
    <header>
      <img
        src="../../public/static/images/KPKR_logo_sidebar.svg"
        style="height: 100%; cursor: pointer"
        alt="logo"
        @click="navigateTo('/kpkr')"
      />
      <div class="header-buttons">
        <button class="novi-predlozak" @click="noviIzracun">
          <font-awesome-icon icon="plus" class="plus-icon" />
          Novi predložak
        </button>
        <button class="logout" @click="doLogout">
          <font-awesome-icon
            icon="arrow-right-from-bracket"
            class="logout-icon"
          />
          Odjava
        </button>
      </div>
    </header>
    <main>
      <div class="main-content">
        <h1>Prethodni izračuni</h1>
        <div class="table">
          <DataTable
            v-model:filters="filters"
            v-model:selection="odabraniIzracun"
            :value="izracuni"
            selection-mode="single"
            :meta-key-selection="false"
            paginator
            :rows="10"
            stripedRows
            data-key="aiz_id"
            filter-display="row"
            :loading="loading"
            :global-filter-fields="[
              'aiz_broj',
              'aiz_opis',
              'aiz_datum',
              'tvz_naziv',
              'kcs_sif',
              'kop_sif',
              'kop_naziv',
              'puk_naziv',
              'objekt_djel',
            ]"
            @row-select="onRowSelect"
          >
            <template #header>
              <div class="flex justify-end">
                <IconField>
                  <InputIcon>
                    <font-awesome-icon icon="search" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Pretraži prethodne izračune"
                    class="search-field max"
                  />
                </IconField>
              </div>
            </template>
            <template #empty> Nisu pronađeni izračuni </template>
            <template #loading>
              Učitavanje prethodnih izračuna. Molimo pričekajte.
            </template>

            <Column field="aiz_broj" header="Broj" sortable style="width: 5%">
              <template #body="slotProps">
                {{ slotProps.data.aiz_broj || "--" }}
              </template>
            </Column>
            <Column field="aiz_opis" header="Naziv" sortable style="width: 10%">
              <template #body="slotProps">
                {{ slotProps.data.aiz_opis || "--" }}
              </template>
            </Column>
            <Column field="aiz_datum" header="Datum" sortable style="width: 6%">
              <template #body="slotProps">
                {{ formatDateToDMY(slotProps.data.aiz_datum, ".") }}
              </template>
            </Column>
            <Column
              field="tvz_naziv"
              header="Vrsta izračuna"
              sortable
              style="width: 6%"
            />
            <Column
              field="kop_sif"
              header="Katastarska općina (šifra)"
              sortable
              style="width: 6%"
            />
            <Column
              field="kop_naziv"
              header="Katastarska općina (naziv)"
              sortable
              style="width: 8%"
            />
            <Column
              field="kcs_sif"
              header="Katastarska čestica"
              sortable
              style="width: 6%"
            >
              <template #body="slotProps">
                {{ slotProps.data.kcs_sif || "--" }}
              </template>
            </Column>
            <Column
              field="puk_naziv"
              header="Područni ured"
              sortable
              style="width: 6%"
            />
            <Column
              field="objekt_djel"
              header="Imovina/Djelatnost"
              sortable
              style="width: 20%"
            />
          </DataTable>
        </div>
      </div>
      <footer>
        <nuxt-link to="/kpkr" class="footer-link">
          <font-awesome-icon icon="arrow-left-long" />
          Početna stranica
        </nuxt-link>
      </footer>
    </main>
    <LoadingSpremanje
      v-if="loadingDalje"
      :message="'Učitavanje izračuna...'"
      :loader="'UI'"
      class="loading-popup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { navigateTo } from "#app";
import { logout } from "~/service/user/user";
import { getCalculations } from "~/service/kpkr/calculations";
import { formatDateToDMY } from "@/utils/dateFormatter";
import { setCookie, deleteCookie } from "~/service/user/cookies";
import LoadingSpremanje from "~/components/ostalo/LoadingSpremanje.vue";

const toast = useToast();

const cardStore = useCardStore();
const opciStore = useOpciStore();

const filters = ref({
  global: { value: "", matchMode: "contains" },
});

const izracuni = ref([]);
const loading = ref(true);
const loadingDalje = ref(false);

const odabraniIzracun = ref();

const cookiesToDelete = ["scenarij", "id-izracuna", "vrsta-izracuna"];

const showError = () => {
  toast.add({
    severity: "error",
    summary: "Došlo je do greške",
    detail: `Greška prilikom odabira izračuna`,
    life: 3000,
  });
};

const onRowSelect = async () => {
  loadingDalje.value = true;

  try {
    // Dodavanje šifrovane vrednosti u URL
    const url = `/kpkr/predlozak?id=${odabraniIzracun.value.aiz_id.toString()}`;
    // console.log("url: " + url);
    // console.log('id: ', odabraniIzracun.value.aiz_id.toString()); // Spremanje ID-a u cookie

    // Navigacija sa 'replace' kako bi se izbeglo dupliranje rute u istoriji
    await navigateTo(url, { replace: true });

    // Spremanje šifrovanog ID-a u store
    cardStore.setCardId(odabraniIzracun.value.aiz_id.toString());
  } catch (error) {
    // console.error("Greška prilikom postavljanja kolačića:", error);
    showError();
  }
  // finally {
  //     loadingDalje.value = false;
  // }
};

onMounted(async () => {
  await deleteCookie(cookiesToDelete);
  cardStore.cardId = null;
  const data = await getCalculations();
  if (data.data) {
    if (data.data.message) {
      izracuni.value = [];
    } else {
      izracuni.value = data.data;
    }
  }
  // console.log(izracuni.value)
  loading.value = false;
});

const doLogout = async () => {
  await logout();
  navigateTo("/login");
};

const noviIzracun = async () => {
  cardStore.resetCardStore();
  navigateWithParameter("/kpkr/predlozak", "id", "null");
};
</script>

<style scoped>
.pop-up {
  /* display: none; */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  padding: 13px;

  background: rgba(30, 30, 30, 0.4);
}

.pop-up-content {
  width: 100%;
  height: 100%;

  background-color: white;
  border: var(--border);
  border-radius: 5px;
  padding: 26px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.p-paginator .p-paginator-content button {
  outline: auto !important;
  width: auto !important;
}

.ukloni-btn,
.dodaj-btn,
.p-datatable-filter-apply-button {
  width: auto !important;
  padding: 0px 10px;
}

.dodaj-btn {
  border: none;
}

.table-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.clear-filter-btn {
  width: auto;
  color: var(--text-color);
  border: var(--border);
}

.clear-filter-btn:hover {
  color: white !important;
  background-color: var(--text-color) !important;
  border: var(--border) !important;
}

.search-field {
  width: auto;
  background: none !important;
}

.max {
  width: 100% !important;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 26px;
  width: 100%;
  min-height: 100vh;
  padding: 26px;
}

header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

footer {
  justify-content: flex-start;
}

button {
  text-wrap: nowrap;
}

h1 {
  font-size: 20px;
  padding-bottom: 7px;
  border-bottom: 2px solid var(--text-color);
}

.header-buttons {
  display: flex;
  gap: 35px;
}

.logout {
  background: none;
  border: none;
  color: var(--red);
  font-weight: 600;
}

.logout:hover {
  background-color: rgb(227, 227, 227);
}

.logout:active {
  background-color: rgb(227, 227, 227);
}

.logout-icon,
.plus-icon {
  margin-right: 10px;
}

main {
  width: 100%;
  min-height: 100%;

  background-color: var(--bg-layout-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  overflow: visible;
  padding: 34px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.main-content {
  width: 100%;
  height: 100%;
}

.table {
  padding-top: 20px;
}

.footer-link:hover {
  transform: translateX(-3px);
}

.loading-popup {
  z-index: 99;
  position: fixed;
  width: 100%;
  height: 100dvh;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
