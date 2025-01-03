<template>
    <div class="body">
        <Toast />
        <main>
            <h1>Dodavanje korisnika</h1>
            <div class="main-content">
                <section>
                    <div>
                        <h2>Popis korisnika</h2>
                        <p>
                            Popis korisnika koji su zabilježeni u sustavu. <br>
                            Tko je partner, a tko korisnik? <u style="font-style: italic; cursor: pointer;">Pročitaj
                                ovdje</u>.
                        </p>
                    </div>
                    <div class="datatable">
                        <DataTable v-model:filters="filters" v-model:expanded-row-groups="expandedGroups"
                            :value="korisnici" row-group-mode="subheader" expandable-row-groups group-rows-by="tvrtka"
                            scrollable scroll-height="800px" :rows="10" :sort-order="1" filter-display="row"
                            :loading="loading" removable-sort table-style="min-width: 50rem"
                            :global-filter-fields="['tvrtka', 'tvrtka_usluge', 'ime', 'prezime']">

                            <!--v-model:expandedRowGroups="rowGroups" row-group-mode="rowspan"-->
                            <template #header>
                                <div class="flex justify-end">
                                    <IconField>
                                        <InputIcon>
                                            <font-awesome-icon icon="search" />
                                        </InputIcon>
                                        <InputText v-model="filters['global'].value"
                                            placeholder="Pretraži korisnike, tvrtke, ..." />
                                    </IconField>
                                </div>
                            </template>
                            <template #empty> Nema korisnika. </template>
                            <template #loading> Učitavanje korisnika. Molimo pričekajte. </template>

                            <template #rowgrouptogglericon>
                                <span>
                                    <font-awesome-icon icon="chevron-down" />
                                </span>
                            </template>
                            <template #groupheader="slotProps">
                                <font-awesome-icon icon="building" size="lg" />
                                <span style="margin-left: 8px;">{{ slotProps.data.tvrtka }}</span>
                            </template>
                            <template #groupfooter="slotProps">
                                <div class="total-emissions">Ukupno: <strong>{{
                                    calculateCustomerTotal(slotProps.data.tvrtka) }}</strong> </div>
                            </template>

                            <Column header="#" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="tvrtka" header="Tvrtka" />
                            <!-- <Column field="tvrtka" header="Tvrtka" style="min-width:6rem">
                                <template #body="{ data }">
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <font-awesome-icon icon="building" size="lg" />
                                        {{ data.tvrtka }}
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="Pretraži po tvrtki"
                                        @input="filterCallback()" />
                                </template>
                            </Column> -->
                            <Column header="Ime" filter-field="ime" style="min-width: 14rem">
                                <template #body="{ data }">
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <font-awesome-icon icon="user-circle" size="lg" />
                                        <span>{{ data.ime }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="Pretraži po imenu"
                                        @input="filterCallback()" />
                                </template>
                            </Column>
                            <Column header="Prezime" filter-field="prezime" style="min-width: 14rem">
                                <template #body="{ data }">
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <font-awesome-icon icon="user-circle" size="lg" />
                                        <span>{{ data.prezime }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText v-model="filterModel.value" type="text"
                                        placeholder="Pretraži po prezimenu" @input="filterCallback()" />
                                </template>
                            </Column>

                            <Column header="Tvrtka usluge" filter-field="tvrtka_usluge" :show-filter-menu="false"
                                style="min-width: 14rem">
                                <template #body="{ data }">
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <font-awesome-icon icon="building-circle-arrow-right" size="lg" />
                                        <span>{{ data.tvrtka_usluge }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText v-model="filterModel.value" type="text"
                                        placeholder="Pretraži po tvrtkama usluge" @input="filterCallback()" />
                                </template>
                            </Column>
                            <Column field="status" header="Status" :show-filter-menu="false" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <Select v-model="filterModel.value" :options="statuses" placeholder="Odaberi status"
                                        style="min-width: 12rem" :show-clear="true" @change="filterCallback()">
                                        <template #option="slotProps">
                                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                                        </template>
                                    </Select>
                                </template>
                            </Column>
                            <Column>
                                <template #body="{ data }">
                                    <Button type="button" icon="pi pi-user-edit"
                                        style="background-color: var(--text-color); border: none;" rounded
                                        @click="editKorisnik(data)" />
                                </template>
                            </Column>
                            <template #footer>
                                <div class="total-emissions">
                                    Ukupno korisnika: <strong>{{ korisnici.length }}</strong>
                                </div>
                            </template>
                        </DataTable>

                        <Dialog v-model:visible="editKorisnikDialog" header="Uredi korisnika" :modal="true"
                            :style="{ width: '1000px' }" @hide="resetOdabraniKorisnik">
                            <template #header>
                                <div class="dialog-header">
                                    <!-- <font-awesome-icon icon="user-pen" /> -->
                                    <span>Uredi korisnika</span>
                                </div>
                            </template>
                            <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="p-fluid"
                                @submit.prevent="saveKorisnik">
                                <div class="left-form">
                                    <div class="section">
                                        <div class="field-heading">
                                            <h2 class="p-text-bold">Podaci o korisniku</h2>
                                            <p>Izmjeni podatake o korisniku</p>
                                        </div>
                                        <div class="field field-split">
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="user" />
                                                    <label for="ime">Ime</label>
                                                </div>
                                                <InputText id="ime" v-model="odabraniKorisnik.ime"
                                                    placeholder="Ime korisnika" readonly required />
                                            </div>
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="user" />
                                                    <label for="prezime">Prezime</label>
                                                </div>
                                                <InputText id="prezime" v-model="odabraniKorisnik.prezime"
                                                    placeholder="Prezime korisnika" readonly required />
                                            </div>
                                        </div>
                                        <div class="field">
                                            <div class="label-container">
                                                <font-awesome-icon icon="building" />
                                                <label for="tvrtka">Tvrtka</label>
                                            </div>
                                            <InputText id="tvrtka" v-model="odabraniKorisnik.tvrtka"
                                                placeholder="Tvrtka korisnika" readonly required />
                                        </div>
                                        <div class="field">
                                            <div class="label-container">
                                                <font-awesome-icon icon="building-circle-arrow-right" />
                                                <label for="tvrtka_usluge">Tvrtka usluge</label>
                                            </div>
                                            <InputText id="tvrtka_usluge" v-model="odabraniKorisnik.tvrtka_usluge"
                                                placeholder="Tvrtka usluge korisnika" readonly required />
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="section">
                                        <div class="field-heading">
                                            <h2 class="p-text-bold">Pristupni podaci korisnika</h2>
                                            <p>Izmjeni pristupne podatke korisnika za prijavu u aplikaciju</p>
                                        </div>
                                        <div class="field-split">
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="clipboard-user" />
                                                    <label for="korime">Korisničko ime</label>
                                                    <button id="reset" class="resetBtn" type="reset"
                                                        @click="updateKorime">
                                                        <font-awesome-icon icon="rotate-right" class="button-icon" />
                                                    </button>
                                                </div>
                                                <InputText id="korime" v-model="odabraniKorisnik.korime" name="username"
                                                    placeholder="Korisničko ime korisnika" required />
                                            </div>
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="lock" />
                                                    <label for="lozinka">Lozinka</label>
                                                    <button id="reset" class="resetBtn" type="reset"
                                                        @click="updateLozinka">
                                                        <font-awesome-icon icon="rotate-right" class="button-icon" />
                                                    </button>
                                                </div>
                                                <Password id="lozinka" v-model="odabraniKorisnik.lozinka"
                                                    name="password" :feedback="false" toggle-mask fluid
                                                    placeholder="Lozinka korisnika" type="password" required />
                                                <template v-if="$form.password?.invalid">
                                                    <Message v-for="(error, index) of $form.password.errors"
                                                        :key="index" severity="error" size="small" variant="simple">{{
                                                            error.message }}
                                                    </Message>
                                                </template>
                                            </div>
                                        </div>
                                        <!-- <div class="field-buttons">
                                            <button id="reset" class="resetBtn fieldSaveBtn" type="reset"
                                                @click="resetodabraniKorisnik">
                                                <font-awesome-icon icon="save" />
                                                Spremi
                                            </button>
                                        </div> -->
                                    </div>
                                    <hr>
                                    <div class="section">
                                        <div class="field-heading">
                                            <h2 class="p-text-bold">Postavke korisničkog računa</h2>
                                            <p>Izmijeni raspon trajanja korisničkog računa</p>
                                        </div>
                                        <div class="field-split">
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="calendar-plus" />
                                                    <label for="datod">Vrijedi od</label>
                                                </div>
                                                <DatePicker id="datod" v-model="odabraniKorisnik.vrijeme_od" show-icon
                                                    fluid icon-display="input" input-id="odabraniKorisnik.vrijeme_od"
                                                    date-format="dd.mm.yy" placeholder="Vrijedi od" required />
                                            </div>
                                            <div>
                                                <div class="label-container">
                                                    <font-awesome-icon icon="calendar-plus" />
                                                    <label for="datdo">Vrijedi do</label>
                                                </div>
                                                <DatePicker id="datdo" v-model="odabraniKorisnik.vrijeme_do" show-icon
                                                    fluid icon-display="input" input-id="odabraniKorisnik.vrijeme_do"
                                                    date-format="dd.mm.yy" placeholder="Vrijedi do" />
                                            </div>
                                        </div>
                                        <div class="field status-field">
                                            <span>Status: </span>
                                            <span>
                                                <Tag :value="odabraniKorisnik.status"
                                                    :severity="getSeverity(odabraniKorisnik.status)" />
                                            </span>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                                <!-- <hr> -->
                                <div class="right-form">
                                    <div class="section">
                                        <div class="field-heading">
                                            <h2 class="p-text-bold">Prava korisnika</h2>
                                            <p>Izmjeni prava korisnika na korištenje aplikacija te prava unutar
                                                aplikacija
                                            </p>
                                        </div>

                                        <div class="section prava">
                                            <div class="prava-field">
                                                <Checkbox v-model="prava" input-id="kpkr" value="kpkr" />
                                                <label for="kpkr" class="prava-field-label">
                                                    <img src="/static/images/kpkr_logo_slim.svg" alt="kpkr_logo">
                                                    Kalkulator procjene klimatskih rizika
                                                </label>
                                            </div>

                                            <div class="prava-field">
                                                <Checkbox v-model="prava" input-id="kesp" value="kesp" />
                                                <label for="kesp" class="prava-field-label">
                                                    <img src="../../../public/static/images/kesp_logo_slim.svg"
                                                        alt="kesp_logo">
                                                    Kalkulator emisija stakleničkih plinova
                                                </label>
                                            </div>
                                        </div>
                                        <hr>
                                        <Accordion :value="openedAccordionPanels" multiple>
                                            <AccordionPanel v-if="prava.includes('kpkr')" value="kpkr" class="acc-kpkr">
                                                <AccordionHeader class="acc-header">
                                                    <!-- <Checkbox value="1" /> -->
                                                    <span class="acc-header-title">
                                                        <img src="../../../public/static/images/kpkr_logo_slim.svg"
                                                            alt="kpkr_logo">
                                                        <span class="acc-header-title-text">Kalkulator procjene
                                                            klimatskih
                                                            rizika</span>
                                                    </span>
                                                </AccordionHeader>
                                                <AccordionContent :class="$style.acc_content" class="acc-content">
                                                    <div class="content-field">
                                                        <div class="field-head">
                                                            <h2>Prava na vrstu izračuna</h2>
                                                            <font-awesome-icon icon="info-circle"
                                                                class="field-head-icon" />
                                                        </div>
                                                        <div class="field-content">
                                                            <div class="hr-column">
                                                                <hr>
                                                            </div>
                                                            <div class="data-column">
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="vrsteIzracuna" input-id="IM"
                                                                        value="IM" />
                                                                    <label for="IM">
                                                                        Imovina
                                                                    </label>
                                                                </div>
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="vrsteIzracuna" input-id="DJ"
                                                                        value="DJ" />
                                                                    <label for="DJ">
                                                                        Djelatnost
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="content-field">
                                                        <div class="field-head">
                                                            <h2>Prava na mogućnosti izračuna rizika</h2>
                                                            <font-awesome-icon icon="info-circle"
                                                                class="field-head-icon" />
                                                        </div>
                                                        <div class="field-content">
                                                            <div class="hr-column">
                                                                <hr>
                                                            </div>
                                                            <div class="data-column">
                                                                <div class="checkbox-field">
                                                                    <RadioButton v-model="vrsteRizika" input-id="KO"
                                                                        value="KO"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.vrstaRizika === 'KO'" />
                                                                    <label for="KO">
                                                                        Samo po katastarskim općinama
                                                                    </label>
                                                                </div>
                                                                <div class="checkbox-field">
                                                                    <RadioButton v-model="vrsteRizika" input-id="KOC"
                                                                        value="KOC"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.vrstaRizika === 'KOC'" />
                                                                    <label for="KOC">
                                                                        Po katastarskim općinama i česticama
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="content-field">
                                                        <div class="field-head">
                                                            <h2>Prava na vrstu imovine</h2>
                                                            <font-awesome-icon icon="info-circle"
                                                                class="field-head-icon" />
                                                        </div>
                                                        <div class="field-content">
                                                            <div class="hr-column">
                                                                <hr>
                                                            </div>
                                                            <div class="data-column">
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="vrsteImovine" input-id="PO"
                                                                        value="PO"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.vrstaImovine.includes('PO')" />
                                                                    <label for="PO">
                                                                        Prostor ili objekt
                                                                    </label>
                                                                </div>
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="vrsteImovine" input-id="GZ"
                                                                        value="GZ"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.vrstaImovine.includes('GZ')" />
                                                                    <label for="GZ">
                                                                        Građevinsko zemljište
                                                                    </label>
                                                                </div>
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="vrsteImovine" input-id="PZ"
                                                                        value="PZ"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.vrstaImovine.includes('PZ')" />
                                                                    <label for="PZ">
                                                                        Poljoprivredno zemljište
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="content-field">
                                                        <div class="field-head">
                                                            <h2>Prava na odabir klimatskog scenarija</h2>
                                                            <font-awesome-icon icon="info-circle"
                                                                class="field-head-icon" />
                                                        </div>
                                                        <div class="field-content">
                                                            <div class="hr-column">
                                                                <hr>
                                                            </div>
                                                            <div class="data-column">
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="scenariji" input-id="RCP"
                                                                        value="RCP" name="scenariji"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.scenariji.includes('RCP')" />
                                                                    <label for="RCP">
                                                                        RCP
                                                                    </label>
                                                                </div>
                                                                <div class="checkbox-field">
                                                                    <Checkbox v-model="scenariji" input-id="SSP"
                                                                        value="SSP" name="scenariji"
                                                                        :checked="odabraniKorisnik?.prava['kpkr']?.scenariji.includes('SSP')" />
                                                                    <label for="SSP">
                                                                        SSP
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionPanel>

                                            <AccordionPanel v-if="prava.includes('kesp')" value="kesp">
                                                <AccordionHeader class="acc-header">
                                                    <!-- <Checkbox value="2" /> -->
                                                    <span class="acc-header-title">
                                                        <img src="../../../public/static/images/kesp_logo_slim.svg"
                                                            alt="kesp">
                                                        <span class="acc-header-title-text">Kalkulator emisija
                                                            stakleničkih
                                                            plinova</span>
                                                    </span>

                                                </AccordionHeader>
                                                <AccordionContent>
                                                    <p class="m-0">
                                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                                        accusantium doloremque
                                                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                                                        veritatis et quasi
                                                        architecto beatae vitae dicta sunt explicabo. Nemo enim
                                                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                                                        fugit,
                                                        sed quia consequuntur
                                                        magni dolores eos qui ratione voluptatem sequi nesciunt.
                                                        Consectetur, adipisci velit, sed
                                                        quia non numquam eius modi.
                                                    </p>
                                                </AccordionContent>
                                            </AccordionPanel>
                                        </Accordion>
                                    </div>
                                </div>
                                <div class="section footer">
                                    <button class="p-button p-component p-button-secondary"
                                        @click="editKorisnikDialog = false">
                                        Odustani
                                    </button>
                                    <button class="submitBtn" type="submit">Spremi promjene</button>
                                </div>
                            </Form>
                        </Dialog>

                        <Dialog v-model:visible="deleteKorisnikaDialog" :style="{ width: '450px', padding: '26px' }"
                            header="Ukloni korisnika" :modal="true">
                            <div class="flex items-center gap-4">
                                <i class="pi pi-exclamation-triangle !text-3xl" />
                                <template v-if="odabraniKorisnik">
                                    Ime korisnika: <b>{{ odabraniKorisnik.ime }} {{ odabraniKorisnik.prezime }}</b>
                                </template>
                            </div>
                            <template #footer>
                                <button class="p-button p-component p-button-secondary" @click="deleteKorisnika">
                                    Ukloni
                                </button>
                                <button class="submitBtn" @click="deleteKorisnikaDialog = false">
                                    Odustani
                                </button>
                            </template>
                        </Dialog>

                    </div>
                </section>
                <section>
                    <div>
                        <h2>Popis partnera</h2>
                        <p>
                            Popis partnera koji se mogu dodati kao korisnici sustava. <br>
                            Parner može biti ili fizička ili pravna osoba.
                        </p>
                    </div>
                    <div class="select-container">
                        <SelectButton v-model="selectPartneriValue" :options="partneriOptions" option-label="naziv" />
                    </div>
                    <div class="datatable">
                        <Toolbar class="mb-6" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" :disabled="!odabraniPartner" @click="addKorisnik">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj korisnika
                                </button>
                            </template>
                            <template #end>
                                <!-- <button class="edit-btn" :disabled="!selectedVozilo" @click="enableEdit">
                                    <font-awesome-icon icon="pen-to-square" /> Uredi vozilo
                                </button> -->
                                <button class="dodaj-partnera-btn" @click="addPartner">
                                    <font-awesome-icon icon="user-plus" /> Dodaj partnera
                                </button>
                            </template>
                        </Toolbar>
                        <DataTable v-if="selectPartneriValue.label == 'FIZ'" v-model:filters="filterFizicke"
                            v-model:selection="odabraniPartner" :value="partneri.fizickeOsobe" :rows="10" data-key="id"
                            selection-mode="single" scrollable scroll-height="400px"
                            :global-filter-fields="['ime', 'prezime', 'oib', 'email', 'telefon']" :loading="loading"
                            removable-sort table-style="min-width: 50rem">

                            <template #header>
                                <div class="flex justify-end">
                                    <IconField>
                                        <InputIcon>
                                            <font-awesome-icon icon="search" />
                                        </InputIcon>
                                        <InputText v-model="filterFizicke['global'].value"
                                            placeholder="Pretraži fizičke partnere" />
                                    </IconField>
                                </div>
                            </template>
                            <template #empty> Nema korisnika. </template>
                            <template #loading> Učitavanje fizičkih osoba. Molimo pričekajte. </template>
                            <template #footer>
                                <div class="total-emissions">
                                    Ukupno korisnika: <strong>{{ partneri.fizickeOsobe.length }}</strong>
                                </div>
                            </template>
                            <Column header="#" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="ime" header="Ime" />
                            <Column field="prezime" header="Prezime" />
                            <Column field="oib" header="OIB" />
                            <Column field="email" header="Email">
                                <template #body="slotProps">
                                    {{ slotProps.data.email || '--' }}
                                </template>
                            </Column>
                            <Column field="telefon" header="Telefon" />

                        </DataTable>

                        <DataTable v-if="selectPartneriValue.label == 'PRV'" v-model:filters="filterPravne"
                            :value="partneri.pravneOsobe" :rows="10" data-key="id" selection-mode="single" scrollable
                            scroll-height="400px"
                            :global-filter-fields="['naziv_tvrtke', 'oib_tvrtke', 'adresa', 'mjesto', 'kontakt_osoba']"
                            :loading="loading" removable-sort table-style="min-width: 50rem">
                            <template #header>
                                <div class="flex justify-end">
                                    <IconField>
                                        <InputIcon>
                                            <font-awesome-icon icon="search" />
                                        </InputIcon>
                                        <InputText v-model="filterPravne['global'].value"
                                            placeholder="Pretraži pravne partnere" />
                                    </IconField>
                                </div>
                            </template>
                            <template #empty> Nema korisnika. </template>
                            <template #loading> Učitavanje pravnih osoba. Molimo pričekajte. </template>
                            <template #footer>
                                <div class="total-emissions">
                                    Ukupno korisnika: <strong>{{ partneri.pravneOsobe.length }}</strong>
                                </div>
                            </template>
                            <Column header="#" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="naziv_tvrtke" header="Naziv tvrtke" />
                            <Column field="oib_tvrtke" header="OIB tvrtke" />
                            <Column field="kontakt_osoba" header="Kontakt osoba" />
                            <Column field="adresa" header="Adresa" />
                            <Column field="mjesto" header="Mjesto" />
                        </DataTable>

                    </div>

                    <Dialog v-model:visible="openPartnerDialog" header="Uredi korisnika" :modal="true"
                        :style="{ width: '500px' }" @hide="resetPartnerDialog">
                        <template #header>
                            <div class="dialog-header">
                                <!-- <font-awesome-icon icon="user-pen" /> -->
                                <span>Dodaj partnera</span>
                            </div>
                        </template>
                        <form v-if="selectPartneriValue.label == 'FIZ'" class="p-fluid-partner"
                            @submit.prevent="savePartner">
                            <div class="fiz-form"> <!--v-if="selectPartneriValue.label == 'FIZ'"-->
                                <div class="section">
                                    <div class="field-heading">
                                        <h2 class="p-text-bold">Podaci o partneru</h2>
                                        <p>Dodaj novog fizičkog partnera</p>
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="user" />
                                                <label for="ime">Ime</label>
                                            </div>
                                            <InputText id="ime" v-model="tempFizPartner.ime" placeholder="Ime korisnika"
                                                required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="user" />
                                                <label for="prezime">Prezime</label>
                                            </div>
                                            <InputText id="prezime" v-model="tempFizPartner.prezime"
                                                placeholder="Prezime korisnika" required />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="address-card" />
                                            <label for="oib">OIB</label>
                                        </div>
                                        <InputOtp id="oib" v-model="tempFizPartner.oib" :length="11" integer-only
                                            required />
                                    </div>
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="building" />
                                            <label for="tvrtka">Tvrtka</label>
                                        </div>
                                        <InputText id="tvrtka" v-model="tempFizPartner.tvrtka"
                                            placeholder="Tvrtka partnera" required />
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="envelope" />
                                                <label for="email">Email</label>
                                            </div>
                                            <InputText id="email" v-model="tempFizPartner.email"
                                                placeholder="Email partnera" required />
                                            <!-- <Message v-if="$form_partner.email?.invalid" severity="error" size="small"
                                                variant="simple">
                                                {{ $form_partner.email.error?.message }}</Message> -->
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="phone" />
                                                <label for="telefon">Kontakt telefon</label>
                                            </div>
                                            <InputText v-model="tempFizPartner.telefon" placeholder="Kontakt telefon"
                                                integer-only />
                                            <!-- <InputText id="telefon" v-model="tempFizPartner.telefon"
                                                placeholder="Kontakt telefon" readonly required /> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form v-if="selectPartneriValue.label == 'PRV'" class="p-fluid-partner"
                            @submit.prevent="savePartner">
                            <div class="fiz-form"> <!--v-if="selectPartneriValue.label == 'FIZ'"-->
                                <div class="section">
                                    <div class="field-heading">
                                        <h2 class="p-text-bold">Podaci o partneru</h2>
                                        <p>Dodaj novog pravnog partnera</p>
                                    </div>
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="building" />
                                            <label for="tvrtka">Naziv tvrtke</label>
                                        </div>
                                        <InputText id="tvrtka" v-model="tempPrvPartner.tvrtka"
                                            placeholder="Naziv tvrtke" required />
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="user" />
                                                <label for="vlasnik">Kontakt osoba</label>
                                            </div>
                                            <InputText id="vlasnik" placeholder="Kontakt osoba"
                                                v-model="tempPrvPartner.kontakt_osoba" required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="phone" />
                                                <label for="telefon">Kontakt telefon</label>
                                            </div>
                                            <InputText v-model="tempPrvPartner.kontakt_telefon"
                                                placeholder="Kontakt telefon" integer-only />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="address-card" />
                                            <label for="oib">OIB tvrtke</label>
                                        </div>
                                        <InputOtp id="oib" v-model="tempPrvPartner.oib_tvrtke" :length="11" integer-only
                                            required />
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="map-location" />
                                                <label for="adresa">Adresa tvrtke</label>
                                            </div>
                                            <InputText id="adresa" v-model="tempPrvPartner.adresa"
                                                placeholder="Adresa tvrtke" required />
                                            <!-- <Message v-if="$form_partner.email?.invalid" severity="error" size="small"
                                                variant="simple">
                                                {{ $form_partner.email.error?.message }}</Message> -->
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="city" />
                                                <label for="telefon">Mjesto</label>
                                            </div>
                                            <InputText v-model="tempPrvPartner.mjesto" placeholder="Mjesto" />
                                            <!-- <InputText id="telefon" v-model="tempFizPartner.telefon"
                                                placeholder="Kontakt telefon" readonly required /> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <template #footer>
                            <button class="p-button p-component p-button-secondary" @click="openPartnerDialog = false">
                                Odustani
                            </button>
                            <button class="submitBtn" type="submit" @click="savePartner">Dodaj partnera</button>
                        </template>
                    </Dialog>
                </section>
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import AutoComplete from 'primevue/autocomplete';
import z from 'zod';

definePageMeta({
    middleware: [
        'auth'
    ],
});

const toast = useToast()

const odabraniKorisnik = ref(null);
const odabraniPartner = ref();
const editKorisnikDialog = ref(false);
const openPartnerDialog = ref(false);
const deleteKorisnikaDialog = ref(false);
const loading = ref();
const expandedGroups = ref([]);

const initialValues = ref({
    username: '',
    password: ''
});
const resolver = ref();
// const resolver = ref(zodResolver(
//     z.object({
//         password: z
//             .string()
//             .min(6, { message: 'Minimalno 6 znakova' })
//             .max(8, { message: 'Maximalno 8 znakova.' })
//             .refine((value) => /[a-z]/.test(value), {
//                 message: 'Mora imati barem jedno malo slovo.'
//             })
//             .refine((value) => /[A-Z]/.test(value), {
//                 message: 'Mora imati barem jedno veliko slovo.'
//             })
//             .refine((value) => /d/.test(value), {
//                 message: 'Mora imati barem jedan broj.'
//             })
//     })
// ));

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    prezime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tvrtka: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tvrtka_usluge: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: 'equals' },
});
const filterFizicke = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    prezime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    oib: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    telefon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: 'equals' },
});
const filterPravne = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    naziv_tvrtke: { value: null, matchMode: FilterMatchMode.CONTAINS },
    oib_tvrtke: { value: null, matchMode: FilterMatchMode.CONTAINS },
    adresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mjesto: { value: null, matchMode: FilterMatchMode.CONTAINS },
    zupanija: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectPartneriValue = ref({
    label: 'FIZ',
    naziv: 'Fizički partneri'
});
const partneriOptions = ref([
    {
        label: 'FIZ',
        naziv: 'Fizički partneri'
    },
    {
        label: 'PRV',
        naziv: 'Pravni partneri',
    }
]);

