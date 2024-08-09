<template>
    <div :class="['sidebar', isCollapsed ? 'collapsed' : '']">
        <div :class="['sidebar-main', isCollapsed ? 'collapsed' : '']">
            <div :class="['sidebar-header', isCollapsed ? 'collapsed' : '']">
                <img :class="['logo-image', isCollapsed ? 'collapsed' : '']" src="../images/sidebar_logo.svg"
                    alt="logo">
                <font-awesome-icon :class="['narrow-icon', isCollapsed ? 'collapsed' : '']" icon="angles-left"
                    @click="toggleSidebar" />
            </div>
            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']" icon="list" />
                    <h2 :class="isCollapsed ? 'collapsed' : ''">Podaci za izračun</h2>
                </div>
                <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="map" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Opći podaci</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'mjere', isActiveRoute('/adaptacijske-mjere') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/adaptacijske-mjere">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="ruler-horizontal" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Adaptacijske mjere</h3>
                    </nuxt-link>
                </div>
            </div>
            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="chart-bar" />
                    <h2 :class="isCollapsed ? 'collapsed' : ''">Statistički podaci</h2>
                </div>
                <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/rizik-sazetak') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/rizik-sazetak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="table-cells" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Rizik sažetak</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/tablice-rizika') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/tablice-rizika">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="table-columns" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Tablice rizika</h3>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div :class="['profile-container', isCollapsed ? 'collapsed' : '']">
            <div :class="['profile-content', isCollapsed ? 'collapsed' : '']">
                <font-awesome-icon icon="circle-user" size="xl" />
                <div :class="['profile-details', isCollapsed ? 'collapsed' : '']">
                    <h4 :class="isCollapsed ? 'collapsed' : ''">Ante Antić</h4>
                    <span :class="isCollapsed ? 'collapsed' : ''">ante.antic@gmail.com</span>
                </div>
            </div>
            <div :class="['logout-container', isCollapsed ? 'collapsed' : '']" @click="doLogout">
                <font-awesome-icon :class="['logout-icon', isCollapsed ? 'collapsed' : '']"
                    icon="arrow-right-from-bracket" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { navigateTo } from '#app';
import { logout } from '@/service/logout';

// Koristite useRoute za dobivanje trenutne rute
const route = useRoute();

// const isCollapsed = ref(false);

// Prima prop za stanje bočne trake
const props = defineProps(['isCollapsed'])

// Emitira događaj za prebacivanje stanja bočne trake
const emit = defineEmits(['toggle-sidebar'])
const toggleSidebar = () => {
    emit('toggle-sidebar')
    // isCollapsed.value = !isCollapsed.value;
}

// Definirajte funkciju za provjeru aktivne rute
const isActiveRoute = (path) => {
    return computed(() => route.path === path).value;
};

const doLogout = async () => {
    await logout();
    window.location.reaload();
    // navigateTo('/login')
}
</script>

<style scoped>
.sidebar {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 26px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
}


.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 26px;
    color: var(--text-color);
}



.narrow-icon:hover {
    transform: translateX(-3px);
    cursor: pointer;
}

.sidebar-content {
    border-top: var(--border-line-sidebar);
    padding-top: 26px;
    padding-bottom: 26px;

    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: flex-start;
    gap: 20px;
}

.sidebar-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: var(--primary-color);
}

.list-icon {
    color: var(--primary-color);
    font-size: 16px;
}

h2 {
    color: var(--primary-color);
    font-size: 16px;
}

h3 {
    font-weight: 500;
}

.navigation {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.nuxtlink-form {
    outline: none;
    text-decoration: none;
    width: 100%;
    padding: 11px 0px;

    display: flex;
    align-items: center;
    gap: 10px;
    background-color: var(--bg-color);
    border-radius: var(--border-form-radius);
    padding-left: 20px;
    color: var(--text-color);
    cursor: pointer;
}

.active {
    background-color: var(--primary-color);
    color: white;
    cursor: default;
}

.inactive {
    background-color: var(--bg-color);
    color: var(--text-color);
}

.inactive:hover {
    background-color: var(--input-hover-color);
}

.active {
    background-color: var(--primary-color);
    color: white;
}

.inactive {
    background-color: var(--bg-color);
    color: var(--text-color);
}

.profile-container {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--text-color);
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: 0px;

    color: var(--text-color);
    font-weight: 400;
}

.profile-details>h4 {
    font-size: 16px;
    font-weight: 400;
}

.profile-details>span {
    font-size: 14px;
    opacity: 0.6;
}

.profile-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.logout-icon {
    color: var(--red);
    cursor: pointer;
}

.logout-container {
    position: relative;
}

.logout-icon:hover {
    color: var(--red-hover);
    transform: translateX(3px);
}

.logout-icon:active {
    color: var(--red-focus);
    transform: translateX(0px);
}

/* SUŽENO */

.sidebar.collapsed {
    width: 70px;
    padding: 26px 0px;
}

.logo-image.collapsed {
    display: none;
}

.sidebar-header.collapsed {
    height: 63px;
    justify-content: center;
}

.narrow-icon.collapsed {
    transform: rotate(180deg);
}

.narrow-icon.collapsed:hover {
    transform: translateX(3px);
    transform: rotate(180deg);
}

.sidebar-content.collapsed {
    align-items: space-between;
    justify-content: center;
    padding: 26px 8px;
}

.sidebar-heading.collapsed {
    align-items: center;
    justify-content: center;
    gap: 0px;
}

.nuxtlink-form.collapsed {
    padding-left: 0px;
    gap: 0px;

    justify-content: center;
    align-items: center;
}

h2.collapsed,
h3.collapsed,
.profile-details.collapsed,
.logout-container.collapsed {
    display: none;
}

.profile-container.collapsed {
    justify-content: center;
    align-items: center;
}
</style>