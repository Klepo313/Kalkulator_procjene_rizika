<!-- // eslint-disable-next-line vue/multi-word-component-names -->
<template>
    <div :class="['sidebar', isCollapsed ? 'collapsed' : '']">
        <div :class="['sidebar-main', isCollapsed ? 'collapsed' : '']">
            <div :class="['sidebar-header', isCollapsed ? 'collapsed' : '']">
                <img :class="['logo-image', isCollapsed ? 'collapsed' : '']"
                    src="../public/static/images/KESP_logo_sidebar.svg" alt="logo" style="cursor: pointer;"
                    @click="navigateTo('/kesp/predlosci')">
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
            <!-- <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']" icon="list" />
                    <h2 :class="isCollapsed ? 'collapsed' : ''">Opseg 1</h2>
                    <span class="icon-container">
                        <font-awesome-icon :class="['icon', 'icon-down', isCollapsed ? 'collapsed' : '']"
                            icon="angle-down" />
                    </span>
                </div>
                <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kesp/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="car-side" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Osobna vozila</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak1') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kesp/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="truck" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Teretna vozila</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak2') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kesp/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="tractor" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Strojevi</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak3') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kesp/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="charging-station" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Stacionarni izvor</h3>
                    </nuxt-link>
                    <nuxt-link
                        :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak4') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                        to="/kesp/predlozak">
                        <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="rectangle-list" />
                        <h3 :class="isCollapsed ? 'collapsed' : ''">Faktori konverzije</h3>
                    </nuxt-link>
                </div>
                <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                    <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']">
                        <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']" icon="list" />
                        <h2 :class="isCollapsed ? 'collapsed' : ''">Opseg 2</h2>
                        <span class="icon-container">
                            <font-awesome-icon :class="['icon', 'icon-down', isCollapsed ? 'collapsed' : '']"
                                icon="angle-down" />
                        </span>
                    </div>
                        <nuxt-link
                            :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/predlozak5') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                            to="/kesp/predlozak">
                            <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="plug-circle-bolt" />
                            <h3 :class="isCollapsed ? 'collapsed' : ''">Izračun GHG opseg 2</h3>
                        </nuxt-link>
                    </div>
                </div> -->

            <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div v-for="(section, index) in sections" :key="index"
                    :class="['sidebar-section', isCollapsed ? 'collapsed' : '']">

                    <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']" @click="toggleSection(index)">
                        <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']"
                            :icon="section.icon" />
                        <h2 :class="isCollapsed ? 'collapsed' : ''">{{ section.title }}</h2>
                        <span :class="['icon-container', isCollapsed ? 'collapsed' : '']">
                            <font-awesome-icon :class="['icon', 'icon-down', section.collapsed ? 'collapsed' : '']"
                                :icon="section.collapsed ? 'angle-down' : 'angle-up'" />
                        </span>
                    </div>

                    <div v-if="!section.collapsed" :class="['navigation', isCollapsed ? 'collapsed' : '']">
                        <nuxt-link v-for="(link, linkIndex) in section.links" :key="linkIndex"
                            :class="['nuxtlink-form', 'opci', isActiveRoute(link.to) ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                            :to="link.to">
                            <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" :icon="link.icon" />
                            <h3 :class="isCollapsed ? 'collapsed' : ''">{{ link.label }}</h3>
                        </nuxt-link>
                        <!-- <nuxt-link
                            :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/ukupni-utrosak') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                            @click.prevent="handleLinkClick('ukupni-utrosak', '/kesp/ukupni-utrosak')">
                            <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="list-ul" />
                            <h3 :class="isCollapsed ? 'collapsed' : ''">Ukupni utrošak</h3>
                        </nuxt-link> -->
                    </div>
                </div>
                <!-- <div :class="['sidebar-section', isCollapsed ? 'collapsed' : '']">

                    <div :class="['navigation', isCollapsed ? 'collapsed' : '']">
                        <nuxt-link
                            :class="['nuxtlink-form', 'opci', isActiveRoute('/kesp/ukupni-utrošak') ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']">
                            <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" icon="list-ul" />
                            <h3 :class="isCollapsed ? 'collapsed' : ''">Ukupni utrošak</h3>
                        </nuxt-link>
                    </div>
                </div> -->
            </div>

            <!-- <div :class="['sidebar-content', isCollapsed ? 'collapsed' : '']">
                <div v-for="(section, index) in sections" :key="index"
                    :class="['sidebar-section', isCollapsed ? 'collapsed' : '']">
                    <div :class="['sidebar-heading', isCollapsed ? 'collapsed' : '']" @click="toggleSection(index)">
                        <font-awesome-icon :class="['list-icon', isCollapsed ? 'collapsed' : '']"
                            :icon="section.icon" />
                        <h2 :class="isCollapsed ? 'collapsed' : ''">{{ section.title }}</h2>
                        <span :class="['icon-container', isCollapsed ? 'collapsed' : '']">
                            <font-awesome-icon :class="['icon', 'icon-down', section.collapsed ? 'collapsed' : '']"
                                :icon="section.collapsed ? 'angle-down' : 'angle-up'" />
                        </span>
                    </div>

                    <div v-if="!section.collapsed" :class="['navigation', isCollapsed ? 'collapsed' : '']">
                        <nuxt-link v-for="(link, linkIndex) in section.links" :key="linkIndex"
                            :class="['nuxtlink-form', 'opci', isActiveRoute(link.to) ? 'active' : 'inactive', isCollapsed ? 'collapsed' : '']"
                            @click.prevent="handleLinkClick(section.title, link.to)">
                            <font-awesome-icon :class="['icon', isCollapsed ? 'collapsed' : '']" :icon="link.icon" />
                            <h3 :class="isCollapsed ? 'collapsed' : ''">{{ link.label }}</h3>
                        </nuxt-link>
                    </div>
                </div>
            </div> -->

        </div>
        <div class="bottom-container">
            <button :class="['back', isCollapsed ? 'collapsed' : '']" @click="navigateTo('/kesp/predlosci')">
                <font-awesome-icon icon="arrow-left-long" />
                <span v-if="!isCollapsed">Prethodni izračuni</span>
            </button>
            <div :class="['profile-container', isCollapsed ? 'collapsed' : '']">
                <div :class="['profile-content', isCollapsed ? 'collapsed' : '']">
                    <font-awesome-icon icon="circle-user" size="xl" />
                    <div :class="['profile-details', isCollapsed ? 'collapsed' : '']">
                        <h4 :class="isCollapsed ? 'collapsed' : ''"
                            :style="{ fontSize: nameLength > 20 ? '14px' : 'initial' }" class="responsive-text">
                            {{ capitalizeName(name + ' ' + surname) }}
                        </h4>
                        <span :class="isCollapsed ? 'collapsed' : ''" class="responsive-text">
                            {{ email ? email : username.toLowerCase() }}
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
import { computed, defineEmits, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { navigateTo } from '#app';
import { logout } from '~/temp/logout';
import { useIzracunStore } from '~/stores/main-store';
// import { decryptCookie } from '#imports';

const izracunStore = useIzracunStore();

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
        title: 'Opsezi izračuna',
        icon: 'list',
        collapsed: false,
        links: [
            { label: 'Opseg 1', to: '/kesp/predlozak', icon: 'bars-staggered', isActive: false },
            { label: 'Opseg 2', to: '/kesp/predlozak/opseg2', icon: 'bars-staggered', isActive: false },
            { label: 'Opseg 3', to: '/kesp/predlozak/opseg3', icon: 'bars-staggered', isActive: false },
            { label: 'Pregled', to: '/kesp/predlozak/pregled', icon: 'file-lines', isActive: false },
            // { label: 'Opseg 1', to: '/kesp/predlozak', icon: 'car', isActive: false },
            // { label: 'Opseg 2', to: '/kesp/predlozak/opseg2', icon: 'bolt', isActive: false },
            // { label: 'Opseg 3', to: '/kesp/predlozak/opseg3', icon: 'list-ul', isActive: false },
            // { label: 'Pregled', to: '/kesp/predlozak/pregled', icon: 'file-lines', isActive: false },
        ],
    },
]);
// const sections = ref([
//     {
//         title: 'Opseg 1',
//         icon: 'list',
//         collapsed: false,
//         links: [
//             { label: 'Sva vozila', to: '/kesp/predlozak#sva-vozila', icon: 'car', isActive: false },
//             { label: 'Stacionarni izvor', to: '/kesp/predlozak#stacionarni-izvor', icon: 'charging-station', isActive: false },
//             { label: 'Ukupni utrošak', to: '/kesp/predlozak#ukupni-utrosak', icon: 'rectangle-list', isActive: false },
//         ],
//     },
//     {
//         title: 'Opseg 2',
//         icon: 'list',
//         collapsed: false,
//         links: [
//             { label: 'Izračun GHG opseg 2', to: '/kesp/predlozak#izracun-ghg', icon: 'plug-circle-bolt', isActive: false },
//         ],
//     },
// ]);