// const imena = ['Ivan', 'Marko', 'Antonio', 'Tin', 'Ivan', 'Juraj', 'Šime', 'Pero', 'Ante', 'Stjepan', 'Zeko peder'];
// const prezimena = ['Klepo', 'Melvan', 'Božić', 'Zec', 'Sanader', 'Vrdoljak', 'Delić', 'Omašić', 'Ćurković'];
const imena = ['Ivan', 'Marko', 'Josip', 'Petar', 'Slavko', 'Antonio', 'Mehmedaga', 'Jusuf', 'Izet', 'Stjepan'];
const prezimena = ['Jonjić', 'Slavuj', 'Bigec', 'Krstić', 'Mujkić', 'Hađičumbrović', 'Koliker'];
const tvrtke = ['Digitalna Inovacija', 'Kreativna Rješenja', 'Globalna Tehnologija', 'Inovativni Servisi', 'Tehno Eksperti', 'Digitalni Horizonti'];
const tvrtke_usluge = ['Pametne Solucije', 'Inovativna Tehnologija', 'Tehno Partneri', 'Digitalni Lideri', 'Tehno Rješenja', 'Pametni Sistemi', 'Inovativni Projekti', 'Tehno Uspon', 'Digitalni Servisi', 'Tehno Inovacije', 'Pametni Projekti'];
const statuses = ref(['Aktivan', 'Neaktivan', 'Na čekanju', 'Odbijen']);
const adrese = ['Ulica 1', 'Ulica 2', 'Ulica 3'];
const mjesta = ['Zagreb', 'Split', 'Rijeka', 'Osijek'];
const zupanije = ['Grad Zagreb', 'Splitsko-dalmatinska', 'Primorsko-goranska', 'Osječko-baranjska'];
const postanskiBrojevi = ['10000', '21000', '51000', '31000'];

