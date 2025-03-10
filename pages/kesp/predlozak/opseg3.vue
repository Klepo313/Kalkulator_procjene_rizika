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
                <section class="content-section">
                    <div class="filters">
                        <div class="filter">
                            <SelectButton v-model="filterCheckbox" :options="filterOptions" />
                        </div>
                    </div>
                    <section class="sidebar">
                        <div class="sidebar-header">
                            <font-awesome-icon icon="list-ul" />
                            <span>Popis kategorija emisija</span>
                        </div>
                        <hr>
                        <div class="sidebar-content">
                            <Tree v-model:selection-keys="selectedKey" :value="filteredNodes" selection-mode="single"
                                expanded-keys class="tree"> <!-- @node-select="showTabs($event.key)"-->
                                <template #default="slotProps">
                                    <div v-tooltip.top="slotProps.node.ukt_naziv"
                                        :class="{ 'tree-node-relevant': slotProps.node.relevant }"
                                        style="display: flex; align-items: center; gap: 10px;" class="tree-node">
                                        <font-awesome-icon
                                            :icon="slotProps.node.relevant ? 'circle-check' : 'bars-staggered'"
                                            :class="{ 'tree-node-relevant': slotProps.node.relevant }" class="mr-2" />
                                        <span ref="truncateTextRef" class="truncate-text">
                                            {{ slotProps.node.ukt_naziv }}
                                        </span>
                                    </div>

                                    <!-- <div v-tooltip.top="slotProps.node.ukt_naziv.length > 40 ? slotProps.node.ukt_naziv : ''"
                                        :class="{ 'tree-node-relevant': slotProps.node.relevant }"
                                        style="display: flex; align-items: center; gap: 10px;">
                                        <font-awesome-icon
                                            :icon="slotProps.node.relevant ? 'circle-check' : 'bars-staggered'"
                                            :class="{ 'tree-node-relevant': slotProps.node.relevant }" class="mr-2" />
                                        <span class="truncate-text">
                                            {{ slotProps.node.ukt_naziv }}
                                        </span>
                                    </div> -->
                                </template>
                            </Tree>
                        </div>
                    </section>

                    <section class="view">
                        <Tabs v-if="Object.keys(selectedKey).length > 0" v-model:value="activeTab" class="tab-view">
                            <TabList>
                                <Tab v-for="(tab, index) in tabs" :key="index" :value="index">
                                    {{ tab.title }}
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index" class="p-tabpanels">
                                    <div class="tab-panel">
                                        <div class="tab-paragraph">
                                            <!-- <div v-html="formatOpis(tab.content)" class="tab-opis"></div> -->
                                            <!-- <div v-html="advancedFormatOpis(tab.content)" class="tab-opis" /> -->
                                            <span class="tab-opis">
                                                {{ tab.content }}
                                            </span>
                                            <!-- {{ tab.content }} -->
                                        </div>
                                        <div v-if="tab.title === 'Opis kategorije'" class="relevant">
                                            <!--!tab.children.length && -->
                                            <Checkbox v-model="checked" :value="parseInt(tab.key)"
                                                :input-id="'checkbox-' + tab.key" @change="onRelevantChange(tab.key)" />
                                            <label :for="'checkbox-' + tab.key">Relevantno</label>
                                        </div>

                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                        <span v-else style="font-style: italic; font-size: 16px; opacity: 0.8; margin-top: 13px;">
                            <font-awesome-icon icon="info-circle" />
                            Nema odabrane kategorije
                        </span>
                    </section>
                </section>


            </div>
        </main>
    </div>
</template>

<script setup>
import { getO3categories, saveCategoryStatus } from '~/service/kesp/fetchOpseg3';

const toast = useToast()

const props = defineProps({
    sectionTitle: String,
    uiz_id: String,
});

const kespStore = useKespStore();

const kespId = ref(props.uiz_id);

const datumOd = computed(() => formatDateToDMY(kespStore.datumOd, '.'));
const datumDo = computed(() => formatDateToDMY(kespStore.datumDo, '.'));

