<template>
    <div class="body">
        <Toast />
        <main>
            <h1>{{ 'Opseg 3' }}</h1>
            <div class="main-contentt">
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
                    <div class="data-heading" style="margin-top: 23px;">
                        <h2>Neizravne emisije stakleničkih plinova</h2>
                        <p>Ostale emisije koje nastaju u vrijednosnom lancu organizacije te
                            su posljedica poslovne aktivnosti organizacije
                            ali proizlaze iz izvora koje organizacije ne posjeduje ili ne kontrolira.
                        </p>
                    </div>
                </section>
                <section class="accordion">
                    <Accordion id="accordion">
                        <AccordionPanel>
                            <AccordionHeader>
                                <div class="header-data-accordion">
                                    <font-awesome-icon icon="list-ul" />
                                    <span>Popis kategorija emisija</span>
                                </div>
                            </AccordionHeader>
                            <AccordionContent>
                                <Accordion multiple class="categories-accordion" :value="[]">
                                    <AccordionPanel v-for="category in nodes" :key="category.key" :value="category.key"
                                        class="acc-tab">
                                        <template #header>
                                            <span style="font-size: 16px;">{{ category.ukt_naziv }}</span>
                                        </template>
                                        <AccordionHeader
                                            :class="{ 'selected-category': selectedCategoryKeys.includes(category.key) }">
                                            {{ category.ukt_naziv }}
                                        </AccordionHeader>
                                        <AccordionContent
                                            :class="{ 'selected-category': selectedCategoryKeys.includes(category.key) }">
                                            <div class="category-header">
                                                <Checkbox v-model="selectedCategoryKeys"
                                                    :input-id="'checkbox-' + category.key" :value="category.key"
                                                    name="categories"
                                                    @update:model-value="toggleChildCategories(category, $event)" />
                                                <label :for="'checkbox-' + category.key">Relevantno</label>
                                            </div>
                                            <p class="category-description">{{ category.ukt_opis }}</p>
                                            <!-- Child kategorije -->
                                            <Accordion v-if="category.children && category.children.length > 0" multiple
                                                :value="[]" class="categories-accordion">
                                                <AccordionPanel v-for="child in category.children" :key="child.key"
                                                    :value="child.key"
                                                    :class="{ 'selected-category': selectedCategoryKeys.includes(child.key) }">
                                                    <template #header>
                                                        <span style="font-size: 16px;">{{ child.ukt_naziv }}</span>
                                                    </template>
                                                    <AccordionHeader>{{ child.ukt_naziv }}</AccordionHeader>
                                                    <AccordionContent :class="$style.acc_content">
                                                        <div class="category-header">
                                                            <Checkbox v-model="selectedCategoryKeys"
                                                                :input-id="'checkbox-' + child.key" :value="child.key"
                                                                name="categories" />
                                                            <label :for="'checkbox-' + child.key">Relevantno</label>
                                                        </div>
                                                        <p class="category-description">{{ child.ukt_opis }}</p>
                                                    </AccordionContent>
                                                </AccordionPanel>
                                            </Accordion>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </section>

                <section class="content-section">
                    <section class="sidebar">
                        <div class="sidebar-header">
                            <font-awesome-icon icon="list-ul" />
                            <span>Odabrane kategorije emisija</span>
                        </div>
                        <hr>
                        <div class="sidebar-content">
                            <div v-if="!filteredNodes.length">
                                <p>Nema odabranih kategorija.</p>
                            </div>
                            <Tree v-if="filteredNodes.length" v-model:selectionKeys="selectedKey" :value="filteredNodes"
                                selectionMode="single" class="tree">
                                <template #default="slotProps">
                                    <div v-tooltip.top="slotProps.node.ukt_naziv.length > 40 ? slotProps.node.ukt_naziv : ''"
                                        style="display: flex; align-items: center; gap: 10px;">
                                        <font-awesome-icon icon="bars-staggered" class="mr-2" />
                                        <span class="truncate-text">
                                            {{ slotProps.node.ukt_naziv }}
                                        </span>
                                    </div>
                                </template>
                            </Tree>

                        </div>
                    </section>

                    <section class="view">
                        <Tabs v-if="filteredNodes.length" v-model:value="activeTab" class="tab-view">
                            <TabList>
                                <Tab v-for="(tab, index) in tabs" :key="index" :value="index">
                                    {{ tab.title }}
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index">
                                    <li v-for="(item, indexs) in splitOpis(tab.content)" :key="indexs" class="tab-opis">
                                        {{ item }}
                                    </li>
                                </TabPanel>
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
import data from '../../../public/blobs/dummy_kategorije.json';

const kespStore = useKespStore();

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));

// Podaci za kategorije
const nodes = ref(null);
const selectedCategoryKeys = ref([]); // Odabrani ključevi

// Aktivni čvor (odabrana kategorija ili podkategorija)
const selectedKey = ref(null);
const checked = ref(false);

// Transformacija za prikaz stabla
const transformTree = (nodes, selectedKeys) => {
    const result = [];
    for (const node of nodes) {
        if (selectedKeys.includes(node.key)) {
            const transformedNode = { ...node };
            if (node.children) {
                transformedNode.children = transformTree(node.children, selectedKeys);
            }
            result.push(transformedNode);
        } else if (node.children) {
            const childNodes = transformTree(node.children, selectedKeys);
            if (childNodes.length) {
                result.push({ ...node, children: childNodes });
            }
        }
    }
    return result;
};