const generirajOIB = () => String(Math.floor(10000000000 + Math.random() * 90000000000));
const generirajLozinku = () => Math.random().toString(36).slice(-8);
const generirajTelefon = () => `09${Math.floor(10000000 + Math.random() * 90000000)}`;

const korisnici = ref([]);
const brojKorisnika = 50; // Broj korisnika za generiranje
const partneri = ref(populatePartneri());
const brojPartnera = 50;

const tempFizPartner = ref({
    // id: partneri.value?.length > 0 
    //     ? partneri.value[partneri.value.length - 1].id + 1 
    //     : null,
    id: null,
    ime: '',
    prezime: '',
    oib: null,
    tvrtka: '',
    telefon: null,
    email: '',
})

const resetFizPartner = () => {
    tempFizPartner.value = {
        id: null,
        ime: '',
        prezime: '',
        oib: null,
        tvrtka: '',
        telefon: null,
        email: '',
    }
}

const tempPrvPartner = ref({
    // id: partneri.value?.length > 0 
    //     ? partneri.value[partneri.value.length - 1].id + 1 
    //     : null,
    id: null,
    oib_tvrtke: null,
    tvrtka: '',
    kontakt_osoba: '',
    kontakt_telefon: null,
    adresa: '',
    mjesto: ''
});

