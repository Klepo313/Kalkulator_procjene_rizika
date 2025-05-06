<template>
  <div class="body">
    <Toast />
    <header>
      <img
        src="../../public/static/images/KESP_logo_sidebar.svg"
        style="height: 100%; cursor: pointer"
        alt="logo"
        @click="navigateTo('/')" />
      <div class="header-buttons">
        <button class="novi-predlozak" @click="noviDialogVisible = true">
          <font-awesome-icon icon="plus" class="plus-icon" />
          Novi predložak
        </button>
        <button class="logout" @click="doLogout">
          <font-awesome-icon
            icon="arrow-right-from-bracket"
            class="logout-icon" />
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
            striped-rows
            data-key="uiz_id"
            filter-display="row"
            :loading="loading"
            removable-sort
            :global-filter-fields="[
              'uiz_broj',
              'uiz_opis',
              'uiz_datum',
              'uiz_datod',
              'uiz_datdo',
              'uiz_godina',
              'uiz_razdoblje',
            ]"
            @row-select="onRowSelect">
            <template #header>
              <div class="flex justify-end">
                <IconField>
                  <InputIcon>
                    <font-awesome-icon icon="search" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Pretraži prethodne izračune"
                    class="search-field max" />
                </IconField>
              </div>
            </template>
            <template #empty> Nisu pronađeni izračuni </template>
            <template #loading>
              Učitavanje prethodnih izračuna. Molimo pričekajte.
            </template>

            <Column
              field="uiz_broj"
              header="Broj"
              sortable
              style="width: 100px">
              <template #body="slotProps">
                {{ slotProps.data.uiz_broj || "--" }}
              </template>
            </Column>
            <Column
              field="uiz_opis"
              header="Naziv"
              sortable
              style="width: auto">
              <template #body="slotProps">
                {{ slotProps.data.uiz_opis || "--" }}
              </template>
            </Column>
            <Column field="uiz_datum" header="Datum" sortable>
              <template #body="slotProps">
                {{ formatDateToDMY(slotProps.data.uiz_datum, ".") }}
              </template>
            </Column>
            <!-- <Column field="uiz_godina" header="Godina" sortable>
                            <template #body="slotProps">
                                {{ getYearsRange(slotProps.data.uiz_datod, slotProps.data.uiz_datdo) }}
                            </template>
                        </Column> -->

            <Column field="uiz_razdoblje" header="Vremensko razdoblje" sortable>
              <template #body="slotProps">
                {{
                  formatDateToDMY(slotProps.data.uiz_datod, ".") +
                  " - " +
                  formatDateToDMY(slotProps.data.uiz_datdo, ".")
                }}
              </template>
            </Column>
          </DataTable>
        </div>
        <!-- <div class="grapf">
                    <div class="graph-content">
                        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
                    </div>
                </div> -->
      </div>
      <footer>
        <nuxt-link to="/kesp" class="footer-link">
          <font-awesome-icon icon="arrow-left-long" />
          Prethodna stranica
        </nuxt-link>
      </footer>
    </main>
    <Dialog
      v-model:visible="noviDialogVisible"
      header="Novi predložak"
      :modal="true"
      :style="{ width: '450px' }"
      @hide="resetForm">
      <form class="pop-up-novo" @submit.prevent="addIzracun">
        <div class="opisnap">
          <label for="opis"> Naziv<span class="required">*</span> </label>
          <InputText
            id="opis"
            v-model="opis"
            type="text"
            placeholder="Unesi naziv"
            required />
        </div>
        <div>
          <label for="startDate">
            Početak razdoblja<span class="required">*</span>
          </label>
          <DatePicker
            id="startDate"
            v-model="datumOd"
            date-format="dd.mm.yy"
            show-icon
            fluid
            icon-display="input"
            placeholder="Unesi datum"
            required
            show-button-bar />
          <!--@blur="setEndDate"-->
        </div>
        <div>
          <label for="endDate">
            Kraj razdoblja<span class="required">*</span>
          </label>
          <DatePicker
            id="endDate"
            v-model="datumDo"
            :min-date="datumOd"
            date-format="dd.mm.yy"
            show-icon
            fluid
            icon-display="input"
            placeholder="Unesi datum"
            required />
        </div>
        <div class="opisnap">
          <label for="napomena"> Napomena </label>
          <Textarea
            id="napomena"
            v-model="napomena"
            placeholder="Unesi napomenu" />
        </div>
        <div class="dialog-footer">
          <span
            class="p-button p-component p-button-secondary"
            @click="noviDialogVisible = false">
            Odustani
          </span>
          <button
            type="submit"
            :disabled="
              ((!opis || !datumOd || !datumDo) && isLocked) || blockButton
            "
            class="submitBtn"
            :click="isLocked == true">
            <font-awesome-icon icon="save" class="dialog-plus-icom" />
            Spremi predložak
          </button>
        </div>
      </form>
    </Dialog>
    <LoadingSpremanje
      v-if="loadingDalje"
      :message="'Učitavanje izračuna...'"
      :loader="'UI'"
      class="loading-popup" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { navigateTo } from "#app";
import { logout } from "~/service/user/user";
import { formatDateToDMY, getYearsRange } from "@/utils/dateFormatter";
import { setCookie, deleteCookie } from "~/service/user/cookies";
import LoadingSpremanje from "~/components/ostalo/LoadingSpremanje.vue";

definePageMeta({
  requiredRole: "AP002",
});

const kespStore = useKespStore();