const nodes = ref(null); // Podaci za kategorije
const tabs = ref([]); // Tabovi
const activeTab = ref(0); // Aktivni tab
const selectedKey = ref({}); // Aktivni čvor (odabrana kategorija ili podkategorija)
const checked = ref([]); // Mapa za praćenje označenih čvorova
const filterCheckbox = ref('Sve kategorije');
const filterOptions = ref(['Sve kategorije', 'Odabrane kategorije']);

// Funkcija za filtriranje čvorova
const filterNodes = (nodeList) => {
    if (filterCheckbox.value === 'Sve kategorije') {
        return nodeList;
    } else if (filterCheckbox.value === 'Odabrane kategorije') {
        return nodeList
            .filter(node => node.relevant)
            .map(node => ({
                ...node,
                children: node.children ? filterNodes(node.children) : [],
            }));
    }
};

// Filtrirani čvorovi za prikaz u stablu
const filteredNodes = computed(() => {
    return nodes.value ? filterNodes(nodes.value) : [];
});

// Funkcija za inicijalizaciju checked niza
const initializeIsChecked = () => {
    const collectCheckedKeys = (nodeList) => {
        nodeList.forEach(node => {
            if (node.relevant) {
                checked.value.push(node.key); // Dodaj ključ ako je relevant true
            }
            if (node.children && node.children.length > 0) {
                collectCheckedKeys(node.children); // Rekurzivno pregledaj decu
            }
        });
    };

    if (nodes.value) {
        collectCheckedKeys(nodes.value);
    }
};

watch(selectedKey, (newSelectedKey) => {
    // // console.log("old: ", selectedKey.value);
    const selectedNodeKey = Object.keys(newSelectedKey).find(key => newSelectedKey[key] === true);
    // console.log("Selected Node Key:", selectedNodeKey);
    // // console.log("Nodes:", nodes.value);

    if (selectedNodeKey && nodes.value) {
        const selectedNode = findNodeByKey(nodes.value, selectedNodeKey);
        // // console.log("Selected Node:", selectedNode);
        // console.log("Selected Node children:", selectedNode.children);

        if (selectedNode) {
            if (selectedNode.relevant) {
                tabs.value = [
                    { key: selectedNode.key, title: 'Opis kategorije', content: selectedNode.ukt_opis || 'Nema opisa kategorije', children: selectedNode.children },
                    { key: selectedNode.key, title: 'Podaci za prikupljanje', content: selectedNode.ukt_podaci || 'Nema podataka za prikupljanje', children: selectedNode.children },
                    { key: selectedNode.key, title: 'Način prikupljanja podataka', content: selectedNode.ukt_nacin || 'Nema načina prikupljanja podataka', children: selectedNode.children },
                    { key: selectedNode.key, title: 'Dinamika', content: selectedNode.ukt_dinamika || 'Nema dinamike', children: selectedNode.children },
                    { key: selectedNode.key, title: 'Minimalna granica', content: selectedNode.ukt_mingran || 'Nema minimalne granice', children: selectedNode.children }
                ];
            } else {
                tabs.value = [
                    { key: selectedNode.key, title: 'Opis kategorije', content: selectedNode.ukt_opis || 'Nema opisa kategorije', children: selectedNode.children },
                ];
            }
        } else {
            tabs.value = [];
        }
        activeTab.value = 0; // Ako je odabrana kategorija, postavi način prikupljanja podataka na prvi tab
    }
});

watch(filteredNodes, (newFilteredNodes) => {
    // console.log("Filtered Nodes:", newFilteredNodes);
});