const resetPrvPartner = () => {
    tempPrvPartner.value = {
        id: null,
        oib_tvrtke: null,
        tvrtka: '',
        kontakt_osoba: '',
        kontakt_telefon: null,
        adresa: '',
        mjesto: ''
    }
}

const sada = new Date();

const prava = ref([]);
const vrsteIzracuna = ref([]);
const vrsteRizika = ref(null);
const vrsteImovine = ref([]);
const scenariji = ref([]);

const openedAccordionPanels = ref(['0']); // Početno otvoren prvi panel

onMounted(() => {
    populateUsers();
})

const populateUsers = () => {
    for (let i = 0; i < brojKorisnika; i++) {
        const ime = imena[Math.floor(Math.random() * imena.length)];
        const prezime = prezimena[Math.floor(Math.random() * prezimena.length)];
        const tvrtka = tvrtke[Math.floor(Math.random() * tvrtke.length)];
        const tvrtka_usluge = tvrtke_usluge[Math.floor(Math.random() * tvrtke_usluge.length)];

        // Generiraj random datume za vrijeme_od i vrijeme_do
        const vrijemeOdDate = new Date(sada.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)); // unatrag godinu dana
        vrijemeOdDate.setHours(0, 0, 0, 0);
        const vrijemeOdFormatted = formatDateToDMY(vrijemeOdDate, '.');

        const vrijemeDoDate = new Date(vrijemeOdDate.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)); // do godinu dana od vrijeme_od
        vrijemeDoDate.setHours(0, 0, 0, 0);
        const vrijemeDoFormatted = formatDateToDMY(vrijemeDoDate, '.');

        // Odredi status na temelju vremena
        let status;
        if (vrijemeDoDate >= sada && vrijemeOdDate <= sada) {
            status = 'Aktivan';
        } else {
            status = Math.random() < 0.05 ? 'Na čekanju' : Math.random() < 0.1 ? 'Odbijen' : 'Neaktivan';
        }

        // Generiraj korisničko ime
        const korimeBase = ukloniKvacicu(ime[0].toLowerCase() + prezime.toLowerCase());
        let korime = korimeBase;
        let counter = 0;

        while (korisnici.value.some(k => k.korime === korime)) {
            counter++;
            korime = `${korimeBase}${counter.toString().padStart(2, '0')}`;
        }

        const lozinka = generirajLozinku();

        // Dodaj korisnika u listu
        korisnici.value.push({
            id: i + 1,
            tip: 'FIZ',
            ime,
            prezime,
            tvrtka,
            tvrtka_usluge,
            status,
            vrijeme_od: vrijemeOdFormatted,
            vrijeme_do: vrijemeDoFormatted,
            korime,
            lozinka,
            prava: [
                {
                    naziv: 'kpkr',
                    status: true,
                    vrstaIzracuna: (() => {
                        const opcije = ['IM', 'DJ'].filter(() => Math.random() > 0.5);
                        return opcije.length > 0 ? opcije : ['IM']; // Dodaj jednu podrazumevanu opciju ako je niz prazan
                    })(),
                    vrstaRizika: Math.random() > 0.5 ? 'KO' : 'KOC',
                    vrstaImovine: (() => {
                        const opcije = ['PO', 'PZ', 'GZ'].filter(() => Math.random() > 0.5);
                        return opcije.length > 0 ? opcije : ['PO']; // Dodaj jednu podrazumevanu opciju ako je niz prazan
                    })(),
                    scenariji: (() => {
                        const opcije = ['RCP', 'SSP'].filter(() => Math.random() > 0.5);
                        return opcije.length > 0 ? opcije : ['RCP']; // Dodaj jednu podrazumevanu opciju ako je niz prazan
                    })()
                }
            ]


        });
    }

    korisnici.value.sort((a, b) => a.tvrtka.localeCompare(b.tvrtka));
    console.log(korisnici.value);
};

