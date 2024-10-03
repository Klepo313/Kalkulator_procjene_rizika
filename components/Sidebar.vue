<!-- // eslint-disable-next-line vue/multi-word-component-names -->
<template>
    <div :class="['sidebar', isCollapsed ? 'collapsed' : '']">
        <div :class="['sidebar-main', isCollapsed ? 'collapsed' : '']">
            <div :class="['sidebar-header', isCollapsed ? 'collapsed' : '']">
                <img :class="['logo-image', isCollapsed ? 'collapsed' : '']" src="../images/KPKR_logo_sidebar.svg"
                    alt="logo" style="cursor: pointer;" @click="navigateTo('/kpkr')">
                <font-awesome-icon :class="['narrow-icon', isCollapsed ? 'collapsed' : '']" icon="angles-left"
                    @click="toggleSidebar" />
            </div>
            <div :class="['sidebar-content izracun-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']" style="opacity: 1;">
                    <h2 :class="isCollapsed ? 'collapsed' : ''"
                        style="font-size: 14px; font-weight: 400; color: var(--text-color);">
                        Broj izračuna:
                    </h2>
                    <span class="broj-izracuna">{{ idIzracuna }}</span>
                </div>
            </div>
            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']" icon="list" />
                    <h2 :class="isCollapsed ? 'collapsed' : ''">Unos podataka za procjenu rizika</h2>
                </div>
                <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kpkr/predlozak') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kpkr/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="map" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Opći podaci</h3>
                    </nuxt-link>
                    <nuxt-link :class="[
                        'nuxtlink-form',
                        'mjere',
                        isActiveRoute('/kpkr/predlozak/mjere-prilagodbe') ? 'active' : 'inactive',
                        isCollapsed ? 'collapsed' : '',
                        isDisabled ? 'disabled' : ''  // Dodana klasa 'disabled' ako je idIzracuna '/'
                    ]" :to="isDisabled ? '#' : '/kpkr/predlozak/mjere-prilagodbe'" :tabindex="isDisabled ? -1 : 0"
                        :aria-disabled="isDisabled">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="ruler-horizontal" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Mjere prilagodbe</h3>
                    </nuxt-link>
                </div>
            </div>
            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <nuxt-link :class="[
                    'nuxtlink-form',
                    'opci',
                    isActiveRoute('/kpkr/predlozak/rizik-sazetak') ? 'active' : 'inactive',
                    isCollapsed ? 'collapsed' : '',
                    isDisabled ? 'disabled' : ''  // Dodana klasa 'disabled' ako je idIzracuna '/'
                ]" :to="isDisabled ? '#' : '/kpkr/predlozak/rizik-sazetak'" :tabindex="isDisabled ? -1 : 0"
                    :aria-disabled="isDisabled">
                    <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="table-cells" />
                    <h3 :class="isCollapsed ? 'collapsed' : ''">Rezultat izračuna</h3>
                </nuxt-link>
                <!-- <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="chart-bar" />
                    <h2 :class="isCollapsed ? 'collapsed' : ''">Statistički podaci</h2>
                </div> -->
                <!-- <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                    <nuxt-link :class="[
                        'nuxtlink-form',
                        'opci',
                        isActiveRoute('/rizik-sazetak') ? 'active' : 'inactive',
                        isCollapsed ? 'collapsed' : '',
                        isDisabled ? 'disabled' : ''  // Dodana klasa 'disabled' ako je idIzracuna '/'
                    ]" :to="isDisabled ? '#' : '/rizik-sazetak'" :tabindex="isDisabled ? -1 : 0"
                        :aria-disabled="isDisabled">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="table-cells" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Rezultat izračuna</h3>
                    </nuxt-link>

                </div> -->
            </div>
        </div>
        <div class="bottom-container">
            <button :class="['back', isCollapsed ? 'collapsed' : '']" @click="navigateTo('/kpkr/predlosci')">
                <font-awesome-icon icon="arrow-left-long" />
                <span v-if="!isCollapsed">Prethodni izračuni</span>
            </button>
            <div :class="['profile-container', isCollapsed ? 'collapsed' : '']">
                <div :class="['profile-content', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon icon="circle-user" size="xl" />
                    <div :class="['profile-details', isCollapsed ? 'collapsed' : '']">
                        <h4 :class="isCollapsed ? 'collapsed' : ''"
                            :style="{ fontSize: nameLength > 20 ? '14px' : 'initial' }" class="responsive-text">
                            {{ capitalizeName(storedName + ' ' + storedSurname) }}
                        </h4>
                        <span :class="isCollapsed ? 'collapsed' : ''" class="responsive-text">
                            {{ storedEmail ? storedEmail : username }}
                        </span>
                    </div>
                </div>
                <div :class="['logout-container', isCollapsed ? 'collapsed' : '']" @click="doLogout">
                    <font-awesome-icon :class="['logout-icon', isCollapsed ? 'collapsed' : '']"
                        icon="arrow-right-from-bracket" />
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { navigateTo } from '#app';
import { logout } from '@/service/logout';
import { useIzracunStore } from '~/stores/main-store';
// import { decryptCookie } from '#imports';

const izracunStore = useIzracunStore();

// Koristite useRoute za dobivanje trenutne rute
const route = useRoute();
const idIzracuna = ref(
    useCookie('id_izracuna').value == '/' ||
        useCookie('id_izracuna') == 0
        ? '/'
        : parseInt(useCookie('id_izracuna').value)
);
const username = ref(
    useCookie('username').value == undefined
        ? 'ime_prezime'
        : useCookie('username').value.toLowerCase()
);
// const idIzracuna = ref(
//     useCookie('id_izracuna').value == '/' ||
//         useCookie('id_izracuna') == 0
//         ? '/'
//         : parseInt(decryptCookie(useCookie('id_izracuna').value))
// );
// const username = ref(
//     useCookie('username').value == undefined
//         ? 'ime_prezime'
//         : decryptCookie(useCookie('username').value).toLowerCase()
// );

let storedName = '';
let storedSurname = '';
let storedEmail = '';
const nameLength = ref(0);

if (import.meta.client) {
    storedName = localStorage.getItem('name') || '';
    storedSurname = localStorage.getItem('surname') || '';
    storedEmail = localStorage.getItem('email')
        ? localStorage.getItem('email')
        : null;

    nameLength.value = storedName.length + storedSurname.length;
}
// if (import.meta.client) {
//     storedName = atob(localStorage.getItem('name') || '');
//     storedSurname = atob(localStorage.getItem('surname') || '');
//     storedEmail = localStorage.getItem('email')
//         ? atob(localStorage.getItem('email'))
//         : null;

//     nameLength.value = storedName.length + storedSurname.length;
// }

// console.log("Ime:", storedName);
// console.log("Prezime:", storedSurname);
// console.log("Email:", storedEmail);
// console.log("Duljina:", nameLength.value);

function capitalizeName(fullName) {
    return fullName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const isDisabled = computed(() => idIzracuna.value === '/' || idIzracuna.value == 0);

console.log("sidebar: ", idIzracuna.value);

watch(() => izracunStore.idIzracuna, (newValue) => {
    console.log('idIzracuna updated:', newValue);
    idIzracuna.value = parseInt(newValue);
});

// Prima prop za stanje bočne trake
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

/* .sidebar-header img {
    max-width: 180px;
} */

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
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: var(--primary-color);
}

.broj-izracuna {
    color: var(--text-color);
    font-weight: bold;
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
    background: var(--primary-color);
    opacity: 1;
    transform: translateX(-3px);
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
</style>