function toggleChildCategories(category, isChecked) {
    if (category.children && category.children.length > 0) {
        category.children.forEach(child => {
            if (isChecked) {
                if (!selectedCategoryKeys.value.includes(child.key)) {
                    selectedCategoryKeys.value.push(child.key);
                }
            } else {
                const index = selectedCategoryKeys.value.indexOf(child.key);
                if (index > -1) {
                    selectedCategoryKeys.value.splice(index, 1);
                }
            }
            toggleChildCategories(child, isChecked); // Rekurzivno ažuriraj child elemente
        });
    }
}

// Filtrirane kategorije za prikaz u stablu
const filteredNodes = computed(() =>
    nodes.value ? transformTree(nodes.value, selectedCategoryKeys.value) : []
);

watch(filteredNodes, () => {
    console.log('Filtered Nodes Updated:', filteredNodes.value);
});


// Pratite promjene u selectedCategoryKeys i ispisujte filteredNodes
watch(selectedCategoryKeys, () => {
    console.log("Filtered Nodes:", filteredNodes.value, "length:", filteredNodes.value.length);
    console.log("Selected category Keys:", selectedCategoryKeys.value, "length:", selectedCategoryKeys.value.length);
});

watch(selectedKey, (newKey) => {
    console.log("Selected Key: ", newKey);
    if (newKey) {
        // Pronalaženje odabranog čvora na osnovu ključa
        const findNode = (nodes, key) => {
            for (const node of nodes) {
                if (node.key === key) return node;
                if (node.children) {
                    const found = findNode(node.children, key);
                    if (found) return found;
                }
            }
            return null;
        };

        const selectedNode = findNode(nodes.value, newKey);

        if (selectedNode) {
            tabs.value = [
                { title: 'Opis kategorije', content: selectedNode.ukt_opis || 'Nema opisa kategorije' },
                { title: 'Podaci koji se prikupljaju', content: selectedNode.ukt_podaci || 'Nema podataka koji se prikupljaju' },
                { title: 'Način prikupljanja podataka', content: selectedNode.ukt_nacin || 'Nema načina prikupljanja podataka' },
                { title: 'Dinamika', content: selectedNode.ukt_dinamika || 'Nema dinamike' },
                { title: 'Minimalna granica', content: selectedNode.ukt_mingran || 'Nema minimalne granice' }
            ];
        } else {
            tabs.value = [];
        }
    } else {
        tabs.value = [];
    }
}, { deep: true });



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
    console.log("Selected Node: ", newNode)
    if (newNode) {
        tabs.value = [
            // { title: 'Opis kategorije', content: newNode.ukt_opis || 'Nema opisa kategorije' },
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


// Dohvaćanje podataka
onMounted(async () => {
    const response = await getO3categories();
    nodes.value = transformCategories(response);
    console.log("nodes: ", nodes.value);
});
</script>

<style module>
.acc_content {
    background: none !important;
}
</style>

<style scoped>
@layer reset {
    .p-accordioncontent-content {
        background: none !important;
    }
}

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

.main-contentt {
    display: flex;
    flex-direction: column;
    gap: 26px;
}

section.content-section {
    display: grid;
    grid-template-columns: 0.3fr 1fr;
    grid-template-rows: 1fr;
    border-radius: 8px;
    gap: 26px;
    /* padding: 26px; */
}

section {
    /* outline: auto; */
    height: 100%;
    max-width: 1100px;
}

section.accordion {
    height: auto;
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--border);
}

.header-data-accordion {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.header-data-accordion * {
    font-size: 16px;
    font-weight: 600;
    color: var(--kesp-primary);
}

.acc-tab {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.p-accordionheader {
    background: none !important;
    border-radius: 5px !important;
}

.p-accordioncontent-content * {
    background: none !important;
    background-color: none !important;
}

.p-accordioncontent {
    background: none !important;
}

.selected-category {
    background-color: #e6f9e6 !important;
    /* Lagana zelena boja */
}


.category-description {
    margin-top: 10px;
    font-size: 16px;
    max-width: 80%;
    text-align: justify;
}

.categories-accordion {
    padding: 13px;
}

.myacc {
    background-color: red;
}

.category-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.category-header label {
    font-size: 16px;
    /* font-weight: 500; */
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
.tab-opis,
ul {
    opacity: 0.8;
}

ul {
    list-style-position: inside;
    list-style-type: disc;
    margin: 0;
    padding: 0 0 0 20px;
}

ul ul {
    list-style-type: circle;
    margin: 0;
    padding: 0 0 0 30px;
    opacity: 1;
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

.truncate-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Maksimalno 2 linije */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Dodaje tri točkice kada pređe ograničenje */
    white-space: normal;
    /* Omogućava prelazak u više linija */
    max-height: 3em;
    /* Osigurava da se ograniči na dve linije */
    line-height: 1.5em;
    /* Visina linije za bolju čitljivost */
}

.tab-opis {
    font-size: 16px;
    text-align: justify;
}

li {
    max-width: 700px;
}
</style>