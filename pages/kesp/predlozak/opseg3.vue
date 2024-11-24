<template>
    <div class="body">
        <Toast />
        <main>
            <h1>{{ 'Opseg 3' }}</h1>
            <div class="main-content">
                <section class="title">
                    <div>
                        <h2>Vremensko razdoblje izračuna</h2>
                        <p>Vremensko razdoblje za kojeg se unose podaci</p>
                    </div>
                    <div class="razdoblje">
                        <div>
                            <div>
                                <label for="startDate">
                                    Početak razdoblja:
                                </label>
                                <DatePicker id="startDate" v-model="datumOd" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Početni datum" readonly />
                            </div>
                            <div>
                                <label for="endDate">
                                    Kraj razdoblja:
                                </label>
                                <DatePicker id="endDate" v-model="datumDo" date-format="dd.mm.yy" show-icon fluid
                                    icon-display="input" placeholder="Krajnji datum" readonly />
                            </div>
                        </div>
                    </div>
                </section>
                <section class="content-section">
                    <section class="sidebar">
                        <div class="sidebar-header">
                            <font-awesome-icon icon="list-ul" />
                            <span>Popis</span>
                        </div>
                        <hr>
                        <div class="sidebar-content">
                            <div v-if="!nodes">
                                <font-awesome-icon icon="spinner" spin />
                                Učitavanje podataka
                            </div>
                            <Tree v-else v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="single"
                                :metaKeySelection="checked" class="tree">
                                <template #default="slotProps">
                                    <div style="display: flex; align-items: center; gap: 10px;"
                                        v-tooltip.top="slotProps.node.ukt_naziv.length > 40 ? slotProps.node.ukt_naziv : ''">
                                        <font-awesome-icon icon="bars-staggered" class="mr-2" />
                                        <span>
                                            {{ truncateText(slotProps.node.ukt_naziv, 40) }}
                                        </span>
                                    </div>
                                </template>
                            </Tree>

                        </div>
                    </section>
                    <section class="view">
                        <Tabs v-if="selectedNode" v-model:value="activeTab" class="tab-view">
                            <TabList>
                                <Tab v-for="(tab, index) in tabs" :key="index" :value="index">
                                    {{ tab.title }}
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index">
                                    <!-- <p class="tab-opis">{{ tab.content }}</p> -->
                                    <li class="tab-opis" v-for="(item, indexs) in splitOpis(tab.content)" :key="indexs">
                                        {{ item }}
                                    </li>
                                </TabPanel>
                                <ul>
                                    <!-- Razdvoji string na list iteme i prikazi ih -->

                                </ul>
                            </TabPanels>
                        </Tabs>
                        <Tabs v-else class="tab-view">
                            <TabList>
                                <Tab>
                                    {{ 'Prazno' }}
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <p class="tab-opis">{{ 'Nema odabrane kategorije' }}</p>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                    </section>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup>
import { getO3categories } from '~/service/kesp/fetchOpseg3';
import data from '../../../public/blobs/dummy_kategorije.json'

const kespStore = useKespStore();

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));

const nodes = ref(null);

onMounted(async () => {
    const response = await getO3categories();
    nodes.value = transformCategories(response);
})

const selectedKey = ref(null);
const checked = ref(false);

const tabs = ref([]); // Dinamički podaci za tabove
const activeTab = ref(0); // Praćenje aktivnog taba

// Funkcija za pronalaženje odabrane stavke
const selectedNode = computed(() => {
    // Dohvati ključ iz selectedKey (prvi ključ jer je selectionMode "single")
    if (!selectedKey.value) return null;

    const selected = Object.keys(selectedKey.value)[0];
    if (!selected) return null; // Ako nema odabranih ključeva, vrati null

    function findNodeByKey(key, nodeList) {
        for (const node of nodeList) {
            if (node.key === parseInt(key)) return node; // Provjeri čvor
            if (node.children) {
                const found = findNodeByKey(key, node.children);
                if (found) return found; // Rekurzivno pretraživanje
            }
        }
        return null;
    }

    console.log("Selected Node: ", findNodeByKey(selected, nodes.value));
    return findNodeByKey(selected, nodes.value);
});


// Ažuriranje tabova kada se promijeni odabrana stavka
watch(selectedNode, (newNode) => {
    if (newNode) {
        tabs.value = [
            { title: 'Opis kategorije', content: newNode.ukt_opis || 'Nema opisa kategorije' },
            { title: 'Podaci koji se prikupljaju', content: newNode.ukt_podaci || 'Nema podataka koji se prikupljaju' },
            { title: 'Način prikupljanja podataka', content: newNode.ukt_nacin || 'Nema načina prikupljanja podataka' },
            { title: 'Dinamika', content: newNode.ukt_dinamika || 'Nema dinamike' },
            { title: 'Minimalna granica', content: newNode.ukt_mingran || 'Nema minimalne granice' }
        ];
        activeTab.value = 0;
    } else {
        tabs.value = [];
    }
});

</script>

<style scoped>
.body {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 26px;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
    grid-column: span 2;
}

h2 {
    font-size: 16px;
    color: var(--kesp-primary);
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
    height: 100%;
}


main>div {
    width: 100%;
    height: 100%;
}

.main-content,
section.content-section {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    gap: 26px;
}

section.content-section {
    grid-template-columns: 0.3fr 1fr;
    grid-template-rows: 1fr;
    border-radius: 8px;
    /* padding: 26px; */
}

section {
    /* outline: auto; */
    height: 100%;
}

section.title {
    grid-column: 1/3;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

section.title>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

section.sidebar {
    min-width: 200px;
    /* max-width: 300px; */
    border-radius: 5px;
    padding: 13px;
    background-color: #F6F6F6;
    display: flex;
    flex-direction: column;
    gap: 13px;
}

section.sidebar>.sidebar-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

section.sidebar>.sidebar-header * {
    font-size: 16px;
    font-weight: 500;
}

section.sidebar>.sidebar-content {
    height: 100%;
}

section.view {
    /* outline: auto; */
    border-radius: 5px;
}

.p-tabs.p-component.tab-view {
    background-color: none !important;
    border-radius: 5px !important;
}

.p-tabs.p-component.tab-view * {
    background: none;
}

.p-tabs.p-component.tab-view button {
    border-radius: 0px;
}

section.view>.tab-view {
    height: 100%;
    background-color: none !important;
}

.p-tabpanels {
    height: 100% !important;
}

hr {
    border: var(--border-line-sidebar);
    border-bottom: none;
}

p,
.tab-opis {
    opacity: 0.8;
}

sub,
sup {
    font-size: smaller;
}

.razdoblje {
    max-width: 500px;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.razdoblje>div,
.razdoblje>div>div,
.razdoblje>span {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.razdoblje>div {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.tree {
    /* background-color: #e6e6e6; */
    background-color: transparent;
    border-radius: 5px;
    padding: 0px;
}

.tab-opis {
    font-size: 16px;
    text-align: justify;
}

li {
    max-width: 700px;
}
</style>