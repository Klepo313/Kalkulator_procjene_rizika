<template>
    <div>
        <main>
            <h1>Rizik sažetak</h1>
            <div class="interactive">
                <div class="grid-table">
                    <div class="grid-item nb"></div>
                    <div class="grid-item nb-r nb-b">RCP 4.5</div>
                    <div class="grid-item nb-b">RCP 8.5</div>
                    <div class="grid-item nb"></div>
                    <div class="grid-item nb-r nb-b">RCP 4.5</div>
                    <div class="grid-item nb-b">RCP 8.5</div>
                    <div class="grid-item nb"></div>
                    <div class="grid-item nb-r nb-b">RCP 4.5</div>
                    <div class="grid-item nb-b">RCP 8.5</div>
                    <div class="grid-item nb"></div>
                    <div class="grid-item nb-r nb-b">RCP 4.5</div>
                    <div class="grid-item nb-b">RCP 8.5</div>

                    <div class="grid-item vertical green th" style="border-bottom: none;">Kronični</div>
                    <div class="grid-item vertical green th">Akutni</div>

                    <div class="grid-item green postojeci nb-r nb-b">Postojeći</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-r nb-b">P2</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-b">P2</div>

                    <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-r nb-b">P2</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-b">P2</div>

                    <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-r nb-b">P2</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-b">P2</div>

                    <div class="grid-item green postojeci nb-l nb-r nb-b">Postojeći</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-r nb-b">P2</div>
                    <div class="grid-item darkgreen nb-r nb-b">P0</div>
                    <div class="grid-item darkgreen nb-r nb-b">P1</div>
                    <div class="grid-item darkgreen nb-b">P2</div>

                    <div class="grid-item pink nb-l nb-b nb-r">Temperatura</div>
                    <div class="grid-item lightgreen db-l nb-b nb-r">Vjetar</div>
                    <div class="grid-item lightgray db-l nb-b nb-r">Voda</div>
                    <div class="grid-item gray db-l nb-b">Čvrsta masa</div>

                    <div class="grid-item vertical pink mh1">Promjene <br> temperature</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item nb-b">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgreen db-l">Promjene <br> tokova vjetra</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item nb-b">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgray mh2 db-l">Promjene u <br> obrascima i vrati <br>
                        oborina
                    </div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray mh2 db-l">Erozija obale</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical pink mh2 nb-l">Temperaturni <br> stres</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical mh2 nb-r nb-b db-l"></div>
                    <div class="grid-item table-header nb-b nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item" style="border-top: 1px solid #2a2a2a;"></div>

                    <div class="grid-item vertical lightgray mh2 db-l">Varijablilnost <br> oborina</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray mh2 db-l">Degradacija tla</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical pink mh2">Varijablilnost <br> temperature</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical mh2 nb-r nb-b nb-t db-l"></div>
                    <div class="grid-item table-header nb-b nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item"></div>

                    <div class="grid-item vertical lightgray mh2 db-l">Zakiseljavanje <br> oceana</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray mh2 db-l">Erozija tla</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical pink mh2">Otapanje vječnog <br> leda</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical mh2 nb-r nb-b nb-t db-l"></div>
                    <div class="grid-item table-header nb-b nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item"></div>

                    <div class="grid-item vertical lightgray mh2 db-l">Prodor slane <br> vode</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray mh2 db-l">Solifikacija</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical nb-r nb-b"></div>
                    <div class="grid-item table-header nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item sb-t"></div>

                    <div class="grid-item vertical mh2 nb-r nb-b nb-t"></div>
                    <div class="grid-item table-header nb-b nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item"></div>

                    <div class="grid-item vertical lightgray mh2 db-l">Podizanje razine <br> mora</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical nb-r nb-b db-l"></div>
                    <div class="grid-item table-header nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-header nb-t nb-l"></div>
                    <div class="grid-item table-item sb-t sb-r"></div>

                    <div class="grid-item vertical nb-r nb-b nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-item nb-t"></div>

                    <div class="grid-item vertical nb-r nb-b nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-item nb-t"></div>

                    <div class="grid-item vertical lightgray mh2 db-l">Nestašica vode</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical nb-r nb-b nb-t db-l"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-header nb-t nb-l nb-t"></div>
                    <div class="grid-item table-item nb-t sb-r"></div>

                    <div class="grid-item vertical pink">Toplinski val</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgreen db-l">Ciklon, uragan <br> tajfun</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgray db-l">Suša</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray db-l">Lavina</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical pink">Hladni val/mraz</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgreen db-l">Oluja</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgray db-l">Jake oborine</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray db-l">Odron tla</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical pink">Požar</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgreen db-l">Tornado</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical lightgray db-l">Poplave</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical gray db-l">Slijeganje tla</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header">procesi</div>
                    <div class="grid-item table-item sb-r">
                        <SazetakTable class="sazetak-table" />
                    </div>

                    <div class="grid-item vertical sb-b nb-r"></div>
                    <div class="grid-item table-header nb-l"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t sb-b"></div>
                    <div class="grid-item table-item sb-t sb-b"></div>

                    <div class="grid-item vertical sb-b nb-r"></div>
                    <div class="grid-item table-header nb-l"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t sb-b"></div>
                    <div class="grid-item table-item sb-t sb-b"></div>

                    <div class="grid-item vertical lightgray db-l sb-b">Izljev ledenjačkih <br> jezera</div>
                    <div class="grid-item table-header">imovina</div>
                    <div class="grid-item table-header">ulaz</div>
                    <div class="grid-item table-header">izlaz</div>
                    <div class="grid-item table-header sb-b">procesi</div>
                    <div class="grid-item table-item sb-b">
                        <SazetakTable class="sazetak-table " />
                    </div>

                    <div class="grid-item vertical sb-b nb-r db-l"></div>
                    <div class="grid-item table-header nb-l"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t"></div>
                    <div class="grid-item table-header nb-l nb-t sb-b"></div>
                    <div class="grid-item table-item sb-t sb-b sb-r"></div>

                </div>
            </div>
        </main>
        <!-- <Tabs value="0" class="interactive-tabs">
            <TabList class="reset-style">
                <Tab value="0">Rizik sažetak</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="interactive">
                        <int>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs> -->
        <footer>
            <nuxt-link to="/adaptacijske-mjere" class="footer-link">
                <font-awesome-icon icon="arrow-left-long" />
                Adaptacijske mjere
            </nuxt-link>
            <div class="actionButtons">
                <span class="action-icon">
                    <font-awesome-icon icon="expand" size="lg" />
                </span>
                <span class="action-icon">
                    <font-awesome-icon icon="print" size="lg" />
                </span>
            </div>
            <nuxt-link to="/tablice-rizika" class="footer-link">
                Tablice rizika
                <font-awesome-icon icon="arrow-right-long" />
            </nuxt-link>
        </footer>
    </div>