const toast = useToast();
const toastMessage = useState("toastMessage");

const filters = ref({
  global: { value: "", matchMode: "contains" },
});

const izracuni = computed(() => (kespStore.predlosci || []).slice().reverse());
const loading = ref(true);
const isLocked = ref(false);

const opis = ref(null);
const datumOd = ref();
const datumDo = ref();
const napomena = ref(null);

const datOdError = computed(() => !datumOd.value);
const datDoError = computed(() => !datumDo.value);

const odabraniIzracun = ref();
const loadingDalje = ref(false);

function setEndDate() {
  if (datumOd.value) {
    const startDate = new Date(datumOd.value); // Ensure valid Date object
    const endYear = startDate.getFullYear();
    datumDo.value = new Date(endYear, 11, 31); // Set to 31.12.endYear
  }
}

watch(datumOd, () => {
  setEndDate();
});

const onRowSelect = async () => {
  loadingDalje.value = true;
  try {
    const url = `/kesp/predlozak?id=${odabraniIzracun.value.uiz_id.toString()}`;
    await navigateTo(url, { replace: true });
    kespStore.setKespId(odabraniIzracun.value.uiz_id);
  } catch (error) {
    showError();
  }
};

const noviDialogVisible = ref(false);

const resetForm = () => {
  opis.value = null;
  datumOd.value = null;
  datumDo.value = null;
  napomena.value = null;
  noviDialogVisible.value = false;
};

// const chartData = ref();
// const chartOptions = ref();

onMounted(async () => {
  if (toastMessage.value) {
    toast.add({
      severity: "error",
      summary: "Neispravan ID",
      detail: toastMessage.value,
      life: 4000,
    });
    toastMessage.value = null;
  }

  kespStore.clearData();
  await kespStore.fetchPredlosci();
  // console.log(izracuni.value)
  loading.value = false;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // JS months: 0 (Jan) to 11 (Dec)

  // Set start date to 01.01. of the previous year or the same year if Dec
  const startYear = month === 11 ? year : year - 1;
  datumOd.value = new Date(startYear, 0, 1); // 01.01.startYear
  setEndDate();
  // console.log("Datum od: ", datumOd.value, "Datum do: ", datumDo.value)
});

const doLogout = async () => {
  await logout(); reloadNuxtApp();
  navigateTo("/login");
};

const showSuccess = (dod, ddo) => {
  toast.add({
    severity: "success",
    summary: "Uspješno dodan izračun",
    detail: `Dodan izračun za razdoblje od ${dod} do ${ddo}`,
    life: 3000,
  });
};

const showError = () => {
  toast.add({
    severity: "error",
    summary: "Došlo je do greške!",
    detail: `Radnja neuspješna.`,
    life: 3000,
  });
};

const blockButton = ref(false);
const addIzracun = async () => {
  blockButton.value = true;
  const header = {
    l_datum: formatDateToDMY(new Date(), "-"),
    l_datod: formatDateToDMY(datumOd.value, "-"),
    l_datdo: formatDateToDMY(datumDo.value, "-"),
    l_opis: opis.value || null,
    l_napomena: napomena.value || null,
  };
  // console.log(header);

  try {
    const res = await kespStore.addPredlozak(header);
    // console.log("Dodani izračun: ", res);
    if (res) {
      showSuccess(header.l_datod, header.l_datdo);
      try {
        // Dodavanje šifrovane vrednosti u URL
        const url = `/kesp/predlozak?id=${kespStore.kespId}`;
        // console.log("url: " + url);
        // console.log('id: ', kespStore.kespId.toString()); // Spremanje ID-a u cookie

        // Navigacija sa 'replace' kako bi se izbeglo dupliranje rute u istoriji
        await navigateTo(url, { replace: true });
      } catch (error) {
        // console.log("Greska pri dodavanju izračuna. 1111", error);
        showError();
      }
    } else showError();
  } catch (error) {
    // console.log("Greska pri dodavanju izračuna. 2222", error);
    showError();
  }
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
  min-height: 100dvh;
  padding: 26px;
  background-color: var(--kesp-bg);
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
  background-color: var(--kesp-primary);
}

button:hover {
  background-color: var(--kesp-primary-hover);
}

button:focus {
  background-color: var(--kesp-primary-focus);
}

h1 {
  font-size: 20px;
  padding-bottom: 7px;
  border-bottom: 2px solid var(--text-color);
  width: 100%;
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

.dialog-plus-icom {
  margin-right: 0px;
}

.dialog-footer {
  grid-column: span 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;

  margin-top: 20px;
}

.submitBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background-color: var(--kesp-primary);
  color: white;
}

.submitBtn * {
  color: white;
}

.submitBtn:hover {
  background-color: var(--kesp-primary-hover);
}

.submitBtn:active {
  background-color: var(--kesp-primary-focus);
}

.secondary {
  background-color: none !important;
}

form,
form > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.opisnap {
  width: 100%;
  grid-column: span 2;
}

.invalid {
  border-radius: 7px;
  border: 1px solid red !important;
}

.error {
  padding: 5px 0px;

  color: red;
  font-size: smaller;
}

textarea {
  resize: vertical;
  max-height: 100px;
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

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.table {
  padding-top: 20px;
  width: 100%;
}

.grapf {
  width: 100%;
  max-width: 70rem;
  height: 400px;
  background-color: white;
  border: var(--border);
  border-radius: 5px;
  padding: 26px;
}

.graph-content,
.graph-content > div {
  width: 100%;
  height: 100%;
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
