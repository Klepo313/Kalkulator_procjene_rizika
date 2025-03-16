<!-- // eslint-disable-next-line vue/multi-word-component-names -->
<template>
    <div :class="['sidebar', isCollapsed ? 'collapsed' : '']">
        <div :class="['sidebar-main', isCollapsed ? 'collapsed' : '']">
            <div :class="['sidebar-header', isCollapsed ? 'collapsed' : '']">
                <img
                    :class="['logo-image', isCollapsed ? 'collapsed' : '']"
                    src="../public/static/images/atd_solucije.png" alt="logo" style="cursor: pointer;"
                    @click="navigateTo('/')">
                <font-awesome-icon
                    :class="['narrow-icon', isCollapsed ? 'collapsed' : '']" icon="angles-left"
                    @click="toggleSidebar" />
            </div>
            <div :class="['sidebar-content izracun-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']" style="opacity: 1;">
                    <h2
                        :class="isCollapsed ? 'collapsed' : ''"
                        style="font-size: 14px; font-weight: 400; color: var(--text-color);">
                        Korisnik:
                    </h2>
                    <span class="broj-izracuna">{{ 'Admin' }}</span>
                </div>
            </div>
            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div v-for="(section, index) in sections" :key="index"
                    :class="['sidebar-section', isCollapsed ? 'collapsed' : '']">

                    <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']" @click="toggleSection(index)">
                        <font-awesome-icon v-if="section.icon" :class="['list-icon', isCollapsed ? 'collapsed' : '']"
                            :icon="section.icon" />

                        <h2 :class="isCollapsed ? 'collapsed' : ''">{{ section.title }}</h2>
                        <span :class="['icon-container', isCollapsed ? 'collapsed' : '']">
                            <font-awesome-icon :class="['icon', 'icon-down', section.collapsed ? 'collapsed' : '']"
                                :icon="section.collapsed ? 'angle-down' : 'angle-up'" />
                        </span>
                    </div>

                    <div v-if="!section.collapsed" :class="['navigation', isCollapsed ? 'collapsed' : '']">
                        <nuxt-link v-for="(link, linkIndex) in section.links" :key="linkIndex"
                            :class="['nuxtlink-form', 'opci', isActiveRoute(link.to) ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '', !link.available ? 'disabled' : '']" :to="link.available ? link.to : '#'">
                            <font-awesome-icon v-if="link.icon" :class="['icon', isCollapsed ? 'collapsed' : '']"
                                :icon="link.icon" />
                            <img v-else-if="link.image" :src="link.image" :alt="link.label"
                                :class="['icon', isCollapsed ? 'collapsed' : '']">
                            <h3 :class="isCollapsed ? 'collapsed' : ''">{{ link.label }}</h3>
                        </nuxt-link>
                    </div>
                </div>

            </div>
        </div>
        <div class="bottom-container">
            <button :class="['back', isCollapsed ? 'collapsed' : '']" @click="navigateTo('/')">
                <font-awesome-icon icon="arrow-left-long" />
                <span v-if="!isCollapsed">Početna stranica</span>
            </button>
            <div :class="['profile-container', isCollapsed ? 'collapsed' : '']">
                <div :class="['profile-content', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon icon="circle-user" size="xl" />
                    <div :class="['profile-details', isCollapsed ? 'collapsed' : '']">
                        <h4
                            :class="isCollapsed ? 'collapsed' : ''"
                            :style="{ fontSize: (name + surname).length > 20 ? '14px' : 'initial' }"
                            class="responsive-text">
                            {{ capitalizeName(name + ' ' + surname) }}
                        </h4>
                        <span :class="isCollapsed ? 'collapsed' : ''" class="responsive-text">
                            {{ email ? email : username.toLowerCase() }}
                        </span>
                    </div>
                </div>
                <div :class="['logout-container', isCollapsed ? 'collapsed' : '']" @click="doLogout">
                    <font-awesome-icon
                        :class="['logout-icon', isCollapsed ? 'collapsed' : '']"
                        icon="arrow-right-from-bracket" />
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { navigateTo } from '#app';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { logout } from '~/service/user/user';
// import { decryptCookie } from '#imports';

// Koristite useRoute za dobivanje trenutne rute
const route = useRoute();
const router = useRouter();

const idIzracuna = ref('/');
const username = ref('');
const name = ref('');
const surname = ref('');
const email = ref('');