// Toggle collapse state for each section
const toggleSection = (index) => {
    sections.value[index].collapsed = !sections.value[index].collapsed;
};

const initializeIdIzracuna = async () => {
    const cookieValue = await initializeCookie('kesp-id');
    if (cookieValue == '/' || cookieValue == undefined || cookieValue == 0 || cookieValue == null) {
        idIzracuna.value = '/';
    } else {
        idIzracuna.value = parseInt(cookieValue);
    }
    console.log("KESP-ID: ", idIzracuna.value);
}

// Asinhrona funkcija za postavljanje dekriptovanog username-a
// const initializeUsername = async () => {
//     const cookieValue = useCookie('username').value;
//     if (cookieValue) {
//         const decryptedValue = await decryptCookie(cookieValue);
//         username.value = decryptedValue.toLowerCase(); // Postavljanje dekriptovane vrednosti
//     }
// }

// async function initializeStoredData() {
//     if (import.meta.client) {
//         storedName.value = (await decryptCookie(localStorage.getItem('name'))) || '';
//         storedSurname.value = (await decryptCookie(localStorage.getItem('surname'))) || '';
//         storedEmail.value = localStorage.getItem('email')
//             ? await decryptCookie(localStorage.getItem('email'))
//             : null;
//     }
// }

function capitalizeName(fullName) {
    return fullName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

watch(() => izracunStore.idIzracuna, (newValue) => {
    console.log('idIzracuna updated:', newValue);
    idIzracuna.value = parseInt(newValue);
});

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

// const handleLinkClick = (sectionTitle, linkTo) => {
//     emit('updateActiveSection', sectionTitle); // Emitiramo događaj
//     const [path, hash] = linkTo.split('#');
//     router.push({ path, hash: `#${hash}` }).then(() => {
//         const element = document.getElementById(hash);
//         if (element) {
//             element.scrollIntoView({ behavior: 'smooth' });
//         }
//     });
// };

// Updated isActiveRoute function to consider both path and hash
// const isActiveRoute = (pathWithHash) => {
//     const [path, hash] = pathWithHash.split('#');
//     return route.path === path && route.hash === `#${hash}`;
// };

const isActiveRoute = (link) => {
    return link === `${router.currentRoute.value.path}`;
};

// Function to navigate to the desired section
// const scrollToHash = (hash) => {
//     const element = document.getElementById(hash);
//     if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//     }
// };

// // Watch for route changes to handle hash navigation
// router.afterEach((to) => {
//     if (to.hash) {
//         scrollToHash(to.hash.substring(1)); // Remove the '#' from the hash
//     }
// });

const cookiesToGet = ['kesp-id', 'username', 'name', 'surname', 'email'];

onMounted(async () => {
    try {
        const cookieData = await initializeCookie(cookiesToGet);
        idIzracuna.value = cookieData['kesp-id'] || null;
        username.value = cookieData['username'] || '';
        name.value = cookieData['name'] || '';
        surname.value = cookieData['surname'] || '';
        email.value = cookieData['email'] || null;
        console.log(idIzracuna.value, username.value, name.value, surname.value, email.value);
    } catch (error) {
        console.error("Error loading cookies: ", error);
    }
})

// Učitavanje sekcija i promjena # u URL-u
// onMounted(() => {
//     // Ako URL nema #, dodajemo #osobna
//     // if (!router.currentRoute.value.hash) {
//     //     router.push({ path: '/kesp/predlozak', hash: '#osobna' });
//     // }

//     // Uzimamo trenutni hash i označavamo odgovarajući link
//     const currentHash = router.currentRoute.value.hash;
//     highlightActiveLink(currentHash);
// });

// Funkcija za označavanje aktivnog nuxt-linka
// const highlightActiveLink = (hash) => {
//     sections.value.forEach(section => {
//         section.links.forEach(link => {
//             if (link.to === `/kesp/predlozak${hash}`) {
//                 link.isActive = true;
//             } else {
//                 link.isActive = false;
//             }
//         });
//     });
// };


// // Pratimo promjene hash-a
// watch(activeHash, (newHash) => {
//     console.log("promjena u hashu: ", newHash);
//     highlightActiveLink(newHash);
// });

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
    color: var(--kesp-primary);
}

.broj-izracuna {
    color: var(--text-color);
    font-weight: bold;
}

.list-icon {
    color: var(--kesp-primary);
    font-size: 16px;
}

h2 {
    color: var(--kesp-primary);
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
    background-color: var(--kesp-bg);
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
    background-color: var(--kesp-primary);
    color: white;
    cursor: default;
}

.inactive {
    background-color: var(--kesp-bg);
    color: var(--text-color);
}

.inactive:hover {
    background-color: var(--nuxtlink-hover);
}

.active * {
    color: white;
}

.inactive {
    background-color: var(--kesp-bg);
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
    background: var(--kesp-primary);
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