<template>
  <div class="page-container">
    <Toast />
    <ConfirmDialog group="headless" :style="{ width: '600px' }">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="confirm-dialog-container">
          <div class="icon-wrapper">
            <div class="icon-circle">
              <font-awesome-icon icon="exclamation-triangle" size="1x" />
            </div>
          </div>

          <div class="content">
            <h2 class="confirm-dialog-header">{{ message.header }}</h2>
            <p class="confirm-desc">{{ message.message }}</p>
            <!-- <p class="confirm-desc">*{{ message.ffact }}</p> -->
            <div class="button-container">
              <Button
                label="Odustani"
                severity="secondary"
                @click="rejectCallback"
                class="w-32" />
              <Button
                id="submitBtn"
                class="filled"
                icon="pi pi-save"
                label="Spremi i zaključaj"
                @click="acceptCallback" />
            </div>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <!-- glavni sadržaj koji rasteže prostor između headera i footera -->
    <div class="main-container">
      <template v-if="!loading">
        <h1>
          Opći podaci
          <font-awesome-icon
            v-if="idIzracuna"
            v-tooltip.top="'Predložak je zaključan.'"
            icon="lock"
            class="lock-icon" />
        </h1>

        <OpciPodaciForm
          :aiz-id="aizId"
          :izracun="izracunData"
          :vrsta-izracuna-query="vrstaIzracunaFromCookie"
          :vrste-izracuna="vrsteIzracuna"
          :vrste-imovine="vrsteImovine"
          :djelatnosti="djelatnosti"
          :scenariji="scenariji"
          :katastarske-opcine="katastarskeOpcine"
          :is-save-success="isSaveSuccess"
          @save="submitForm" />

        <Map />
      </template>
      <template v-else>
        <div class="loading-template">
          <span v-for="n in 11" :key="n" style="display: flex; gap: 5px">
            <Skeleton width="7rem" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </span>
          <Skeleton width="100%" height="6rem" />
        </div>
      </template>
    </div>

    <!-- footer koji je uvijek na dnu -->
    <footer class="page-footer">
      <button
        class="footer-button"
        :disabled="!idIzracuna"
        @click="
          navigateWithParameter(
            '/kpkr/predlozak/mjere-prilagodbe',
            'id',
            idIzracuna
          )
        ">
        <span>Mjere prilagodbe</span>
        <font-awesome-icon icon="arrow-right-long" />
      </button>
    </footer>
    <LoadingSpremanje
      v-if="isLoadingPopupVisible"
      :message="'Spremanje promjena...'"
      :description="'Ovo može potrajati 10-ak sekundi.'"
      :loader="'SI'"
      class="loading-popup" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import OpciPodaciForm from "~/components/kpkr/OpciPodaciForm.vue";
import LoadingSpremanje from "~/components/ostalo/LoadingSpremanje.vue";
import Map from "~/components/kpkr/Map.vue";
import { useOpciStore } from "~/stores/main-store";
import { useCardStore } from "~/stores/index";
import { getCalculations } from "~/service/kpkr/calculations";
import { getIdFromUrl } from "~/utils/navigationHandler";
import { useToast } from "primevue/usetoast";
import { saveForm } from "~/service/kpkr/form";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();
const opciStore = useOpciStore();
const cardStore = useCardStore();

const isLoadingPopupVisible = ref(false);

// 1) Definiraj sve što dolazi iz parenta
const props = defineProps<{
  aizId: string | null;
  izracun: any; // parent šalje single object
  vrsteIzracuna: Array<{ tvz_id: string; tvz_naziv: string }>;
  vrsteImovine: any[];
  djelatnosti: any[];
  scenariji: any[];
  katastarskeOpcine: any[];
  isSaveSuccess: boolean;
  loading: boolean;
}>();

// 2) Cookie za vrstu izračuna
const vrstaCookie = useCookie("vrstaIzracuna", {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// 3) Iz cookie-ja složi objekt ili null
const vrstaIzracunaFromCookie = computed<null | {
  tvz_id: string;
  tvz_naziv: string;
}>(() => {
  const c = vrstaCookie.value;
  if (c && typeof c === "object" && "tvz_id" in c && "tvz_naziv" in c) {
    return { tvz_id: c.tvz_id, tvz_naziv: c.tvz_naziv };
  }
  return null;
});

// 4) mapa propsa u lokale computede
const idIzracuna = computed(() => props.aizId);
const izracunData = computed(() => props.izracun);
const loading = computed(() => props.loading);
const vrsteIzracuna = computed(() => props.vrsteIzracuna);
const vrsteImovine = computed(() => props.vrsteImovine);
const djelatnosti = computed(() => props.djelatnosti);
const scenariji = computed(() => props.scenariji);
const katOpcine = computed(() => props.katastarskeOpcine);
const isSaveSuccess = computed(() => props.isSaveSuccess);

watch(
  () => vrsteIzracuna.value,
  (lista) => {
    if (vrstaIzracunaFromCookie.value) {
      const found = lista.find(
        (i) =>
          i.tvz_id === vrstaIzracunaFromCookie.value!.tvz_id &&
          i.tvz_naziv === vrstaIzracunaFromCookie.value!.tvz_naziv
      );
      if (!found) {
        const q = { ...route.query };
        delete q.tvz_id;
        delete q.tvz_naziv;
        router.replace({ path: route.path, query: q });
      }
    }
  },
  { immediate: true }
);

const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Uspješno spremljeno",
    detail: "Promjene na formi su spremljene",
    life: 5000,
  });
};