</template>

<script setup>
import SazetakTable from ".././components/SazetakTable"
</script>

<style scoped>
footer {
    margin-top: 26px;
}

.actionButtons {
    display: flex;
    align-items: center;
    gap: 16px;
}

.action-icon:hover {
    color: var(--primary-color);
    cursor: pointer;
}

.reset-style {
    all: revert;
}

.p-tablist-tab-list button {
    width: auto !important;
    color: var(--text-color);

    outline: none;
    border: none;
    border-radius: 0px;
    background-color: var(--white);
    font-size: 16px;
}

.p-tab {
    opacity: 0.7;
    border: none;
}

.p-tab.p-tab-active {
    color: var(--primary-color);
    opacity: 1;
    border-bottom: 3px solid var(--primary-color);
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

.grid-table {
    display: grid;
    grid-template-columns: repeat(37, 1fr);
    grid-template-rows: repeat(43, 1fr);
    margin: 0;
    padding: 0;
    background-color: white;
    color: #2a2a2a;
    /* border: 1px solid #2a2a2a; */
}

.grid-item {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #2a2a2a;
    font-size: 14px;

    text-wrap: wrap;
}

.vertical {
    writing-mode: sideways-lr;
    text-orientation: sideways;
    text-align: center;
    text-wrap: wrap;
    font-size: 14px;
    padding: 5px;

    border-right: none;
    border-left: none;
    border-bottom: none;
}

.table-item {
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    border: none;
}

.sazetak-table {
    width: 100%;
    height: 100%;
    border: none;
}

.table-header {
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    padding-left: 30px;
    padding-right: 5px;

    border-right: none;
    border-bottom: none;
}

.postojeci {
    /* font-weight: bold; */
    justify-content: flex-end;
    padding-right: 5px;
}

.th {
    /* font-weight: bold; */
    border-right: 1px dashed #2a2a2a;
    border-left: 1px solid #2a2a2a;
    border-bottom: 1px solid #2a2a2a;
}

.nb {
    border: none;
}

.nb-t {
    border-top: none;
}

.nb-b {
    border-bottom: none;
}

.nb-l {
    border-left: none;
}

.nb-r {
    border-right: none;
}


.db {
    border: #2a2a2a 1px dashed;
}

.db-r {
    border-right: #2a2a2a 1px dashed;
}

.db-l {
    border-left: #2a2a2a 1px dashed;
}

.db-t {
    border-top: #2a2a2a 1px dashed;
}

.db-b {
    border-bottom: #2a2a2a 1px dashed;
}

.sb {
    border: 1px solid #2a2a2a;
}

.sb-r {
    border-right: 1px solid #2a2a2a;
}

.sb-l {
    border-left: 1px solid #2a2a2a;
}

.sb-t {
    border-top: 1px solid #2a2a2a;
}

.sb-b {
    border-bottom: 1px solid #2a2a2a;
}


.pink {
    background-color: #FBE2D5;
}

.lightgreen {
    background-color: #FFFFE1;
}

.gray {
    background-color: #D9D9D9;
}

.lightgray {
    background-color: #F0FAFE;
}

.green {
    background-color: #DAF2D0;
}

.darkgreen {
    color: white;
    background-color: #3C7D22;
}

.nb-rd {
    border-right: none;
    border-bottom: none;
}

.nb-l {
    border-left: none;
}

.nb-r {
    border-right: none;
}

.nb-d {
    border-bottom: none;
}

.nb-rd:nth-child(2) {
    border-right: 1px solid #2a2a2a;
}

.grid-item:first-child {
    grid-column: 1 / 5;
}

.grid-item:nth-child(2) {
    grid-column: 5 / 8;
}

.grid-item:nth-child(3) {
    grid-column: 8 / 11;
}

.grid-item:nth-child(4) {
    grid-column: 11 / 14;
}

.grid-item:nth-child(5) {
    grid-column: 14 / 17;
}

.grid-item:nth-child(6) {
    grid-column: 17 / 20;
}

.grid-item:nth-child(7) {
    grid-column: 20 / 23;
}

.grid-item:nth-child(8) {
    grid-column: 23 / 26;
}

.grid-item:nth-child(9) {
    grid-column: 26 / 29;
}

.grid-item:nth-child(10) {
    grid-column: 29 / 32;
}

.grid-item:nth-child(11) {
    grid-column: 32 / 35;
}

.grid-item:nth-child(12) {
    grid-column: 35 / 38;
}

.grid-item:nth-child(13) {
    grid-column: 1;
    grid-row: 3 / 28;
}

.grid-item:nth-child(14) {
    grid-column: 1;
    grid-row: 28 / 44;
}

.grid-item:nth-child(15) {
    grid-column: 1 / 5;
}

.grid-item:nth-child(22) {
    grid-column: 11 / 14;
}

.grid-item:nth-child(29) {
    grid-column: 20 / 23;
}

.grid-item:nth-child(36) {
    grid-column: 29 / 32;
}



.grid-item:nth-child(43) {
    grid-column: 2 / 11;
}

.grid-item:nth-child(44) {
    grid-column: 11 / 20;
}

.grid-item:nth-child(45) {
    grid-column: 20 / 29;
}

.grid-item:nth-child(46) {
    grid-column: 29 / 38;
}

.grid-item:nth-child(47) {
    grid-row: 4 / 8;
}

.grid-item:nth-child(48) {
    grid-row: 4;
    grid-column: 3;
}

.grid-item:nth-child(49) {
    grid-row: 5;
    grid-column: 3;
}

.grid-item:nth-child(50) {
    grid-row: 6;
    grid-column: 3;
}

.grid-item:nth-child(51) {
    grid-row: 7;
    grid-column: 3;
}

.grid-item:nth-child(52) {
    grid-row-start: 4;
    grid-column-start: 4;
    grid-row-end: 8;
    grid-column-end: 11;
}

.grid-item:nth-child(53) {
    grid-column: 11;
    grid-row: 4 / 8;
}

.grid-item:nth-child(54) {
    grid-row: 4;
    grid-column: 12;
    padding-left: 5px;
}

.grid-item:nth-child(55) {
    grid-row: 5;
    grid-column: 12;
}

.grid-item:nth-child(56) {
    grid-row: 6;
    grid-column: 12;
}

.grid-item:nth-child(57) {
    grid-row: 7;
    grid-column: 12;
}

.grid-item:nth-child(58) {
    grid-row-start: 4;
    grid-column-start: 13;
    grid-row-end: 8;
    grid-column-end: 20;
}

.grid-item:nth-child(59) {
    grid-column: 20;
    grid-row: 4 / 8;
}

.grid-item:nth-child(60) {
    grid-row: 4;
    grid-column: 21;
}

.grid-item:nth-child(61) {
    grid-row: 5;
    grid-column: 21;
}

.grid-item:nth-child(62) {
    grid-row: 6;
    grid-column: 21;
}

.grid-item:nth-child(63) {
    grid-row: 7;
    grid-column: 21;
}

.grid-item:nth-child(64) {
    grid-row-start: 4;
    grid-column-start: 22;
    grid-row-end: 8;
    grid-column-end: 29;
}

.grid-item:nth-child(65) {
    grid-column: 29;
    grid-row: 4 / 8;
}

.grid-item:nth-child(66) {
    grid-row: 4;
    grid-column: 30;
}

.grid-item:nth-child(67) {
    grid-row: 5;
    grid-column: 30;
}

.grid-item:nth-child(68) {
    grid-row: 6;
    grid-column: 30;
}

.grid-item:nth-child(69) {
    grid-row: 7;
    grid-column: 30;
}

.grid-item:nth-child(70) {
    grid-row-start: 4;
    grid-column-start: 31;
    grid-row-end: 8;
    grid-column-end: 38;
}

.grid-item:nth-child(71) {
    grid-row: 8 / 12;
}

.grid-item:nth-child(72) {
    grid-row: 8;
    grid-column: 3;
}

.grid-item:nth-child(73) {
    grid-row: 9;
    grid-column: 3;
}

.grid-item:nth-child(74) {
    grid-row: 10;
    grid-column: 3;
}

.grid-item:nth-child(75) {
    grid-row: 11;
    grid-column: 3;
}

.grid-item:nth-child(76) {
    grid-row-start: 8;
    grid-column-start: 4;
    grid-row-end: 12;
    grid-column-end: 11;
}

.grid-item:nth-child(77) {
    grid-column: 11;
    grid-row: 8 / 12;
}

.grid-item:nth-child(78) {
    grid-row: 8;
    grid-column: 12;
}

.grid-item:nth-child(79) {
    grid-row: 9;
    grid-column: 12;
}

.grid-item:nth-child(80) {
    grid-row: 10;
    grid-column: 12;
}

.grid-item:nth-child(81) {
    grid-row: 11;
    grid-column: 12;
}

.grid-item:nth-child(82) {
    grid-row-start: 8;
    grid-column-start: 13;
    grid-row-end: 12;
    grid-column-end: 20;
}

.grid-item:nth-child(83) {
    grid-column: 20;
    grid-row: 8 / 12;
}

.grid-item:nth-child(84) {
    grid-row: 8;
    grid-column: 21;
}

.grid-item:nth-child(85) {
    grid-row: 9;
    grid-column: 21;
}

.grid-item:nth-child(86) {
    grid-row: 10;
    grid-column: 21;
}

.grid-item:nth-child(87) {
    grid-row: 11;
    grid-column: 21;
}

.grid-item:nth-child(88) {
    grid-row-start: 8;
    grid-column-start: 22;
    grid-row-end: 12;
    grid-column-end: 29;
}

.grid-item:nth-child(89) {
    grid-column: 29;
    grid-row: 8 / 12;
}

.grid-item:nth-child(90) {
    grid-row: 8;
    grid-column: 30;
}

.grid-item:nth-child(91) {
    grid-row: 9;
    grid-column: 30;
}

.grid-item:nth-child(92) {
    grid-row: 10;
    grid-column: 30;
}

.grid-item:nth-child(93) {
    grid-row: 11;
    grid-column: 30;
}

.grid-item:nth-child(94) {
    grid-row-start: 8;
    grid-column-start: 31;
    grid-row-end: 12;
    grid-column-end: 38;
}

.grid-item:nth-child(95) {
    grid-column: 2;
    grid-row: 12 / 16;
}

.grid-item:nth-child(96) {
    grid-row: 12;
    grid-column: 3;
}

.grid-item:nth-child(97) {
    grid-row: 13;
    grid-column: 3;
}

.grid-item:nth-child(98) {
    grid-row: 14;
    grid-column: 3;
}

.grid-item:nth-child(99) {
    grid-row: 15;
    grid-column: 3;
}

.grid-item:nth-child(100) {
    grid-row-start: 12;
    grid-column-start: 4;
    grid-row-end: 16;
    grid-column-end: 11;
}

.grid-item:nth-child(101) {
    grid-column: 11;
    grid-row: 12 / 16;
}

.grid-item:nth-child(102) {
    grid-row: 12;
    grid-column: 12;
}

.grid-item:nth-child(103) {
    grid-row: 13;
    grid-column: 12;
}

.grid-item:nth-child(104) {
    grid-row: 14;
    grid-column: 12;
}

.grid-item:nth-child(105) {
    grid-row: 15;
    grid-column: 12;
}

.grid-item:nth-child(106) {
    grid-row-start: 12;
    grid-column-start: 13;
    grid-row-end: 16;
    grid-column-end: 20;
}

.grid-item:nth-child(107) {
    grid-column: 20;
    grid-row: 12 / 16;
}

.grid-item:nth-child(108) {
    grid-row: 12;
    grid-column: 21;
}

.grid-item:nth-child(109) {
    grid-row: 13;
    grid-column: 21;
}

.grid-item:nth-child(110) {
    grid-row: 14;
    grid-column: 21;
}

.grid-item:nth-child(111) {
    grid-row: 15;
    grid-column: 21;
}

.grid-item:nth-child(112) {
    grid-row-start: 12;
    grid-column-start: 22;
    grid-row-end: 16;
    grid-column-end: 29;
}

.grid-item:nth-child(113) {
    grid-column: 29;
    grid-row: 12 / 16;
}

.grid-item:nth-child(114) {
    grid-row: 12;
    grid-column: 30;
}

.grid-item:nth-child(115) {
    grid-row: 13;
    grid-column: 30;
}

.grid-item:nth-child(116) {
    grid-row: 14;
    grid-column: 30;
}

.grid-item:nth-child(117) {
    grid-row: 15;
    grid-column: 30;
}

.grid-item:nth-child(118) {
    grid-row-start: 12;
    grid-column-start: 31;
    grid-row-end: 16;
    grid-column-end: 38;
}

.grid-item:nth-child(119) {
    grid-column: 2;
    grid-row: 16 / 20;
}

.grid-item:nth-child(120) {
    grid-row: 16;
    grid-column: 3;
}

.grid-item:nth-child(121) {
    grid-row: 17;
    grid-column: 3;
}

.grid-item:nth-child(122) {
    grid-row: 18;
    grid-column: 3;
}

.grid-item:nth-child(123) {
    grid-row: 19;
    grid-column: 3;
}

.grid-item:nth-child(124) {
    grid-row-start: 16;
    grid-column-start: 4;
    grid-row-end: 20;
    grid-column-end: 11;
}

.grid-item:nth-child(125) {
    grid-column: 11;
    grid-row: 16 / 20;
}

.grid-item:nth-child(126) {
    grid-row: 16;
    grid-column: 12;
}

.grid-item:nth-child(127) {
    grid-row: 17;
    grid-column: 12;
}

.grid-item:nth-child(128) {
    grid-row: 18;
    grid-column: 12;
}

.grid-item:nth-child(129) {
    grid-row: 19;
    grid-column: 12;
}

.grid-item:nth-child(130) {
    grid-row-start: 16;
    grid-column-start: 13;
    grid-row-end: 20;
    grid-column-end: 20;
}

.grid-item:nth-child(131) {
    grid-column: 20;
    grid-row: 16 / 20;
}

.grid-item:nth-child(132) {
    grid-row: 16;
    grid-column: 21;
}

.grid-item:nth-child(133) {
    grid-row: 17;
    grid-column: 21;
}

.grid-item:nth-child(134) {
    grid-row: 18;
    grid-column: 21;
}

.grid-item:nth-child(135) {
    grid-row: 19;
    grid-column: 21;
}

.grid-item:nth-child(136) {
    grid-row-start: 16;
    grid-column-start: 22;
    grid-row-end: 20;
    grid-column-end: 29;
}

.grid-item:nth-child(137) {
    grid-column: 29;
    grid-row: 16 / 20;
}

.grid-item:nth-child(138) {
    grid-row: 16;
    grid-column: 30;
}

.grid-item:nth-child(139) {
    grid-row: 17;
    grid-column: 30;
}

.grid-item:nth-child(140) {
    grid-row: 18;
    grid-column: 30;
}

.grid-item:nth-child(141) {
    grid-row: 19;
    grid-column: 30;
}

.grid-item:nth-child(142) {
    grid-row-start: 16;
    grid-column-start: 31;
    grid-row-end: 20;
    grid-column-end: 38;
}

.grid-item:nth-child(143) {
    grid-column: 2;
    grid-row: 20 / 24;
}

.grid-item:nth-child(144) {
    grid-row: 20;
    grid-column: 3;
}

.grid-item:nth-child(145) {
    grid-row: 21;
    grid-column: 3;
}

.grid-item:nth-child(146) {
    grid-row: 22;
    grid-column: 3;
}

.grid-item:nth-child(147) {
    grid-row: 23;
    grid-column: 3;
}

.grid-item:nth-child(148) {
    grid-row-start: 20;
    grid-column-start: 4;
    grid-row-end: 24;
    grid-column-end: 11;
}

.grid-item:nth-child(149) {
    grid-column: 11;
    grid-row: 20 / 24;
}

.grid-item:nth-child(150) {
    grid-row: 20;
    grid-column: 12;
}

.grid-item:nth-child(151) {
    grid-row: 21;
    grid-column: 12;
}

.grid-item:nth-child(152) {
    grid-row: 22;
    grid-column: 12;
}

.grid-item:nth-child(153) {
    grid-row: 23;
    grid-column: 12;
}

.grid-item:nth-child(154) {
    grid-row-start: 20;
    grid-column-start: 13;
    grid-row-end: 24;
    grid-column-end: 20;
}

.grid-item:nth-child(155) {
    grid-column: 20;
    grid-row: 20 / 24;
}

.grid-item:nth-child(156) {
    grid-row: 20;
    grid-column: 21;
}

.grid-item:nth-child(157) {
    grid-row: 21;
    grid-column: 21;
}

.grid-item:nth-child(158) {
    grid-row: 22;
    grid-column: 21;
}

.grid-item:nth-child(159) {
    grid-row: 23;
    grid-column: 21;
}

.grid-item:nth-child(160) {
    grid-row-start: 20;
    grid-column-start: 22;
    grid-row-end: 24;
    grid-column-end: 29;
}

.grid-item:nth-child(161) {
    grid-column: 29;
    grid-row: 20 / 24;
}

.grid-item:nth-child(162) {
    grid-row: 20;
    grid-column: 30;
}

.grid-item:nth-child(163) {
    grid-row: 21;
    grid-column: 30;
}

.grid-item:nth-child(164) {
    grid-row: 22;
    grid-column: 30;
}

.grid-item:nth-child(165) {
    grid-row: 23;
    grid-column: 30;
}

.grid-item:nth-child(166) {
    grid-row-start: 20;
    grid-column-start: 31;
    grid-row-end: 24;
    grid-column-end: 38;
}

.grid-item:nth-child(167) {
    grid-column: 2;
    grid-row: 24 / 28;
}

.grid-item:nth-child(168) {
    grid-row: 24;
    grid-column: 3;
}

.grid-item:nth-child(169) {
    grid-row: 25;
    grid-column: 3;
}

.grid-item:nth-child(170) {
    grid-row: 26;
    grid-column: 3;
}

.grid-item:nth-child(171) {
    grid-row: 27;
    grid-column: 3;
}

.grid-item:nth-child(172) {
    grid-row-start: 24;
    grid-column-start: 4;
    grid-row-end: 28;
    grid-column-end: 11;
}

.grid-item:nth-child(173) {
    grid-column: 11;
    grid-row: 24 / 28;
}

.grid-item:nth-child(174) {
    grid-row: 24;
    grid-column: 12;
}

.grid-item:nth-child(175) {
    grid-row: 25;
    grid-column: 12;
}

.grid-item:nth-child(176) {
    grid-row: 26;
    grid-column: 12;
}

.grid-item:nth-child(177) {
    grid-row: 27;
    grid-column: 12;
}

.grid-item:nth-child(178) {
    grid-row-start: 24;
    grid-column-start: 13;
    grid-row-end: 28;
    grid-column-end: 20;
}

.grid-item:nth-child(179) {
    grid-column: 20;
    grid-row: 24 / 28;
}

.grid-item:nth-child(180) {
    grid-row: 24;
    grid-column: 21;
}

.grid-item:nth-child(181) {
    grid-row: 25;
    grid-column: 21;
}

.grid-item:nth-child(182) {
    grid-row: 26;
    grid-column: 21;
}

.grid-item:nth-child(183) {
    grid-row: 27;
    grid-column: 21;
}

.grid-item:nth-child(184) {
    grid-row-start: 24;
    grid-column-start: 22;
    grid-row-end: 28;
    grid-column-end: 29;
}

.grid-item:nth-child(185) {
    grid-column: 29;
    grid-row: 24 / 28;
}

.grid-item:nth-child(186) {
    grid-row: 24;
    grid-column: 30;
}

.grid-item:nth-child(187) {
    grid-row: 25;
    grid-column: 30;
}

.grid-item:nth-child(188) {
    grid-row: 26;
    grid-column: 30;
}

.grid-item:nth-child(189) {
    grid-row: 27;
    grid-column: 30;
}

.grid-item:nth-child(190) {
    grid-row-start: 24;
    grid-column-start: 31;
    grid-row-end: 28;
    grid-column-end: 38;
}

.grid-item:nth-child(191) {
    grid-column: 2;
    grid-row: 28 / 32;
}

.grid-item:nth-child(192) {
    grid-row: 28;
    grid-column: 3;
}

.grid-item:nth-child(193) {
    grid-row: 29;
    grid-column: 3;
}

.grid-item:nth-child(194) {
    grid-row: 30;
    grid-column: 3;
}

.grid-item:nth-child(195) {
    grid-row: 31;
    grid-column: 3;
}

.grid-item:nth-child(196) {
    grid-row-start: 28;
    grid-column-start: 4;
    grid-row-end: 32;
    grid-column-end: 11;
}

.grid-item:nth-child(197) {
    grid-column: 11;
    grid-row: 28 / 32;
}

.grid-item:nth-child(198) {
    grid-row: 28;
    grid-column: 12;
}

.grid-item:nth-child(199) {
    grid-row: 29;
    grid-column: 12;
}

.grid-item:nth-child(200) {
    grid-row: 30;
    grid-column: 12;
}

.grid-item:nth-child(201) {
    grid-row: 31;
    grid-column: 12;
}

.grid-item:nth-child(202) {
    grid-row-start: 28;
    grid-column-start: 13;
    grid-row-end: 32;
    grid-column-end: 20;
}

.grid-item:nth-child(203) {
    grid-column: 20;
    grid-row: 28 / 32;
}

.grid-item:nth-child(204) {
    grid-row: 28;
    grid-column: 21;
}

.grid-item:nth-child(205) {
    grid-row: 29;
    grid-column: 21;
}

.grid-item:nth-child(206) {
    grid-row: 30;
    grid-column: 21;
}

.grid-item:nth-child(207) {
    grid-row: 31;
    grid-column: 21;
}

.grid-item:nth-child(208) {
    grid-row-start: 28;
    grid-column-start: 22;
    grid-row-end: 32;
    grid-column-end: 29;
}

.grid-item:nth-child(209) {
    grid-column: 29;
    grid-row: 28 / 32;
}

.grid-item:nth-child(210) {
    grid-row: 28;
    grid-column: 30;
}

.grid-item:nth-child(211) {
    grid-row: 29;
    grid-column: 30;
}

.grid-item:nth-child(212) {
    grid-row: 30;
    grid-column: 30;
}

.grid-item:nth-child(213) {
    grid-row: 31;
    grid-column: 30;
}

.grid-item:nth-child(214) {
    grid-row-start: 28;
    grid-column-start: 31;
    grid-row-end: 32;
    grid-column-end: 38;
}

.grid-item:nth-child(215) {
    grid-column: 2;
    grid-row: 32 / 36;
}

.grid-item:nth-child(216) {
    grid-row: 32;
    grid-column: 3;
}

.grid-item:nth-child(217) {
    grid-row: 33;
    grid-column: 3;
}

.grid-item:nth-child(218) {
    grid-row: 34;
    grid-column: 3;
}

.grid-item:nth-child(219) {
    grid-row: 35;
    grid-column: 3;
}

.grid-item:nth-child(220) {
    grid-row-start: 32;
    grid-column-start: 4;
    grid-row-end: 36;
    grid-column-end: 11;
}

.grid-item:nth-child(221) {
    grid-column: 11;
    grid-row: 32 / 36;
}

.grid-item:nth-child(222) {
    grid-row: 32;
    grid-column: 12;
}

.grid-item:nth-child(223) {
    grid-row: 33;
    grid-column: 12;
}

.grid-item:nth-child(224) {
    grid-row: 34;
    grid-column: 12;
}

.grid-item:nth-child(225) {
    grid-row: 35;
    grid-column: 12;
}

.grid-item:nth-child(226) {
    grid-row-start: 32;
    grid-column-start: 13;
    grid-row-end: 36;
    grid-column-end: 20;
}

.grid-item:nth-child(227) {
    grid-column: 20;
    grid-row: 32 / 36;
}

.grid-item:nth-child(228) {
    grid-row: 32;
    grid-column: 21;
}

.grid-item:nth-child(229) {
    grid-row: 33;
    grid-column: 21;
}

.grid-item:nth-child(230) {
    grid-row: 34;
    grid-column: 21;
}

.grid-item:nth-child(231) {
    grid-row: 35;
    grid-column: 21;
}

.grid-item:nth-child(232) {
    grid-row-start: 32;
    grid-column-start: 22;
    grid-row-end: 36;
    grid-column-end: 29;
}

.grid-item:nth-child(233) {
    grid-column: 29;
    grid-row: 32 / 36;
}

.grid-item:nth-child(234) {
    grid-row: 32;
    grid-column: 30;
}

.grid-item:nth-child(235) {
    grid-row: 33;
    grid-column: 30;
}

.grid-item:nth-child(236) {
    grid-row: 34;
    grid-column: 30;
}

.grid-item:nth-child(237) {
    grid-row: 35;
    grid-column: 30;
}

.grid-item:nth-child(238) {
    grid-row-start: 32;
    grid-column-start: 31;
    grid-row-end: 36;
    grid-column-end: 38;
}

.grid-item:nth-child(239) {
    grid-column: 2;
    grid-row: 36 / 40;
}

.grid-item:nth-child(240) {
    grid-row: 36;
    grid-column: 3;
}

.grid-item:nth-child(241) {
    grid-row: 37;
    grid-column: 3;
}

.grid-item:nth-child(242) {
    grid-row: 38;
    grid-column: 3;
}

.grid-item:nth-child(243) {
    grid-row: 39;
    grid-column: 3;
}

.grid-item:nth-child(244) {
    grid-row-start: 36;
    grid-column-start: 4;
    grid-row-end: 40;
    grid-column-end: 11;
}

.grid-item:nth-child(245) {
    grid-column: 11;
    grid-row: 36 / 40;
}

.grid-item:nth-child(246) {
    grid-row: 36;
    grid-column: 12;
}

.grid-item:nth-child(247) {
    grid-row: 37;
    grid-column: 12;
}

.grid-item:nth-child(248) {
    grid-row: 38;
    grid-column: 12;
}

.grid-item:nth-child(249) {
    grid-row: 39;
    grid-column: 12;
}

.grid-item:nth-child(250) {
    grid-row-start: 36;
    grid-column-start: 13;
    grid-row-end: 40;
    grid-column-end: 20;
}

.grid-item:nth-child(251) {
    grid-column: 20;
    grid-row: 36 / 40;
}

.grid-item:nth-child(252) {
    grid-row: 36;
    grid-column: 21;
}

.grid-item:nth-child(253) {
    grid-row: 37;
    grid-column: 21;
}

.grid-item:nth-child(254) {
    grid-row: 38;
    grid-column: 21;
}

.grid-item:nth-child(255) {
    grid-row: 39;
    grid-column: 21;
}

.grid-item:nth-child(256) {
    grid-row-start: 36;
    grid-column-start: 22;
    grid-row-end: 40;
    grid-column-end: 29;
}

.grid-item:nth-child(257) {
    grid-column: 29;
    grid-row: 36 / 40;
}

.grid-item:nth-child(258) {
    grid-row: 36;
    grid-column: 30;
}

.grid-item:nth-child(259) {
    grid-row: 37;
    grid-column: 30;
}

.grid-item:nth-child(260) {
    grid-row: 38;
    grid-column: 30;
}

.grid-item:nth-child(261) {
    grid-row: 39;
    grid-column: 30;
}

.grid-item:nth-child(262) {
    grid-row-start: 36;
    grid-column-start: 31;
    grid-row-end: 40;
    grid-column-end: 38;
}

.grid-item:nth-child(263) {
    grid-column: 2;
    grid-row: 40 / 44;
}

.grid-item:nth-child(264) {
    grid-row: 40;
    grid-column: 3;
}

.grid-item:nth-child(265) {
    grid-row: 41;
    grid-column: 3;
}

.grid-item:nth-child(266) {
    grid-row: 42;
    grid-column: 3;
}

.grid-item:nth-child(267) {
    grid-row: 43;
    grid-column: 3;
}

.grid-item:nth-child(268) {
    grid-row-start: 40;
    grid-column-start: 4;
    grid-row-end: 44;
    grid-column-end: 11;
}

.grid-item:nth-child(269) {
    grid-column: 11;
    grid-row: 40 / 44;
}

.grid-item:nth-child(270) {
    grid-row: 40;
    grid-column: 12;
}

.grid-item:nth-child(271) {
    grid-row: 41;
    grid-column: 12;
}

.grid-item:nth-child(272) {
    grid-row: 42;
    grid-column: 12;
}

.grid-item:nth-child(273) {
    grid-row: 43;
    grid-column: 12;
}

.grid-item:nth-child(274) {
    grid-row-start: 40;
    grid-column-start: 13;
    grid-row-end: 44;
    grid-column-end: 20;
}

.grid-item:nth-child(275) {
    grid-column: 20;
    grid-row: 40 / 44;
}

.grid-item:nth-child(276) {
    grid-row: 40;
    grid-column: 21;
}

.grid-item:nth-child(277) {
    grid-row: 41;
    grid-column: 21;
}

.grid-item:nth-child(278) {
    grid-row: 42;
    grid-column: 21;
}

.grid-item:nth-child(279) {
    grid-row: 43;
    grid-column: 21;
}

.grid-item:nth-child(280) {
    grid-row-start: 40;
    grid-column-start: 22;
    grid-row-end: 44;
    grid-column-end: 29;
}

.grid-item:nth-child(281) {
    grid-column: 29;
    grid-row: 40 / 44;
}

.grid-item:nth-child(282) {
    grid-row: 40;
    grid-column: 30;
}

.grid-item:nth-child(283) {
    grid-row: 41;
    grid-column: 30;
}

.grid-item:nth-child(284) {
    grid-row: 42;
    grid-column: 30;
}

.grid-item:nth-child(285) {
    grid-row: 43;
    grid-column: 30;
}

.grid-item:nth-child(286) {
    grid-row-start: 40;
    grid-column-start: 31;
    grid-row-end: 44;
    grid-column-end: 38;
}
</style>