function populatePartneri() {
    const fizickeOsobe = [];
    const pravneOsobe = [];
    const sada = new Date();

    for (let i = 0; i < brojPartnera; i++) {
        const jePravnaOsoba = Math.random() > 0.4; // 60% šanse za fizičku, 40% za pravnu

        const oib = generirajOIB();

        if (jePravnaOsoba) {
            const nazivTvrtke = tvrtke[Math.floor(Math.random() * tvrtke.length)];
            const adresa = adrese[Math.floor(Math.random() * adrese.length)];
            const postanskiBroj = postanskiBrojevi[Math.floor(Math.random() * postanskiBrojevi.length)];
            const mjesto = mjesta[Math.floor(Math.random() * mjesta.length)];
            const zupanija = zupanije[Math.floor(Math.random() * zupanije.length)];

            const ime = imena[Math.floor(Math.random() * imena.length)];
            const prezime = prezimena[Math.floor(Math.random() * prezimena.length)];
            const telefon = generirajTelefon();

            const korimeBase = ukloniKvacicu(nazivTvrtke.toLowerCase().replace(/\s+/g, ''));
            let korime = korimeBase;
            let counter = 0;

            while (pravneOsobe.some(p => p.korime === korime)) {
                counter++;
                korime = `${korimeBase}${counter.toString().padStart(2, '0')}`;
            }

            pravneOsobe.push({
                id: i + 1,
                naziv_tvrtke: nazivTvrtke,
                oib_tvrtke: oib,
                kontakt_osoba: ime + ' ' + prezime,
                adresa,
                telefon: telefon,
                mjesto,
                zupanija,
            });
        } else {
            const ime = imena[Math.floor(Math.random() * imena.length)];
            const prezime = prezimena[Math.floor(Math.random() * prezimena.length)];
            const telefon = generirajTelefon();

            const korimeBase = ukloniKvacicu(ime[0].toLowerCase() + prezime.toLowerCase());
            let korime = korimeBase;
            let counter = 0;

            while (fizickeOsobe.some(p => p.korime === korime)) {
                counter++;
                korime = `${korimeBase}${counter.toString().padStart(2, '0')}`;
            }

            fizickeOsobe.push({
                id: i + 1,
                ime,
                prezime,
                oib,
                tvrtka: tvrtke[Math.floor(Math.random() * tvrtke.length)],
                telefon,
                email: ime.slice(0, 1).toLowerCase() + prezime.toLowerCase() + '@gmail.com',
            });
        }
    }

    console.log(fizickeOsobe, pravneOsobe);
    return { fizickeOsobe, pravneOsobe };
};