function findNodeByKey(nodeList, key) {
    if (!Array.isArray(nodeList)) {
        // console.error("Invalid nodeList:", nodeList);
        return null;
    }

    for (const node of nodeList) {

        if (node.key == key) {
            return node;
        }
        if (node.children) {
            const foundNode = findNodeByKey(node.children, key);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
}

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Uspješno spremljeno', detail: 'Promjenjena relevantnost je spremljena', life: 3000 });
}

const showWarning = (message) => {
    toast.add({ severity: 'warn', summary: 'Greška pri spremanju', detail: message, life: 3000 });
}

const showError = (message) => {
    toast.add({ severity: 'error', summary: 'Greška', detail: message, life: 3000 });
}

const onRelevantChange = async (key) => {
    // console.log(`Checkbox for key ${key} changed`);

    // Pronađi čvor pomoću ključa
    const selectedNode = findNodeByKey(nodes.value, key);
    if (!selectedNode) {
        // console.error(`Node with key ${key} not found.`);
        return;
    }
    // console.log("Selected Node:", selectedNode);

    // Provjeravamo je li trenutni checkbox označen
    const isChecked = checked.value.includes(parseInt(key));
    // console.log("Checked? ", isChecked);

    // Pripremi podatke za API poziv
    const data = {
        calculationId: kespId.value,
        categoryId: selectedNode.key,
        selected: isChecked ? 'D' : 'N'
    };

    // API poziv za spremanje statusa
    try {
        const response = await saveCategoryStatus(data);
        if (response?.message) {
            // console.log(response.message);
            showWarning(response.message);
            return;
        } else {
            // console.log("Uspješno spremljeno!");
            showSuccess();
        }
    } catch (error) {
        // console.error("Greška prilikom spremanja:", error);
        showError('Došlo je do pogreške pri spremanju relevantnosti kategorije.');
        return;
    }

    // Ažuriranje stanja
    updateNodeState(selectedNode, isChecked);

    // Rekurzivno ažuriranje roditelja ili djece
    if (isChecked) {
        markParentNode(selectedNode);
    } else {
        unmarkParentNode(selectedNode);
    }

    // console.log('Updated tabs:', tabs.value);
};

const updateNodeState = (node, isChecked) => {
    node.relevant = isChecked;

    if (isChecked) {
        checked.value.push(parseInt(node.key));
        tabs.value = [
            { key: node.key, title: 'Opis kategorije', content: node.ukt_opis || 'Nema opisa kategorije', children: node.children },
            { key: node.key, title: 'Podaci za prikupljanje', content: node.ukt_podaci || 'Nema podataka za prikupljanje', children: node.children },
            { key: node.key, title: 'Način prikupljanja podataka', content: node.ukt_nacin || 'Nema načina prikupljanja podataka', children: node.children },
            { key: node.key, title: 'Dinamika', content: node.ukt_dinamika || 'Nema dinamike', children: node.children },
            { key: node.key, title: 'Minimalna granica', content: node.ukt_mingran || 'Nema minimalne granice', children: node.children }
        ];
    } else {
        checked.value = checked.value.filter(item => item !== parseInt(node.key));
        tabs.value = [
            { key: node.key, title: 'Opis kategorije', content: node.ukt_opis || 'Nema opisa kategorije', children: node.children }
        ];
    }
};

const markParentNode = (node) => {
    if (node.ukt_ukt_id) {
        const parentNode = findNodeByKey(nodes.value, node.ukt_ukt_id);
        if (parentNode && !parentNode.relevant) {
            // console.log(`Parent node with key ${parentNode.key} is not selected. Selecting it now.`);
            checked.value.push(parseInt(parentNode.key));
            onRelevantChange(parentNode.key); // Rekurzivno označavanje roditelja
        }
    }
};

const unmarkParentNode = (node) => {
    if (node.ukt_ukt_id) {
        const parentNode = findNodeByKey(nodes.value, node.ukt_ukt_id);
        if (parentNode) {
            const allChildrenUnchecked = parentNode.children.every(
                child => !checked.value.includes(parseInt(child.key))
            );
            if (allChildrenUnchecked) {
                // console.log(`All children of parent node with key ${parentNode.key} are unchecked. Unchecking parent.`);
                checked.value = checked.value.filter(item => item !== parseInt(parentNode.key));
                onRelevantChange(parentNode.key); // Rekurzivno odznačavanje roditelja
            }
        }
    }
};


const truncateTextRef = ref(null); // Referenca na tekstualni element

// Funkcija za provjeru preljeva i dodavanje `title` atributa
const addTooltipToOverflowingNodes = () => {
    const treeNodes = document.querySelectorAll('.tree-node');
    // console.log(treeNodes)
    treeNodes.forEach(node => {
        const truncateText = node.querySelector('.truncate-text');
        if (truncateText) {
            const { scrollWidth, clientWidth } = truncateText;
            if (scrollWidth > clientWidth) {
                node.setAttribute('title', truncateText.textContent.trim());
            } else {
                node.removeAttribute('title'); // Ukloni tooltip ako nema preljeva
            }
        }
    });
};


onMounted(async () => {
    // console.log("KESP ID: " + kespId.value)
    const response = await getO3categories(kespId.value);
    // nodes.value = response;
    nodes.value = transformCategories(response);
    initializeIsChecked();
    // console.log("nodes: ", nodes.value);
    // console.log("relevant: ", nodes.value.map(n => n.relevant));
    // console.log("checked: ", checked.value)
    // console.log("Filtered nodes: ", filteredNodes.value)

    await nextTick();
    addTooltipToOverflowingNodes();
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

:deep(.p-tree-node-selected) {
    background: #d5d5d5 !important;
    color: var(--text-color) !important;
    transition: none !important;
}

/* 
:deep(.p-togglebutton-checked::before *) {
    background-color: var(--kesp-primary) !important;
    color: white !important;
}

.p-togglebutton-checked * {
    color: white !important;
} */

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
    grid-template-columns: 300px 1fr;
    grid-template-rows: min-content 1fr;
    border-radius: 8px;
    gap: 26px;
    /* padding: 26px; */
}

section {
    /* outline: auto; */
    height: 100%;
    /* max-width: 1100px; */
}

section.accordion {
    height: auto;
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--border);
}

div.filters {
    grid-column: 1 / 3;
    max-width: 500px;

    display: flex;
    flex-direction: row;
    gap: 13px;
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
    border-radius: 5px;
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
    /* background-color: red; */
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
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 0px;
    margin: 0px;
    height: auto;
}

section.title>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

section.sidebar {
    width: 100%;
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
    max-width: 1100px;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    overflow: hidden;
    position: relative;
}

.relevant-node .p-tree-node-selectable {
    background-color: #c9f3c9 !important;
    /* Lagana zelena boja */
}

.tree-node-relevant {
    /* border-left: 5px solid #075a07; */
    /* padding-left: 5px; */
    /* width: 100%; */
    color: var(--primary-color);
    /* text-decoration: underline; */
    font-weight: bold;
    /* Lagana zelena boja */
}

:deep(.p-ink) {
    /* color: var(--primary-color) !important; */
    /* background-color: var(--primary-color) !important; */
}

:deep(.p-accordioncontent-content) {
    background: none !important;
}

:deep(.p-tab) {
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.p-tab-active) {
    /* color: var(--primary-color) !important; */
    background: none !important;
    border-radius: 5px 5px 0px 0px !important;
}

:deep(.p-tab:hover) {
    background-color: none !important;
}

:deep(.p-checkbox-input) {
    background-color: var(--kesp-primary) !important;
}

.p-tabs.p-component.tab-view {
    width: 100%;
    overflow: auto;
    background-color: none !important;
    border-radius: 5px !important;
}

.p-tabs.p-component.tab-view {
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
    padding: 0px !important;

}

.tab-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 13px;
}

.p-tabpanels * {
    font-size: 16px;
    text-align: justify;
}

.relevant {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tap-opis {
    display: flex;
    flex-direction: column;
    /* gap: 26px; */
}


hr {
    border: var(--border-line-sidebar);
    border-bottom: none;
}

p,
.tab-opis {
    opacity: 0.8;
}


ul {
    list-style-position: inside;
    list-style-type: disc;
    margin: 0;
    padding: 0 0 0 20px !important;
}

ul ul {
    list-style-type: circle;
    margin: 0;
    padding: 0 0 0 30px;
    opacity: 1;
}

br {
    margin-bottom: 13px;
}

.intern {
    padding-left: 30px !important;
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

.data-heading {
    max-width: 800px;
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
    white-space: pre-wrap;
    line-height: 1.5;
}

li {
    max-width: 700px;
}
</style>