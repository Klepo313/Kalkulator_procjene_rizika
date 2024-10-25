<template>
    <div class="body">
        <div :class="['sidebar', { 'collapsed': isCollapsed }]" ref="sidebar">
            <KespSidebar :is-collapsed="isCollapsed" @toggle-sidebar="toggleSidebar"
                @update-active-section="updateActiveSection" />
        </div>
        <main :style="mainStyles">
            <div class="main-content">
                <NuxtPage :section-title="activeSectionTitle" />
            </div>
        </main>
    </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
import KespSidebar from '~/components/KespSidebar.vue';
import { useKespStore } from '#imports';

definePageMeta({
    middleware: [
        'auth',
    ],
});

const vehicleStore = useVehicleStore();
const kespStore = useKespStore();
const opseg2Store = useOpseg2Store();

const kespId = ref(null);

onMounted(async () => {
    const res = await initializeCookie('kesp-id');
    kespId.value = parseInt(res['kesp-id']);

    kespStore.clearStore();
    vehicleStore.resetData();
    opseg2Store.clearStore();

    await kespStore.fetchHeader(kespId);
    await opseg2Store.fetchEnergySources(kespId.value);
    await vehicleStore.fetchVehicles(kespId.value);
    await vehicleStore.fetchEmissions();
    await vehicleStore.fetchFuels();
})

const activeSectionTitle = ref('');

const updateActiveSection = (sectionTitle) => {
    activeSectionTitle.value = sectionTitle; // Ažuriramo naslov iz događaja
};

// Reaktivna varijabla za praćenje stanja bočne trake
const isCollapsed = ref(false)

// Reaktivna varijabla za spremanje trenutne širine bočne trake
const sidebarWidth = ref('275px')

// Funkcija za prebacivanje stanja bočne trake
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}

// Reaktivno praćenje promjena u isCollapsed za ažuriranje širine sidebarWidth
watch(isCollapsed, (newValue) => {
    sidebarWidth.value = newValue ? '70px' : '275px'
})

// Kompjuterana vrijednost za stilove main elementa
const mainStyles = computed(() => ({
    marginLeft: sidebarWidth.value,
    width: `calc(100% - ${sidebarWidth.value})`,
}))

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