const updateKorime = () => {
    // Generiraj korisničko ime
    const korimeBase = ukloniKvacicu(odabraniKorisnik.value.ime.toLowerCase() + odabraniKorisnik.value.prezime.toLowerCase());
    let korime = korimeBase;
    let counter = 0;

    while (korisnici.value.some(k => k.korime === korime)) {
        counter++;
        korime = `${korimeBase}${counter.toString().padStart(2, '0')}`;
    }

    odabraniKorisnik.value.korime = korime;
    return korime;
}

const updateLozinka = () => {
    // Generiraj lozinku
    const lozinka = generirajLozinku();
    odabraniKorisnik.value.lozinka = lozinka;
    return lozinka;
}

const calculateCustomerTotal = (tvrtka) => {
    let total = 0;

    if (korisnici.value) {
        for (const customer of korisnici.value) {
            if (customer.tvrtka === tvrtka) {
                total++;
            }
        }
    }

    return total;
};

const getSeverity = (status) => {
    switch (status) {
        case 'Neaktivan':
            return 'secondary';
        case 'Aktivan':
            return 'success';
        case 'Na čekanju':
            return 'warn';
        case 'Odbijen':
            return 'danger';
        default:
            return null;
    }
}

const showSuccessPartner = (osoba) => {
    toast.add({ severity: 'success', summary: 'Uspješno dodan partner', detail: `Partner: ${osoba.ime || osoba.naziv_tvrtke} ${osoba.prezime || ', ' + osoba.kontakt_osoba}`, life: 3000 });
};

