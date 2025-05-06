<template>
  <div class="predlozak-body">
    <div ref="sidebar" :class="['sidebar', { collapsed: isCollapsed }]">
      <Sidebar :is-collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
    </div>
    <main :style="mainStyles">
      <div class="main-content">
        <NuxtPage
          :loading="loading"
          :aiz-id="idIzracuna"
          :izracun="izracunData"
          :vrste-izracuna="vrsteIzracuna"
          :vrste-imovine="vrsteImovine"
          :djelatnosti="djelatnosti"
          :scenariji="scenariji"
          :katastarske-opcine="katastarskeOpcine"
          :mjere-prilagodbe="mjerePrilagodbe" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Sidebar from "~/components/kpkr/Sidebar.vue";
import { getCalculations } from "~/service/kpkr/calculations";

definePageMeta({
  roles: ['AP001']
})

const toast = useToast();
const opciStore = useOpciStore();
const cardStore = useCardStore();
const adaptStore = useAdaptStore();

const idIzracuna = ref<string | null>(null);
const izracunData = ref<any>(null);
const loading = ref(true);

const storedCollapsed = import.meta.client
  ? localStorage.getItem("isCollapsed")
  : false;
const isCollapsed = ref(storedCollapsed ? JSON.parse(storedCollapsed) : false);
const sidebarWidth = ref(isCollapsed.value ? "70px" : "275px");

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const mainStyles = computed(() => ({
  marginLeft: sidebarWidth.value,
  width: `calc(100% - ${sidebarWidth.value})`,
}));

watch(isCollapsed, (newValue) => {
  sidebarWidth.value = newValue ? "70px" : "275px";
  localStorage.setItem("isCollapsed", JSON.stringify(newValue));
});

// Dohvaćamo liste za select/autocomplete
const vrsteIzracuna = computed(() => opciStore.vrste_izracuna);
const vrsteImovine = computed(() => opciStore.vrste_objekta);
const djelatnosti = computed(() => opciStore.djelatnosti);
const scenariji = computed(() => opciStore.scenariji);
const katastarskeOpcine = computed(() => opciStore.katastarske_opcine);
const mjerePrilagodbe = computed(() => adaptStore.adaptacijske_mjere)

const fetchData = async (arg_id: string | null) => {
  console.log("arg_id: ", arg_id);
  loading.value = true;
  idIzracuna.value = cardStore.cardId || getIdFromUrl() || arg_id;

  try {
    if (idIzracuna.value) {
      const response = await getCalculations(idIzracuna.value);
      izracunData.value = response.data[0];
      console.log("index izračun: ", izracunData.value);

      opciStore.izracun = izracunData.value;

      cardStore.setCardId(izracunData.value?.aiz_id);
      cardStore.setBroj(izracunData.value?.aiz_broj);
      cardStore.setVrstaIzracuna(izracunData.value?.tvz_naziv);
      cardStore.setScenarij(izracunData.value?.tvs_id == 1 ? "RCP" : "SSP");
      adaptStore.fetchMetrictypes(idIzracuna.value);

    } else {
      await Promise.all([
        opciStore.fetchObjectTypes(null),
        opciStore.fetchActivities(null),
        opciStore.fetchMunicipalities(null),
      ]);
    }
    await Promise.all([
      opciStore.fetchCalculationTypes(null),
      opciStore.fetchScenarios(),
      adaptStore.fetchMetrictypes(null),
    ]);
  } catch (error) {
    console.error("Greška pri učitavanju:", error);
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Došlo je do greške prilikom dohvaćanja podataka.",
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.predlozak-body {
  display: flex;
  gap: 25px;
  overflow: visible;
  background-color: var(--bg-color);
}

.sidebar {
  position: fixed;
  width: 275px;
  /* Početna širina */
  height: 100vh;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  background: none;
  /* Glatka animacija promjene širine */
}

.sidebar.collapsed {
  width: 70px;
  /* Širina kad je suženo */
}

main {
  /* height: 100dvh; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 13px 13px 13px 0px;
  z-index: 99;
  overflow: visible;
  overflow-y: auto;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--bg-layout-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  overflow: visible;
  padding: 34px 26px 26px 26px;
  z-index: 99;
}
</style>
