<template>
    <div class="body">
        <main>
            <h1>Rizik sažetak</h1>
            <Tabs value="0">
                <TabList>
                    <Tab class="reset-style" value="0">
                        <font-awesome-icon icon="border-all" class="tab-icon" />
                        Bez mjera prilagodbe
                    </Tab>
                    <Tab class="reset-style" value="1">
                        <font-awesome-icon icon="table-cells" class="tab-icon" />
                        S mjerama prilagodbe
                    </Tab>
                </TabList>
                <TabPanels class="tab-panel">
                    <TabPanel value="0" class="tab-panel">
                        <RizikSazetak v-if="vrstaIzracuna == 'Proces'" ref="rizikSazetakRef" :tip="'RZ'"
                            class="rizik-sazetak" />
                        <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'RZ'" />
                        <span v-else>
                            <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                            Nije odabrana vrsta izračuna
                        </span>
                    </TabPanel>
                    <TabPanel value="1" class="tab-panel">
                        <RizikSazetak v-if="vrstaIzracuna == 'Proces'" ref="rizikSazetakRef" :tip="'KR'"
                            class="rizik-sazetak" />
                        <TablicaRizika v-else-if="vrstaIzracuna == 'Imovina'" :tip="'KR'" />
                        <span v-else>
                            <font-awesome-icon icon="info-circle" style="margin-right: 5px;" />
                            Nije odabrana vrsta izračuna
                        </span>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <!-- <LegendaBoja class="legenda" /> -->
        </main>
        <footer>
            <nuxt-link to="/adaptacijske-mjere" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Adaptacijske mjere
            </nuxt-link>
            <div class="actionButtons">
                <span class="action-icon">
                    <font-awesome-icon icon="expand" size="lg" />
                </span>
                <span class="action-icon" @click="downloadRizikSazetak">
                    <font-awesome-icon icon="download" size="lg" />
                </span>
            </div>
            <nuxt-link to="/tablice-rizika" class="footer-link">
                <!-- Tablice rizika
                <font-awesome-icon icon="arrow-right-long" /> -->
            </nuxt-link>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TablicaRizika from '~/components/TablicaRizika.vue';

// Kreiramo referencu za pristup komponenti
const rizikSazetakRef = ref(null);
const vrstaIzracuna = ref(useCookie('vrsta_izracuna').value);
</script>

<style scoped>
.body {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}

main,
footer {
    width: 100%;
}

footer {
    margin-top: 26px;
}

.actionButtons {
    display: flex;
    align-items: center;
    gap: 16px;
}

.action-icon {
    color: gray;
}

.action-icon:hover {
    /* color: var(--primary-color); 
    cursor: pointer;*/
    color: gray;
}

.reset-style {
    all: revert;
}

.p-tablist-tab-list button {
    font-family: "DM Sans", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;

    width: auto !important;
    color: var(--text-color);
    padding: 10px 20px;

    outline: none;
    border: none;
    border-radius: 0px;

    background-color: var(--white);
    font-size: 16px;
    font-weight: normal;
    cursor: pointer;
}

.tab-panel {
    height: 100% !important;
}

.p-tab {
    opacity: 0.7;
    border: none;
}

.p-tab.p-tab-active {
    color: white;
    background-color: var(--primary-color);
    /* border-bottom: 3px solid var(--primary-color); */
    border-radius: 5px 5px 0px 0px;
    opacity: 1;
}

.tab-icon {
    margin-right: 5px;
}

h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 7px;
    border-bottom: 2px solid var(--text-color);
}

main {
    display: flex;
    flex-direction: column;
    gap: 34px;
}

.rizik-sazetak {
    width: 100%;
    height: 100%;
}

.legenda {
    padding: 0px 15px;
}
</style>