const showErrorPartner = (osoba) => {
    toast.add({ severity: 'error', summary: 'Greška dodavanja partnera', detail: `Partner: ${osoba.ime || osoba.naziv_tvrtke} ${osoba.prezime || ', ' + osoba.kontakt_osoba}`, life: 3000 });
};

const resetOdabraniKorisnik = () => {
    odabraniKorisnik.value = null; // Ako imate originalne podatke ili postavite prazne vrijednosti
};

const resetPartnerDialog = () => {
    odabraniPartner.value = null;
}

const saveKorisnik = () => {
    // Spremite promjene u bazu podataka ili napravite potrebnu akciju
    // Npr. apiCallToUpdateKorisnik(odabraniKorisnik.value);
    editKorisnikDialog.value = false;
};

const editKorisnik = (korisnik) => {
    if (korisnik) {
        console.log("Odabrani korisnik: ", korisnik);
        odabraniKorisnik.value = korisnik;

        // Pristup pravima iz korisnika
        const pravaData = odabraniKorisnik.value.prava || [];

        // Ekstrakcija podataka
        prava.value = pravaData.map(kor => kor.naziv); // Lista naziva prava
        console.log("prava: ", prava.value.includes('kpkr'))
        vrsteIzracuna.value = pravaData.find(kor => kor.naziv === 'kpkr')?.vrstaIzracuna || [];
        vrsteRizika.value = pravaData.find(kor => kor.naziv === 'kpkr')?.vrstaRizika || null;
        vrsteImovine.value = pravaData.find(kor => kor.naziv === 'kpkr')?.vrstaImovine || [];
        scenariji.value = pravaData.find(kor => kor.naziv === 'kpkr')?.scenariji || [];

        // Otvori dijalog za uređivanje korisnika
        editKorisnikDialog.value = true;
    }
};

const addPartner = () => {
    openPartnerDialog.value = true;
}

const savePartner = () => {
    console.log("Odabrani partner: ", selectPartneriValue.value)
    if (selectPartneriValue.value.label === 'FIZ') {
        const osoba = {
            id: partneri.value.fizickeOsobe.length > 0
                ? partneri.value.fizickeOsobe[partneri.value.fizickeOsobe.length - 1].id + 1
                : 1, // Početni ID ako je niz prazan
            ime: tempFizPartner.value.ime,
            prezime: tempFizPartner.value.prezime,
            oib: tempFizPartner.value.oib,
            tvrtka: tempFizPartner.value.tvrtka,
            telefon: tempFizPartner.value.telefon,
            email: tempFizPartner.value.email,
        };
        try {
            console.log("Osoba: ", osoba);
            partneri.value.fizickeOsobe.push(osoba); // Push u `fizickeOsobe` niz
            showSuccessPartner(osoba)
        } catch (error) {
            console.error(error)
            showErrorPartner();
        }
    }
    else if (selectPartneriValue.value.label === 'PRV') {
        const osoba = {
            id: partneri.value.pravneOsobe.length > 0
                ? partneri.value.pravneOsobe[partneri.value.pravneOsobe.length - 1].id + 1
                : 1, // Početni ID ako je niz prazan
            oib_tvrtke: tempPrvPartner.value.oib_tvrtke,
            naziv_tvrtke: tempPrvPartner.value.tvrtka,
            kontakt_osoba: tempPrvPartner.value.kontakt_osoba,
            telefon: tempPrvPartner.value.telefon,
            adresa: tempPrvPartner.value.adresa,
            mjesto: tempPrvPartner.value.mjesto
        }
        console.log("Osoba: ", osoba);
        try {
            showSuccessPartner(osoba)
            partneri.value.pravneOsobe.push(osoba);
        } catch (error) {
            console.error(error)
            showErrorPartner();
        }
    }
    resetFizPartner();
    resetPrvPartner();
    openPartnerDialog.value = false;
}

</script>

<style module>
/* .acc_content {
    background-color: var(--bg-color) !important;
} */
</style>

<style scoped>
* {
    color: var(--text-color);
}

.body {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 26px;
    background-color: white !important;
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
    color: var(--text-color);
}

main {
    display: grid;
    grid-template-columns: 1fr;
    /** 0.2fr */
    grid-template-rows: min-content auto;
    gap: 34px;

    height: 100%;
}