const showError = () => {
  toast.add({
    severity: "error",
    summary: "Došlo je do greške",
    detail: "Nije uspješno spremljeno",
    life: 5000,
  });
};

const submitForm = async (formDataRaw: {
  scenarij: any;
  datum: string;
  vrstaIzracuna: { tvz_id: any; tvz_naziv: any };
  katastarskaOpcina: { kop_id: any };
  katastarskaCestica: { kcs_id: any };
  vrstaImovine: { tvo_id: any };
  djelatnost: { djl_id: any };
  naziv: any;
  napomena: any;
}) => {
  confirm.require({
    group: "headless",
    header: "Jeste li sigurni da želite zaključati predložak?",
    message: `
      Zaključavanjem ovog predloška ne možete
      više izmjenjivati opće podatke sa forme
      (mjere prilagodbe se mogu naknadno izmjenjivati).
    `,
    ffact: "Stranica će se osvježiti nakon uspješnog spremanja forme.",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Odustani",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      icon: "pi pi-save",
      label: "Spremi i zaključaj",
      severity: "primary",
      class: "acceptBtn",
    },
    accept: async () => {
      isLoadingPopupVisible.value = true;

      try {
        const trazeniScenarij = scenariji.value.find(
          (s: any) => s.tvs_sif === formDataRaw.scenarij
        );

        if (!trazeniScenarij) {
          throw new Error("Scenarij nije pronađen.");
        }

        const formData = {
          calculationId: null,
          date: formatDateToDMY(formDataRaw.datum, "-"),
          calculationTypeId: formDataRaw.vrstaIzracuna?.tvz_id || null,
          cadastreMunicipalityId: formDataRaw.katastarskaOpcina?.kop_id || null,
          cadastreParticleId: formDataRaw.katastarskaCestica?.kcs_id || null,
          objectTypeId: formDataRaw.vrstaImovine?.tvo_id || null,
          activityId: formDataRaw.djelatnost?.djl_id || null,
          scenarioTypeId: trazeniScenarij.tvs_id,
          description: formDataRaw.naziv || null,
          remark: formDataRaw.napomena || null,
        };

        console.log("FormData za slanje:", formData);

        const response = await saveForm(formData);

        if (response.status === 200) {
          isSaveSuccess.value = true;
          const responseData = response.data;
          if (!responseData || !responseData.calculationId) {
            throw new Error("Nepotpuni odgovor sa servera.");
          }
          if (responseData?.calculationId) {
            const queryParams: Record<string, any> = {
              ...router.currentRoute.value.query,
            };

            delete queryParams.tvz_id;
            delete queryParams.tvz_naziv;

            queryParams.id = responseData.calculationId;

            await fetchData(responseData.calculationId);

            await router.replace({
              path: router.currentRoute.value.path,
              query: queryParams,
            });

            // // ➔ Kad router.replace završi, napravi hard refresh stranice
            // setTimeout(() => {
            //   window.location.reload();
            // }, 300); // 100ms delay da bude skroz safe
          }

          showSuccess();
        } else {
          const message =
            response?.response?.data?.message || "Greška kod spremanja.";
          console.error("Greška prilikom spremanja:", message);
          toast.add({
            severity: "error",
            summary: "Došlo je do greške",
            detail: `${message}`,
            life: 8000,
          });
          // showErrorSave(response.data?.message || "Greška kod spremanja.");
        }
      } catch (error) {
        console.error("Greška prilikom spremanja:", error);
        showError();
      } finally {
        isLoadingPopupVisible.value = false;
      }
    },
    reject: () => {
      console.log("Spremanje otkazano od strane korisnika.");
    },
  });
};
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;
}

.main-container {
  flex: 1;
  overflow-y: auto;
  gap: 26px;
  display: flex;
  flex-direction: column;
}

.page-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}
.lock-icon {
  margin-left: 8px;
}

.loading-template {
  font-style: italic;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 700px;
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

.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.confirm-header h2 {
  font-weight: bold;
  font-size: 1.2rem;
}

.confirm-desc p {
  text-align: justify;
  /* font-size: 1.1rem; */
}

.confirm-dialog-container {
  position: relative;
  background: white;
  padding: 60px 20px 20px 20px; /* Gore više da ima mjesta za ikonu */
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-circle {
  font-size: 2rem;
  background: white;
  border: var(--border);
  border-radius: 50%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.icon-circle i {
  font-size: 3rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

h2.confirm-dialog-header {
  font-size: 1.5rem;
  margin: 0;
}

.confirm-desc {
  /* opacity: 0.8; */
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

/* .confirm-dialog-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
  padding: 20px;
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-container {
  grid-column: 1 / span 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

h2.confirm-dialog-header {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
} */

.confirm-desc {
  font-size: 1rem;
}

.acceptBtn {
  background-color: var(--primary-color) !important;
  border: none !important;
}

#submitBtn {
  padding: 0px 26px;
  color: var(--text-color);
  border: none;
  width: fit-content; /* ← Ovo! */
  min-width: unset;
  max-width: unset;
  justify-self: start; /* Ili center/end ovisno gdje želiš */
}
#submitBtn:hover,
#submitBtn:active {
  background-color: rgb(240, 240, 240);
}

#submitBtn.filled {
  background-color: var(--primary-color);
  color: white;
}

footer {
  justify-content: flex-end;
}

.footer-button {
  color: white;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-button * {
  color: white;
}

.footer-button:disabled {
  cursor: default;
}

.footer-button:disabled:hover,
.footer-button:disabled:active {
  background-color: var(--primary-color);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