// Definiramo sections
const sections = ref([
    {
        title: 'Glavni izbornik',
        icon: 'bars-staggered',
        collapsed: false,
        links: [
            { label: 'Početna stranica', to: '/admin', icon: 'house', isActive: false, available: true },
            { label: 'Dodavanje korisnika', to: '/admin/korisnici', icon: 'user-plus', isActive: false, available: true },
            { label: 'Ažuriranje podataka', to: '/admin/azuriranje', icon: 'code-compare', isActive: false, available: false },
        ],
    },
    {
        title: 'Aplikacije',
        icon: 'shapes',
        collapsed: false,
        links: [
            { label: 'Kalkulator procjene klimatskih rizika', to: '/admin/kpkr', image: '../static/images/kpkr_logo_slim.svg', isActive: false, available: false },
            { label: 'Kalkulator emisija stakleničkih plinova', to: '/admin/kesp', image: '../static/images/kesp_logo_slim.svg', isActive: false, available: false },
        ],
    },
]);

// Toggle collapse state for each section
const toggleSection = (index) => {
    sections.value[index].collapsed = !sections.value[index].collapsed;
};

function capitalizeName(fullName) {
    return fullName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Prima prop za stanje bočne trake
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps(['isCollapsed'])

// Emitira događaj za prebacivanje stanja bočne trake
const emit = defineEmits(['toggle-sidebar', 'updateActiveSection'])

// const activeHash = ref('');

const toggleSidebar = () => {
    emit('toggle-sidebar')
    // isCollapsed.value = !isCollapsed.value;
}

const isActiveRoute = (link) => {
    return link === `${router.currentRoute.value.path}`;
};


const cookiesToGet = ['kesp-id', 'username', 'name', 'surname', 'email'];

onMounted(async () => {
    try {
        const cookieData = await initializeCookie(cookiesToGet);
        idIzracuna.value = cookieData['kesp-id'] || null;
        username.value = cookieData['username'] || '';
        name.value = cookieData['name'] || '';
        surname.value = cookieData['surname'] || '';
        email.value = cookieData['email'] || null;
        // console.log(idIzracuna.value, username.value, name.value, surname.value, email.value);
    } catch (error) {
        // console.error("Error loading cookies: ", error);
    }
})

const doLogout = async () => {
    await logout();
    navigateTo('/login')
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

.sidebar-header img {
    max-width: 180px;
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

.izracun-content {
    padding-top: 13px;
    padding-bottom: 13px;
}

.sidebar-heading {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: var(--text-color);
}

.broj-izracuna {
    color: var(--text-color);
    font-weight: bold;
}

.list-icon {
    color: var(--text-color);
    font-size: 16px;
}

h2 {
    color: var(--text-color);
    font-size: 16px;
}

h3 {
    font-weight: 500;
}

.navigation {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 20px;
}

.nuxtlink-form {
    outline: none;
    text-decoration: none;
    width: 100%;
    padding: 11px 0px;

    display: flex;
    align-items: center;
    gap: 10px;
    background-color: var(--admin-bg-color);
    border-radius: var(--border-form-radius);
    padding-left: 20px;
    color: var(--text-color);
    cursor: pointer;
}

.nuxtlink-form.disabled {
    color: gray;
    /* Boja zasivljene veze */
    pointer-events: none;
    /* Onemogućava klikove */
    cursor: default;
    /* Pokazivač kursora */
    text-decoration: none;
    /* Uklanja underline ili druge efekte */
}

.nuxtlink-form.disabled .icon {
    color: gray;
    /* Ikonica je također zasivljena */
}

.icon-container {
    position: absolute;
    right: 0px;
    padding: 5px;

    border-radius: 50%;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-container:hover {
    background-color: rgb(204, 204, 204);
}

.icon {
    width: 14px;
    height: 14px;
    color: var(--text-color);
}

.active {
    background-color: var(--text-color);
    color: white;
    cursor: default;
}

.inactive {
    background-color: var(--admin-bg-color);
    color: var(--text-color);
}

.inactive:hover {
    background-color: var(--admin-nuxtlink-hover);
}

.active * {
    color: white;
}

.inactive {
    background-color: var(--admin-bg-color);
    color: var(--text-color);
}

.bottom-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 26px;
}

.back {
    width: 100%;
    display: flex;
    align-items: center;

    gap: 10px;

    color: var(--text-color);
    background: none;
    border: var(--border);
    font-weight: 500;
    cursor: pointer;
}

.back.collapsed {
    justify-content: center;
}

.back:hover {
    color: white;
    background: var(--text-color);
    opacity: 1;
    /* transform: translateX(-3px); */
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
    width: 100%;
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

.responsive-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    width: 100%;

    font-size: clamp(12px, 2vw, 18px);
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

.logo-image {
    width: 140px;
}

.logo-image.collapsed {
    display: none;
}

.sidebar-content.izracun-content.collapsed {
    padding-top: 13px;
    padding-bottom: 13px;
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

.icon-container.collapsed {
    display: none;
}
</style>