main>div {
    width: 100%;
    height: 100%;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.datatable {
    max-width: 1100px;
}

.dodaj-btn,
.dodaj-partnera-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.dodaj-btn {
    background-color: var(--text-color);
    color: white;
}

.dodaj-btn * {
    color: white;
}

.dodaj-btn:hover {
    background-color: var(--text-color-hover);
}

.dodaj-btn:active {
    background-color: var(--text-color-focus);
}

.dodaj-btn:disabled {
    color: black;
    background-color: #b0b0b0;
    cursor: not-allowed;
}

.dodaj-btn:disabled * {
    color: black;
}

.dodaj-partnera-btn {
    background-color: white;
    border: var(--border);
    color: black;
}

.dodaj-partnera-btn * {
    color: black;
}

.dodaj-partnera-btn:hover {
    background-color: var(--text-color);
    color: white;
}


.dodaj-partnera-btn:hover * {
    color: white;
}

.dodaj-partnera-btn:active {
    background-color: var(--text-color-focus);
}


.dodaj-partnera-btn:active * {
    color: white;
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

.opisnap {
    width: 100%;
    grid-column: span 2;
}

textarea {
    resize: vertical;
    max-height: 100px;
}

.razdoblje>span {
    width: auto;
}

hr {
    margin: 13px 0px;
    width: 100%;
    border: none;
    border-top: var(--border-line-sidebar);
}

h3 {
    font-weight: 500;
}

.spremiBtn-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.spremiBtn-container span {
    font-style: italic;
}

section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

section>div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

p {
    opacity: 0.8;
}

sub,
sup {
    font-size: smaller;
}

.p-fluid {
    display: grid;
    grid-template-columns: 0.8fr 1fr;
    grid-template-rows: repeat(2, auto);
    gap: 26px;
}

.p-fluid-partner {
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 13px;
}

.section.prava {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.prava-field,
.prava-field-label {
    display: flex;
    flex-direction: row;
    gap: 8px;
}


.section.footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    grid-column: 1 / 3;
}

.acc-kpkr {
    background-color: var(--bg-color);
}

.p-accordionpanel {
    border-radius: 5px;
}

:deep(.p-accordioncontent-content) {
    background: none !important;
}

.p-accordionheader,
.p-accordionheader.acc-header,
.p-accordioncontent-content {
    background: none !important;
}

.acc-header,
.acc-header-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.acc-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 13px;
}

.field-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.content-field {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.content-field+.content-field {
    margin-top: 18px;
}

.field-head-icon {
    opacity: 0.3;
    cursor: pointer;
}

.field-head-icon:hover {
    opacity: 0.8;
}

.field-head-icon:active {
    opacity: 1;
}

.field-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    align-items: start;
}

.hr-column {
    height: 100%;
    border: 0.5px solid var(--text-color);
    opacity: 0.1;
}

.checkbox-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    width: auto;
}

.data-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.label-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.custom-otp-input {
    width: 48px;
    height: 48px;
    font-size: 24px;
    appearance: none;
    text-align: center;
    transition: all 0.2s;
    border-radius: 0;
    border: 1px solid var(--p-inputtext-border-color);
    background: transparent;
    outline-offset: -2px;
    outline-color: transparent;
    border-right: 0 none;
    transition: outline-color 0.3s;
    color: var(--p-inputtext-color);
}

.custom-otp-input:focus {
    outline: 2px solid var(--p-focus-ring-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border-right-width: 1px;
    border-right-style: solid;
    border-color: var(--p-inputtext-border-color);
}

.dialog-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    opacity: 1;
}

.dialog-header * {
    font-size: 20px;
    font-weight: 700;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field-heading {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.field-split,
.field-split>div {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.field-split>div {
    flex-direction: column;
    flex: 1;
}

.field-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.resetBtn {
    height: auto;
    border-radius: 50%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #D9D9D9;
    color: var(--text-color);
}

.resetBtn:hover {
    background-color: #c4c4c4;
}

.resetBtn:hover .button-icon {
    transform: rotate(30deg);
}

.resetBtn:active {
    background-color: #b3b3b3;
}

.resetBtn:active .button-icon {
    transform: rotate(60deg);
}

.fieldSaveBtn {
    border-radius: 5px;
    padding: 6px 20px;
}

.status-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
}

.total-emissions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 10px;
}

strong {
    text-decoration: underline;
    font-size: 16px;
}

.required {
    color: var(--red-soft);
}

.expand-icon:hover {
    cursor: pointer;
    background-color: #2ecc71;
}

.closeDialog,
.closeDialog * {
    font-size: 16px;
}

.ukloni-btn,
.submitBtn,
.edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    background-color: var(--text-color);
    color: white;
}

.edit-btn *,
.submitBtn * {
    color: white;
}

.edit-btn:hover,
.submitBtn:hover {
    background-color: var(--text-color-hover);
}

.edit-btn:active,
.submitBtn:active {
    background-color: var(--text-color-focus);
}

.ukloni-btn {
    background-color: var(--red-soft);
    color: white;
}

.ukloni-btn *,
.edit-btn>* {
    color: white;
}

.ukloni-btn:hover {
    background-color: var(--red-hover);
}

.ukloni-btn:active {
    background-color: var(--red-focus);
}

.edit-btn {
    margin-right: 10px;
    background-color: var(--text-color);
    color: white;
}

.edit-btn:hover {
    background-color: var(--text-color-hover);
}

.edit-btn:active {
    background-color: var(--text-color-focus);
}

.ukloni-btn:disabled,
.edit-btn:disabled {
    color: black;
    background-color: #b0b0b0;
    cursor: not-allowed;
}

.ukloni-btn:disabled *,
.edit-btn:disabled * {
    color: black;
}

#saveBtn {
    width: 150px;
    background: none;
    border: var(--border);
    font-weight: 500;

    background-color: var(--text-color);
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

#saveBtn * {
    color: white;
}


#saveBtn:hover {
    background-color: var(--text-color-hover);
    color: white;
}

#saveBtn:hover>.save-icon {
    color: white;
}

#saveBtn:active {
    background-color: var(--text-color-focus);
}


#saveBtn:disabled {
    background: rgb(216, 216, 216);
    color: var(--text-color);
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.6;
}

#saveBtn:disabled * {
    color: var(--text-color);
}

#saveBtn:disabled:hover,
#saveBtn:disabled:active,
#saveBtn:disabled>.save-icon {
    background-color: rgb(232, 232, 232);
    color: var(--text-color);
}

footer {
    justify-content: flex-end;
}

.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 26px;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

.fullscreen-chart {
    position: relative;

    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 26px;
    border-radius: 5px;
    animation: scaleUp 0.3s ease;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
}

.fullscreen-chart-content {
    margin: auto;
    width: 100%;
    height: 90%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.fullscreen-chart-content>canvas {
    margin: auto;
}

.status-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
}

.status-aktivan {
    background-color: #2ecc71;
    /* zeleno */
    color: #fff;
}

.status-neaktivan {
    background-color: var(--red-soft, rgb(192, 57, 43));
    /* crveno */
    color: #fff;
}

.p-datatable-row-toggle-button {
    display: none !important;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleUp {
    from {
        transform: scale(0.8);
    }

    to {
        transform: scale(1);
    }
}
</style>