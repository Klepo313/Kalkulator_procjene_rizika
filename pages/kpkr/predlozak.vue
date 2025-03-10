<template>
    <div class="body">
        <div ref="sidebar" :class="['sidebar', { 'collapsed': isCollapsed }]">
            <Sidebar :is-collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
        </div>
        <main :style="mainStyles">
            <div class="main-content">
                <NuxtPage v-if="idIzracuna || idIzracuna == null" :aiz_id="idIzracuna" :data="izracunData" />
                <span v-else>
                    <font-awesome-icon icon="spinner" spin />
                    Dohvaćanje podataka...
                </span>
            </div>
        </main>
    </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import izracun from '~/middleware/izracun';
import { getCalculations } from '~/service/kpkr/calculations';


definePageMeta({
    middleware: [
        'auth',
        // 'kpkr-access',
        'izracun',
    ],
});

const opciStore = useOpciStore();
const toastErrorStore = useToastErrorStore();
const cardStore = useCardStore();

const idIzracuna = ref(null)
const izracunData = ref(null)

const compId = computed(() => cardStore.broj);

// Inicijaliziramo isCollapsed na temelju vrijednosti spremljene u localStorage (ako postoji)
const storedCollapsed = import.meta.client ? localStorage.getItem('isCollapsed') : false;
const isCollapsed = ref(storedCollapsed ? JSON.parse(storedCollapsed) : false);

// Postavljamo početnu širinu sidebar-a ovisno o isCollapsed vrijednosti
const sidebarWidth = ref(isCollapsed.value ? '70px' : '275px');

// Funkcija za prebacivanje stanja bočne trake
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

// Reaktivno praćenje promjena u isCollapsed za ažuriranje širine sidebarWidth i spremanje u localStorage
watch(isCollapsed, (newValue) => {
    sidebarWidth.value = newValue ? '70px' : '275px';
    localStorage.setItem('isCollapsed', JSON.stringify(newValue));
});

// Kompjuterana vrijednost za stilove main elementa
const mainStyles = computed(() => ({
    marginLeft: sidebarWidth.value,
    width: `calc(100% - ${sidebarWidth.value})`,
}));

watch(compId, async (newValue) => {
    //// console.info("Novi broj: ", newValue);
    idIzracuna.value = cardStore.cardId;
    if (idIzracuna.value) {
        try {
            const response = await getCalculations(idIzracuna.value)
            izracunData.value = response.data[0]
            // console.log("Predložak izračun: ", izracunData.value);

            cardStore.setCardId(izracunData.value?.aiz_id);
            cardStore.setBroj(izracunData.value?.aiz_broj);
            cardStore.setVrstaIzracuna(izracunData.value?.tvz_naziv)
            cardStore.setScenarij(izracunData.value?.tvs_sif == 1 ? 'RCP' : 'SSP');
        } catch (error) {
            // console.log(error);
            navigateTo('/kpkr/predlosci');
        }
    }
});

onMounted(async () => {
    idIzracuna.value = getIdFromUrl();
    // console.log("Id u predlosku: " + idIzracuna.value);

    opciStore.clearOpciPodaci();
    await opciStore.fetchCalculationTypes();
    await opciStore.fetchObjectTypes();
    await opciStore.fetchActivities();
    await opciStore.fetchMunicipalities();
    await opciStore.fetchScenarios();

    if (idIzracuna.value) {
        try {
            const response = await getCalculations(idIzracuna.value)
            izracunData.value = response.data[0]
            // console.log("Predložak izračun: ", izracunData.value);

            cardStore.setCardId(izracunData.value?.aiz_id);
            cardStore.setBroj(izracunData.value?.aiz_broj);
            cardStore.setVrstaIzracuna(izracunData.value?.tvz_naziv)
            cardStore.setScenarij(izracunData.value?.tvs_id == 1 ? 'RCP' : 'SSP');
        } catch (error) {
            // console.log(error);
            navigateTo('/kpkr/predlosci');
        }
    }
});

</script>

<style scoped>
.body {
    display: flex;
    gap: 25px;
    overflow: visible;
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
    padding: 13px 13px 13px 0px;
    min-height: 100vh;
    z-index: 99;
    overflow: visible;
    overflow-y: auto;
    transition: margin-left 0.3s ease, width 0.3s ease;
}

.main-content {
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