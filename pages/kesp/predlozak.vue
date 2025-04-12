<template>
    <div class="body-container">
        <div ref="sidebar" :class="['sidebar', { 'collapsed': isCollapsed }]">
            <KespSidebar v-if="kespId" :isCollapsed="isCollapsed" :uiz_id="kespId" @toggle-sidebar="toggleSidebar"
                @update-active-section="updateActiveSection" />
        </div>
        <main :style="mainStyles" style="background-color: var(--kesp-bg);">
            <div class="all-main-content">
                <NuxtPage v-if="kespId" :section-title="activeSectionTitle" :uiz_id="kespId" />
            </div>
        </main>
    </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import KespSidebar from '~/components/kesp/KespSidebar.vue';
import { useKespStore } from '#imports';

definePageMeta({
    requiredRole: "AP002",
    middleware: [
        'kesp'
    ],
});

const vehicleStore = useVehicleStore();
const kespStore = useKespStore();
const opseg2Store = useOpseg2Store();

const kespId = ref(null)

onMounted(async () => {
    kespId.value = getIdFromUrl()
    kespStore.clearStore();
    vehicleStore.resetData();
    opseg2Store.clearStore();

    if (kespId.value != 'null') {
        try {
            await kespStore.fetchHeader(kespId.value);
            await opseg2Store.fetchEnergySources(kespId.value);
            await vehicleStore.fetchVehicles(kespId.value);
            // await vehicleStore.fetchEmissions();
            // await vehicleStore.fetchFuels();
        } catch (error) {
            // console.error('Error fetching data:', error);
            navigateTo('/kesp/predlosci')
        }
    } else {
        navigateTo('/kesp/predlosci')
    }
})

const activeSectionTitle = ref('');

const updateActiveSection = (sectionTitle) => {
    activeSectionTitle.value = sectionTitle; // Ažuriramo naslov iz događaja
};

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

</script>

<style scoped>
.body-container {
    display: flex;
    gap: 25px;
    overflow: visible;
    background-color: var(--kesp-bg);
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
    background-color: var(--kesp-bg);
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
    background-color: white;
}

.all-main-content {
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