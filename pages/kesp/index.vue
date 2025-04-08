<template>
  <div>
    <Toast />
    <div class="body">
      <header>
        <div class="image-container">
          <img
            src="../../public/static/images/atd_solucije_iz.png"
            alt="logo"
            class="header-image"
            @click="navigateTo('/')"
          />
        </div>
        <button
          v-if="$route.path !== '/login'"
          class="logout"
          @click="doLogout"
        >
          <font-awesome-icon
            icon="arrow-right-from-bracket"
            class="logout-icon"
          />
          Odjava
        </button>
      </header>

      <main>
        <div class="image-container">
          <img src="../../public/static/images/KESP_logo.svg" alt="logo" />
        </div>
        <div class="main-container">
          <div class="main-form">
            <!-- <h2>Odaberi opciju</h2> -->
            <div class="card-container">
              <div class="card" @click="noviDialogVisible = true">
                <font-awesome-icon icon="plus" />
                <span>
                  Novi predložak <br />
                  izračuna
                </span>
              </div>
              <div class="card" @click="navigateTo('/kesp/predlosci')">
                <font-awesome-icon icon="list-ul" />
                <span>
                  Prethodni <br />
                  izračuni
                </span>
              </div>
            </div>
            <div class="download-container" @click="downloadPDF">
              <font-awesome-icon icon="download" />
              Upute za korištenje
            </div>
          </div>
        </div>
      </main>
      <Dialog
        v-model:visible="noviDialogVisible"
        header="Novi predložak"
        :modal="true"
        :style="{ width: '450px' }"
        @hide="resetForm"
      >
        <form class="pop-up-novo" @submit.prevent="addIzracun">
          <div class="opisnap">
            <label for="opis"> Naziv<span class="required">*</span> </label>
            <InputText
              id="opis"
              v-model="opis"
              type="text"
              placeholder="Unesi naziv"
              required
            />
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
              show-button-bar
            />
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
              required
            />
          </div>
          <div class="opisnap">
            <label for="napomena"> Napomena </label>
            <Textarea
              id="napomena"
              v-model="napomena"
              placeholder="Unesi napomenu"
            />
          </div>
          <div class="dialog-footer">
            <span
              class="p-button p-component p-button-secondary"
              @click="noviDialogVisible = false"
            >
              Odustani
            </span>
            <button type="submit" class="submitBtn">
              <font-awesome-icon icon="save" class="dialog-plus-icom" />
              Spremi predložak
            </button>
          </div>
        </form>
        <!-- <template #footer>
                
            </template> -->
        <!-- <div class="dialog-footer">
                    <span class="p-button p-component p-button-secondary secondary" @click="noviDialogVisible = false">
                        Odustani
                    </span>
                    <button class="submitBtn" type="submit">Spremi</button>
                </div> -->
      </Dialog>

      <FooterText class="footer-text" />
    </div>
  </div>
</template>

<script setup>
import FooterText from "~/components/ostalo/FooterText.vue";
import { logout } from "~/service/user/user";

const kespStore = useKespStore();

definePageMeta({
  requiredRole: "AP002",
  pageTransition: { name: "slide", mode: "out-in" },
});

const toast = useToast();

const opis = ref(null);
const datumOd = ref();
const datumDo = ref();
const napomena = ref(null);
const noviDialogVisible = ref(false);

function downloadPDF() {
  // Putanja do PDF datoteke u /static/blobs
  const filePath = "/blobs/Uputa za korištenje_v1.0.pdf"; // Zamijenite 'upute.pdf' stvarnim imenom vaše datoteke

  // Kreirajte nevidljivi link element
  const link = document.createElement("a");
  link.href = filePath;
  link.download = "Uputa za korištenje_v1.0.pdf"; // Naziv pod kojim će se datoteka preuzeti

  // Simulirajte klik na link
  link.click();
}

function setEndDate() {
  if (datumOd.value) {
    const startDate = new Date(datumOd.value); // Ensure valid Date object
    const endYear = startDate.getFullYear();
    datumDo.value = new Date(endYear, 11, 31); // Set to 31.12.endYear
  }
}

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
    detail: `Dodavanje novog predloška nije uspjelo.`,
    life: 3000,
  });
};

const doLogout = async () => {
  await logout();
  navigateTo("/login");
};

onMounted(async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // JS months: 0 (Jan) to 11 (Dec)

  // Set start date to 01.01. of the previous year or the same year if Dec
  const startYear = month === 11 ? year : year - 1;
  datumOd.value = new Date(startYear, 0, 1); // 01.01.startYear
  setEndDate();
  // console.log("Datum od: ", datumOd.value, "Datum do: ", datumDo.value)
});
</script>

<style scoped>
.body {
  position: relative;
  width: 100%;
  height: 100dvh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px;
}

header .image-container {
  height: 37px;
}

.image-container img {
  width: 100%;
}

.header-image {
  height: 100%;
  /* Postavi visinu slike prema visini containera */
  width: auto;
  /* Zadrži omjer slike */
  object-fit: contain;
  /* Zadrži cijelu sliku unutar containera */
  cursor: pointer;
}

h2 {
  font-size: 20px;
}

main {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-container {
  width: 100%;
}

.main-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  padding: 26px;
  width: 100%;
}

.card-container {
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  padding: 20px;
  width: 100%;
  max-width: 210px;
  aspect-ratio: 1/1;

  background-color: var(--white-color);
  border: 1px solid rgb(20, 82, 28, 0.2);
  border-radius: var(--border-form-radius);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.card * {
  color: var(--kesp-primary);
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.card:hover {
  background-color: var(--kesp-primary-focus);
  cursor: pointer;
}

.card:hover *,
.card:active * {
  color: white;
}

.card:active {
  background-color: var(--kesp-primary-hover);
}

.footer-text {
  position: absolute;
  bottom: 20px;
}

.download-container {
  padding: 0px 10px 5px 10px;
  border-bottom: 1px solid transparent;

  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.download-container:hover {
  color: var(--text-color);
  border-bottom: 1px solid var(--text-color);
  cursor: pointer;
}

.download-container:active {
  transform: translateY(1px);
  color: var(--kesp-primary);
  border-bottom: 1px solid var(--kesp-primary);
}

.logout {
  position: absolute;
  top: 26px;
  right: 26px;

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
</style>
