<template>
  <div class="body">
    <div :class="['sidebar', { collapsed: isCollapsed }]" ref="sidebar">
      <AdminSidebar
        :is-collapsed="isCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
    </div>
    <main :style="mainStyles" style="background-color: white">
      <div class="main-content">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import AdminSidebar from "~/components/admin/AdminSidebar.vue";

definePageMeta({
  requiredRolePrefix: "AD",
});

// Inicijalno postavljamo default vrijednost
const isCollapsed = ref(false);
const sidebarWidth = ref("275px");

// Dohvaćamo vrijednost iz localStorage samo na klijentskoj strani
onMounted(() => {
  const storedCollapsed = localStorage.getItem("isCollapsed");
  if (storedCollapsed !== null) {
    isCollapsed.value = JSON.parse(storedCollapsed);
  }
  sidebarWidth.value = isCollapsed.value ? "70px" : "275px";
});

// Funkcija za prebacivanje stanja sidebara
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Praćenje promjena i spremanje nove vrijednosti u localStorage
watch(isCollapsed, (newValue) => {
  sidebarWidth.value = newValue ? "70px" : "275px";
  localStorage.setItem("isCollapsed", JSON.stringify(newValue));
});

// Kompjuterana vrijednost za stilove main elementa
const mainStyles = computed(() => ({
  marginLeft: sidebarWidth.value,
  width: `calc(100% - ${sidebarWidth.value})`,
}));
</script>

<style scoped>
.body {
  display: flex;
  gap: 25px;
  overflow: visible;
  background-color: var(--admin-bg-color);
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
  background: transparent;
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
  background-color: var(--admin-bg-color) !important;
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
