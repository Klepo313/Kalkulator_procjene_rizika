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
                    <div>
                        <Toolbar class="toolbar" style="display: flex; gap: 5px;">
                            <template #start>
                                <button class="dodaj-btn" @click="onOpenNewUserDialog()">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj korisnički račun
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
                    </div>
                    <div class="datatable">

                        <DataTable v-model:filters="filters" v-model:expanded-rows="expandedRows"
                            :value="noneEmptyKorisnici" :rows="10" scrollable scroll-height="800px" :sort-order="1"
                            :loading="loading" size="small" removable-sort :global-filter-fields="[
                                'epr_naziv',
                                'epr_oib',
                                'user_accounts_num',
                                'epr_adresa',
                                'epr_mjesto',
                                'usersFlat',
                            ]" table-style="min-width: 60rem" @row-expand="onRowExpand">
                            <template #header>
                                <div class="flex justify-end">
                                    <IconField>
                                        <InputIcon>
                                            <font-awesome-icon icon="search" />
                                        </InputIcon>
                                        <InputText v-model="filters['global'].value"
                                            placeholder="Pretraži tvrtke, ..." />
                                    </IconField>
                                </div>
                            </template>
                            <template #rowtoggleicon>
                                <span>
                                    <font-awesome-icon icon="chevron-down" />
                                </span>
                            </template>
                            <template #empty> Nema pravnih osoba. </template>
                            <template #loading> Učitavanje pravnih osoba. Molimo pričekajte. </template>
                            <template #footer>
                                <div class="total-emissions">
                                    Ukupno pravnih osoba: <strong>{{ noneEmptyKorisnici.length }}</strong>
                                </div>
                            </template>

                            <Column expander style="width: 5rem" />
                            <Column field="epr_naziv" header="Naziv">
                                <template #body="slotProps">
                                    <strong style="text-decoration: none;">{{ slotProps.data.epr_naziv }}</strong>
                                </template>
                            </Column>
                            <Column field="epr_oib" header="OIB" />
                            <Column field="epr_adresa" header="Adresa" />
                            <Column field="epr_mjesto" header="Mjesto" />
                            <Column field="employees_num" header="Broj korisnika" />

                            <template #expansion="slotProps">
                                <div class="inside-table">
                                    <DataTable :value="slotProps.data.users">
                                        <template #loading> Učitavanje korisnika tvrtke{{ ' ' +
                                            slotProps.data?.epr_naziv || '' }}. Molimo pričekajte. </template>
                                        <template #footer>
                                            <div style="margin: 5px 0px;">
                                                <span v-tooltip.top="'Nije još u funkciji.'"
                                                    class="dodaj-korisnika"><!--@click="onOpenNewUserDialog(slotProps.data)"-->
                                                    <font-awesome-icon icon="plus" />
                                                    Dodaj korisnički račun
                                                </span>
                                            </div>
                                        </template>

                                        <!-- <Column header="#" header-style="width:3rem">
                                            <template #body="slotProps">
                                                {{ slotProps.index + 1 }}
                                            </template>
                                        </Column> -->
                                        <Column field="epr_ime" header="Ime"
                                            header-style="width: 20%; min-width: 10rem" />
                                        <Column field="epr_prezime" header="Prezime"
                                            header-style="width: 20%; min-width: 10rem" />
                                        <Column field="tvrtka_usluge" header="Tvrtka usluge"
                                            header-style="width: 20%; min-width: 10rem" />
                                        <Column field="aktivan" header="Status" :show-filter-menu="false"
                                            style="width: 3rem">
                                            <template #body="{ data }">
                                                <Tag :value="data?.aktivan ? 'Aktivan' : 'Neaktivan'"
                                                    :severity="getSeverity(data?.aktivan)" />
                                            </template>
                                            <template #filter="{ filterModel, filterCallback }">
                                                <Select v-model="filterModel.value" :options="statuses"
                                                    placeholder="Odaberi status" style="min-width: 12rem"
                                                    :show-clear="true" @change="filterCallback()">
                                                    <template #option="slotProps">
                                                        <Tag :value="slotProps.option"
                                                            :severity="getSeverity(slotProps.option)" />
                                                    </template>
                                                </Select>
                                            </template>
                                        </Column>
                                        <Column header-style="width: 5rem;">
                                            <template #body="{ data }">
                                                <div style="display: flex; justify-content: flex-end">
                                                    <span class="edit-btn" @click="editKorisnik(data)">
                                                        <font-awesome-icon icon="user-pen" />
                                                    </span>
                                                </div>
                                                <!-- <Button type="button" icon="pi pi-user-edit"
                                                    style="background-color: var(--text-color); border: none;" rounded
                                                    @click="editKorisnik(data)" /> -->
                                            </template>
                                        </Column>
                                    </DataTable>
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

                <Dialog v-model:visible="openNewUserDialog" :modal="true" header="Dodaj korisnički račun"
                    :style="{ width: '600px' }" @hide="resetNewUserDialog(); hideNewUserDialog()">
                    <!-- <template #header>
                            <div class="dialog-header">
                                <font-awesome-icon icon="user-circle" size="lg" style="font-size: 20px;" />
                                <div class="credentials">
                                    <template v-if="odabraniPartner?.epr_ime">
                                        <h3 style="font-size: 20px; text-transform: capitalize;">
                                            {{
                                                odabraniPartner?.epr_ime + ' ' + odabraniPartner?.epr_prezime
                                            }}
                                        </h3>
                                        <p style="font-size: 16px; font-weight: 400;">
                                            {{
                                                odabraniPartner?.epr_email || odabraniPartner?.epr_oib
                                            }}
                                        </p>
                                    </template>
                                    <template v-else-if="noviKorisnik.tvrtka?.epr_naziv">
                                        <h3 style="font-size: 20px; text-transform: capitalize;">
                                            {{
                                                noviKorisnik.tvrtka?.epr_naziv
                                            }}
                                        </h3>
                                        <p style="font-size: 16px; font-weight: 400;">
                                            {{
                                                noviKorisnik.tvrtka?.epr_oib + ', ' + noviKorisnik.tvrtka?.epr_adresa
                                            }}
                                        </p>
                                    </template>
                                </div>
                            </div>
                        </template> -->
                    <div class="form-div">
                        <Form v-slot="$formKorisnik" :initial-values="initialValuesAddKorisnik"
                            :resolver="addKorisnikResolver" :validate-on-value-update="true" :validate-on-blur="true"
                            class="form" @submit="addKorisnik">
                            <div class="field">
                                <div class="label-container">
                                    <font-awesome-icon icon="building" />
                                    <label for="tvrtka">Tvrtka</label>
                                </div>
                                <Select id="tvrtka" key="epr_id" v-model="tvrtka" name="tvrtka" filter
                                    :options="PRVpartneri" option-label="epr_naziv"
                                    placeholder="Odaberi tvrtku odabranog partnera" />

                                <Message v-if="$formKorisnik.tvrtka?.invalid" severity="error" size="small"
                                    variant="simple">{{
                                        $formKorisnik.tvrtka.error.message }}</Message>
                            </div>
                            <div class="field">
                                <div class="label-container">
                                    <font-awesome-icon icon="user" />
                                    <label for="osoba">Osoba</label>
                                </div>
                                <Select id="osoba" v-model="korisnik" name="osoba" filter :options="FIZpartneri"
                                    :option-label="(option) => option.epr_naziv + ' (' + (option?.epr_email || option?.epr_oib) + ')'"
                                    placeholder="Odaberi osobu koju želiš dodati kao korisnika" />
                                <Message v-if="$formKorisnik.osoba?.invalid" severity="error" size="small"
                                    variant="simple">{{
                                        $formKorisnik.osoba.error.message }}</Message>
                            </div>
                            <span v-if="korisnik && !korisnik?.epr_email">
                                <p style="color: red; font-weight: bold;">
                                    Korisnik {{ korisnik?.epr_naziv }} nema spremljen email. Molimo unesite email
                                </p>
                            </span>
                            <hr>
                            <div class="field-heading">
                                <h2 class="p-text-bold">Postavke korisničkog računa</h2>
                                <p>Izmijeni raspon trajanja korisničkog računa</p>
                            </div>
                            <div class="field-split" style="margin-top: 13px;">
                                <div>
                                    <div class="label-container">
                                        <font-awesome-icon icon="calendar-plus" />
                                        <label for="datumOd">Vrijedi od</label>
                                    </div>
                                    <DatePicker id="datumOd" v-model="razdoblje.vrijemeOd" name="datumOd" show-icon
                                        fluid icon-display="input" input-id="odabraniKorisnik.vrijeme_od"
                                        date-format="dd.mm.yy" placeholder="Vrijedi od" required />
                                    <Message v-if="$formKorisnik.datumOd?.invalid" severity="error" size="small"
                                        variant="simple">{{
                                            $formKorisnik.datumOd.error.message }}</Message>
                                </div>
                                <div>
                                    <div class="label-container">
                                        <font-awesome-icon icon="calendar-plus" />
                                        <label for="datumDo">Vrijedi do</label>
                                    </div>
                                    <DatePicker id="datumDo" v-model="razdoblje.vrijemeDo" name="datumDo" show-icon
                                        fluid icon-display="input" input-id="odabraniKorisnik.vrijeme_do"
                                        date-format="dd.mm.yy" placeholder="Vrijedi do" />
                                    <Message v-if="$formKorisnik.datumDo?.invalid" severity="error" size="small"
                                        variant="simple">{{
                                            $formKorisnik.datumDo.error.message }}</Message>
                                </div>
                            </div>
                            <div class="btn-container">
                                <button id="saveBtn" type="submit" style="margin-top: 20px;">
                                    <font-awesome-icon icon="save" class="save-icon" />
                                    Spremi
                                </button>
                            </div>

                        </Form>
                    </div>

                </Dialog>

                <Dialog v-model:visible="openPartnerDialog" header="Uredi korisnika" :modal="true"
                    :style="{ width: '500px' }" @hide="resetPartnerDialog">
                    <template #header>
                        <div class="dialog-header">
                            <span>Dodaj partnera</span>
                        </div>
                    </template>
                    <div class="field-heading">
                        <h2 class="p-text-bold">Vrsta partnera</h2>
                        <p>Odaberi fizičkog ili pravnog partnera</p>
                        <div class="partnerSelect">
                            <SelectButton v-model="addPartnerValue" :options="partneriOptions" option-label="naziv" />
                        </div>
                    </div>
                    <form v-if="addPartnerValue.label == 'FIZ'" class="p-fluid-partner">
                        <div class="fiz-form">
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
                                        <InputText id="ime" v-model="tempPartner.epr_ime" placeholder="Ime korisnika"
                                            required />
                                    </div>
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="user" />
                                            <label for="prezime">Prezime</label>
                                        </div>
                                        <InputText id="prezime" v-model="tempPartner.epr_prezime"
                                            placeholder="Prezime korisnika" required />
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="label-container">
                                        <font-awesome-icon icon="address-card" />
                                        <label for="oib">OIB</label>
                                    </div>
                                    <InputOtp id="oib" v-model="tempPartner.epr_oib" class="otp" size="small"
                                        :length="11" integer-only required />
                                </div>
                                <div class="field">
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="envelope" />
                                            <label for="email">Email</label>
                                        </div>
                                        <InputText id="email" v-model="tempPartner.epr_email"
                                            placeholder="Email partnera" required />
                                    </div>
                                </div>
                                <div class="field field-split">
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="map-location" />
                                            <label for="adresa">Adresa</label>
                                        </div>
                                        <InputText id="adresa" v-model="tempPartner.epr_adresa" placeholder="Adresa"
                                            required />
                                    </div>
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="city" />
                                            <label for="telefon">Mjesto</label>
                                        </div>
                                        <InputText v-model="tempPartner.epr_mjesto" placeholder="Mjesto" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form v-if="addPartnerValue.label == 'PRV'" class="p-fluid-partner">
                        <div class="fiz-form">
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
                                    <InputText id="tvrtka" v-model="tempPartner.epr_naziv" placeholder="Naziv tvrtke"
                                        required />
                                </div>

                                <div class="field">
                                    <div class="label-container">
                                        <font-awesome-icon icon="address-card" />
                                        <label for="oib">OIB tvrtke</label>
                                    </div>
                                    <InputOtp id="oib" v-model="tempPartner.epr_oib" size="small" :length="11"
                                        integer-only required />
                                </div>
                                <div class="field field-split">
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="map-location" />
                                            <label for="adresa">Adresa tvrtke</label>
                                        </div>
                                        <InputText id="adresa" v-model="tempPartner.epr_adresa"
                                            placeholder="Adresa tvrtke" required />
                                    </div>
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="city" />
                                            <label for="telefon">Mjesto</label>
                                        </div>
                                        <InputText v-model="tempPartner.epr_mjesto" placeholder="Mjesto" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <template #footer>
                        <button class="p-button p-component p-button-secondary" @click="openPartnerDialog = false">
                            Odustani
                        </button>
                        <button class="submitBtn" type="submit" @click="saveNewPartner">Dodaj partnera</button>
                    </template>
                </Dialog>


                <!-- <section>
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
                                <button class="dodaj-btn" :disabled="!odabraniPartner"
                                    @click="openNewUserDialog = true">
                                    <font-awesome-icon icon="plus" />
                                    Dodaj korisnički račun
                                </button>
                            </template>
                            <template #end>
                                <button class="dodaj-partnera-btn" @click="addPartner">
                                    <font-awesome-icon icon="user-plus" /> Dodaj partnera
                                </button>
                            </template>
                        </Toolbar>
                        <DataTable v-if="selectPartneriValue?.label == 'FIZ'" v-model:filters="filterFizicke"
                            v-model:selection="odabraniPartner" :value="FIZpartneri" :rows="10" data-key="epr_id"
                            selection-mode="single" scrollable scroll-height="400px"
                            :global-filter-fields="['epr_ime', 'epr_prezime', 'epr_oib', 'epr_email', 'user_accounts_num']"
                            :loading="loading" removable-sort table-style="min-width: 50rem">

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
                                    Ukupno korisnika: <strong>{{ FIZpartneri.length }}</strong>
                                </div>
                            </template>
                            <Column header="#" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="epr_ime" header="Ime" sortable />
                            <Column field="epr_prezime" header="Prezime" sortable />
                            <Column field="epr_oib" header="OIB" />
                            <Column field="epr_email" header="Email">
                                <template #body="slotProps">
                                    {{ slotProps.data.epr_email || '--' }}
                                </template>
                            </Column>
                            <Column field="user_accounts_num" header="Broj korisničkih računa" sortable />

                        </DataTable>

                        <DataTable v-if="selectPartneriValue?.label == 'PRV'" v-model:filters="filterPravne"
                            :value="PRVpartneri" :rows="10" data-key="epr_id" selection-mode="single" scrollable
                            scroll-height="400px"
                            :global-filter-fields="['epr_naziv', 'epr_oib', 'epr_adresa', 'epr_mjesto', 'employees_num']"
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
                                    Ukupno korisnika: <strong>{{ PRVpartneri.length }}</strong>
                                </div>
                            </template>
                            <Column header="#" header-style="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="epr_naziv" header="Naziv" sortable />
                            <Column field="epr_oib" header="OIB" />
                            <Column field="epr_adresa" header="Adresa" />
                            <Column field="epr_mjesto" header="Mjesto" />
                            <Column field="employees_num" header="Broj korisnika" sortable />
                        </DataTable>

                    </div>

                    <Dialog v-model:visible="openPartnerDialog" header="Uredi korisnika" :modal="true"
                        :style="{ width: '500px' }" @hide="resetPartnerDialog">
                        <template #header>
                            <div class="dialog-header">
                                <span>Dodaj partnera</span>
                            </div>
                        </template>
                        <div class="field-heading">
                            <h2 class="p-text-bold">Vrsta partnera</h2>
                            <p>Odaberi fizičkog ili pravnog partnera</p>
                            <div class="partnerSelect">
                                <SelectButton v-model="addPartnerValue" :options="partneriOptions"
                                    option-label="naziv" />
                            </div>
                        </div>
                        <form v-if="addPartnerValue.label == 'FIZ'" class="p-fluid-partner">
                            <div class="fiz-form">
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
                                            <InputText id="ime" v-model="tempPartner.epr_ime"
                                                placeholder="Ime korisnika" required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="user" />
                                                <label for="prezime">Prezime</label>
                                            </div>
                                            <InputText id="prezime" v-model="tempPartner.epr_prezime"
                                                placeholder="Prezime korisnika" required />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="address-card" />
                                            <label for="oib">OIB</label>
                                        </div>
                                        <InputOtp id="oib" v-model="tempPartner.epr_oib" class="otp" size="small"
                                            :length="11" integer-only required />
                                    </div>
                                    <div class="field">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="envelope" />
                                                <label for="email">Email</label>
                                            </div>
                                            <InputText id="email" v-model="tempPartner.epr_email"
                                                placeholder="Email partnera" required />
                                        </div>
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="map-location" />
                                                <label for="adresa">Adresa</label>
                                            </div>
                                            <InputText id="adresa" v-model="tempPartner.epr_adresa"
                                                placeholder="Adresa tvrtke" required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="city" />
                                                <label for="telefon">Mjesto</label>
                                            </div>
                                            <InputText v-model="tempPartner.epr_mjesto" placeholder="Mjesto" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form v-if="addPartnerValue.label == 'PRV'" class="p-fluid-partner">
                            <div class="fiz-form">
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
                                        <InputText id="tvrtka" v-model="tempPartner.epr_naziv"
                                            placeholder="Naziv tvrtke" required />
                                    </div>
                                    
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="address-card" />
                                            <label for="oib">OIB tvrtke</label>
                                        </div>
                                        <InputOtp id="oib" v-model="tempPartner.epr_oib" size="small" :length="11"
                                            integer-only required />
                                    </div>
                                    <div class="field field-split">
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="map-location" />
                                                <label for="adresa">Adresa tvrtke</label>
                                            </div>
                                            <InputText id="adresa" v-model="tempPartner.epr_adresa"
                                                placeholder="Adresa tvrtke" required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="city" />
                                                <label for="telefon">Mjesto</label>
                                            </div>
                                            <InputText v-model="tempPartner.epr_mjesto" placeholder="Mjesto" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <template #footer>
                            <button class="p-button p-component p-button-secondary" @click="openPartnerDialog = false">
                                Odustani
                            </button>
                            <button class="submitBtn" type="submit" @click="saveNewPartner">Dodaj partnera</button>
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="openNewUserDialog" :modal="true" :style="{ width: '500px' }"
                        @hide="resetNewUserDialog(); hideNewUserDialog()">
                        <template #header>
                            <div class="dialog-header">
                                <font-awesome-icon icon="user-circle" size="lg" style="font-size: 20px;" />
                                <div class="credentials">
                                    <template v-if="odabraniPartner?.epr_ime">
                                        <h3 style="font-size: 20px; text-transform: capitalize;">
                                            {{
                                                odabraniPartner?.epr_ime + ' ' + odabraniPartner?.epr_prezime
                                            }}
                                        </h3>
                                        <p style="font-size: 16px; font-weight: 400;">
                                            {{
                                                odabraniPartner?.epr_email || odabraniPartner?.epr_oib
                                            }}
                                        </p>
                                    </template>
                                    <template v-else-if="noviKorisnik.tvrtka?.epr_naziv">
                                        <h3 style="font-size: 20px; text-transform: capitalize;">
                                            {{
                                                noviKorisnik.tvrtka?.epr_naziv
                                            }}
                                        </h3>
                                        <p style="font-size: 16px; font-weight: 400;">
                                            {{
                                                noviKorisnik.tvrtka?.epr_oib + ', ' + noviKorisnik.tvrtka?.epr_adresa
                                            }}
                                        </p>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <div class="form-div">
                            <Form v-slot="$formKorisnik" :initial-values="initialValuesAddKorisnik"
                                :resolver="addKorisnikResolver" :validate-on-value-update="true"
                                :validate-on-blur="true" @submit="addKorisnik">
                                <template v-if="odabraniPartner?.epr_ime">
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="building" />
                                            <label for="tvrtka">Tvrtka</label>
                                        </div>
                                        <Select id="tvrtka" name="tvrtka" filter v-model="noviKorisnik.tvrtka"
                                            :options="PRVpartneri" option-label="epr_naziv"
                                            placeholder="Odaberi tvrtku odabranog partnera" />
                                        <Message v-if="$formKorisnik.tvrtka?.invalid" severity="error" size="small"
                                            variant="simple">{{
                                                $formKorisnik.tvrtka.error.message }}</Message>
                                    </div>
                                </template>
                                <template v-else-if="noviKorisnik.tvrtka?.epr_naziv">
                                    <div class="field">
                                        <div class="label-container">
                                            <font-awesome-icon icon="user" />
                                            <label for="tvrtka">Osoba</label>
                                        </div>
                                        <Select id="tvrtka" name="tvrtka" filter v-model="noviKorisnik.osoba"
                                            :options="FIZpartneri" option-label="epr_naziv"
                                            placeholder="Odaberi osobu" />
                                        <Message v-if="$formKorisnik.tvrtka?.invalid" severity="error" size="small"
                                            variant="simple">{{
                                                $formKorisnik.tvrtka.error.message }}</Message>
                                    </div>
                                </template>
                                <hr>
                                <div class="field-heading">
                                    <h2 class="p-text-bold">Postavke korisničkog računa</h2>
                                    <p>Izmijeni raspon trajanja korisničkog računa</p>
                                </div>
                                <div class="field-split" style="margin-top: 13px;">
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="calendar-plus" />
                                            <label for="datumOd">Vrijedi od</label>
                                        </div>
                                        <DatePicker id="datumOd" v-model="noviKorisnik.razdoblje.vrijemeOd"
                                            name="datumOd" show-icon fluid icon-display="input"
                                            input-id="odabraniKorisnik.vrijeme_od" date-format="dd.mm.yy"
                                            placeholder="Vrijedi od" required />
                                        <Message v-if="$formKorisnik.datumOd?.invalid" severity="error" size="small"
                                            variant="simple">{{
                                                $formKorisnik.datumOd.error.message }}</Message>
                                    </div>
                                    <div>
                                        <div class="label-container">
                                            <font-awesome-icon icon="calendar-plus" />
                                            <label for="datumDo">Vrijedi do</label>
                                        </div>
                                        <DatePicker id="datumDo" v-model="noviKorisnik.razdoblje.vrijemeDo"
                                            name="datumDo" show-icon fluid icon-display="input"
                                            input-id="odabraniKorisnik.vrijeme_do" date-format="dd.mm.yy"
                                            placeholder="Vrijedi do" />
                                        <Message v-if="$formKorisnik.datumDo?.invalid" severity="error" size="small"
                                            variant="simple">{{
                                                $formKorisnik.datumDo.error.message }}</Message>
                                    </div>
                                </div>
                                <div class="btn-container">
                                    <button id="saveBtn" type="submit" style="margin-top: 20px;">
                                        <font-awesome-icon icon="save" class="save-icon" />
                                        Spremi
                                    </button>
                                </div>

                            </Form>
                        </div>

                    </Dialog>

                </section> -->
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { savePartner, saveUser } from '~/service/admin/users';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { objectUtil, z } from 'zod';

const toast = useToast()

const korisniciStore = useKorisniciStore();

const odabraniKorisnik = ref(null);
const odabraniPartner = ref(null);
const editKorisnikDialog = ref(false);
const openPartnerDialog = ref(false);
const deleteKorisnikaDialog = ref(false);
const openNewUserDialog = ref(false);
const loading = ref();
const expandedRows = ref([]);

const tvrtka = ref(null);
const korisnik = ref(null);
const razdoblje = ref({
    vrijemeOd: new Date(),
    vrijemeDo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())
})

watch(tvrtka, () => {
    console.log("Odabrana tvrtka: ", tvrtka.value)
})

watch(korisnik, () => {
    console.log("Odabrani korisnik: ", korisnik.value)
})

const resetNewUserDialog = ref(() => {
    tvrtka.value = null;
    korisnik.value = null;
    razdoblje.value = {
        vrijemeOd: new Date(),
        vrijemeDo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())
    }
})

const onOpenNewUserDialog = (data) => {
    const isFilled = !!data;

    console.log(data, isFilled)

    if (isFilled) {
        tvrtka.value = {
            epr_id: data.epr_id,
            epr_naziv: data.epr_naziv,
            epr_oib: data.epr_oib,
            epr_adresa: data.epr_adresa
        };
        console.log("Popunjena tvrtka: ", tvrtka.value)
    }

    openNewUserDialog.value = true;
}

const hideNewUserDialog = () => {
    odabraniKorisnik.value = null;
    openNewUserDialog.value = false
}

const initialValues = ref({
    username: '',
    password: '',
});

const initialValuesAddKorisnik = ref({
    osoba: {},
    tvrtka: {},
    datumOd: razdoblje.value.vrijemeOd,
    datumDo: razdoblje.value.vrijemeDo
});

watch(
    () => razdoblje.value,
    (noviRazdoblje) => {
        initialValuesAddKorisnik.value.datumOd = noviRazdoblje.vrijemeOd;
        initialValuesAddKorisnik.value.datumDo = noviRazdoblje.vrijemeDo;
    },
    { deep: true }
);

const addKorisnikResolver = ref(zodResolver(
    z.object({
        osoba: z.object({
            epr_ime: z.string().min(1, { message: 'Ime je obvezno' }),
            epr_prezime: z.string().min(1, { message: 'Prezime je obvezno' }),
            epr_email: z.string().nullish() //.min(1, { message: 'Email je obvezan' }).nullish(),
        }).refine((obj) => obj && obj.epr_ime && obj.epr_prezime && obj.epr_email, { message: 'Osoba je obvezna' }),
        tvrtka: z.object({
            epr_naziv: z.string().min(1, { message: 'Tvrtka je obvezna' }),
        }).refine((obj) => obj && obj.epr_naziv, { message: 'Tvrtka je obvezna' }),
        datumOd: z.date()
            .refine(
                (datum) => datum >= new Date(new Date().setHours(0, 0, 0, 0)), // Današnji datum ili kasnije
                { message: 'Početni datum mora biti današnji ili budući.' }
            ),
        datumDo: z.date()
            .refine(
                (datum) => datum > razdoblje.value.vrijemeOd,
                { message: 'Krajnji datum mora biti veći od početnog datuma.' }
            ),
    })
));


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_ime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_prezime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_tvrtka: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_oib: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_adresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_mjesto: { value: null, matchMode: FilterMatchMode.CONTAINS },
    employees_num: { value: null, matchMode: FilterMatchMode.EQUALS },
    epr_aktivan: { value: null, matchMode: 'equals' },
});
const filterFizicke = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_ime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_prezime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_oib: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_aktivan: { value: null, matchMode: 'equals' },
});
const filterPravne = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_naziv: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_oib: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_adresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
    epr_mjesto: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectPartneriValue = ref({
    label: 'FIZ',
    naziv: 'Fizički partneri'
});

const addPartnerValue = ref({
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
const FIZpartneri = computed(() => korisniciStore.fizickeOsobe);
const PRVpartneri = computed(() => korisniciStore.pravneOsobe);
const noneEmptyKorisnici = computed(() => {
    return korisniciStore.pravneOsobe
        .filter((po) => parseInt(po.employees_num) > 0)
        .map((po) => ({
            ...po,
            usersFlat: po.users
                .map((user) =>
                    `${user.epr_ime} ${user.epr_prezime} ${user.tvrtka_usluge}`
                )
                .join(' '), // Kombinira sve korisnike u jedan string za lakše pretraživanje
        }));
});
// const noneEmptyKorisnici = computed(() => korisniciStore.pravneOsobe.filter((po) => parseInt(po.employees_num) > 0));
// const partneri = ref(populatePartneri());

const onRowExpand = () => {
    console.log(noneEmptyKorisnici.value)
};

const tempPartner = ref({
    epr_tip: null,
    epr_oib: null,
    epr_naziv: null,
    epr_ime: null,
    epr_prezime: null,
    epr_mjesto: null,
    epr_adresa: null,
    epr_email: null,
})

const resetPartner = () => {
    tempPartner.value = {
        epr_tip: null,
        epr_oib: null,
        epr_naziv: null,
        epr_ime: null,
        epr_prezime: null,
        epr_mjesto: null,
        epr_adresa: null,
        epr_email: null,
    }
}

const prava = ref([]);
const vrsteIzracuna = ref([]);
const vrsteRizika = ref(null);
const vrsteImovine = ref([]);
const scenariji = ref([]);

const openedAccordionPanels = ref(['0']); // Početno otvoren prvi panel

onMounted(async () => {
    // populateUsers();
    await korisniciStore.fetchFizickeOsobe()
    await korisniciStore.fetchPravneOsobe()
})

const getSeverity = (status) => {
    switch (status) {
        case 1:
            return 'success'
        case false:
            return 'danger';
        default:
            return 'info';
    }
}

const showSuccessPartner = (osoba) => {
    toast.add({ severity: 'success', summary: 'Uspješno dodan partner', detail: `Partner: ${osoba.epr_naziv || (osoba.epr_ime + ' ' + osoba.epr_prezime)}`, life: 3000 });
};

const showErrorPartner = (osoba) => {
    toast.add({ severity: 'error', summary: 'Greška dodavanja partnera', detail: `Partner: ${osoba.epr_naziv || (osoba.epr_ime + ' ' + osoba.epr_prezime)}`, life: 3000 });
};

const showSuccesKorisnik = (osoba) => {
    toast.add({ severity: 'success', summary: 'Uspješno dodan korisnik', detail: `Korisnik: ${osoba.epr_ime} ${osoba.epr_prezime}`, life: 3000 });
}

const showErrorKorisnik = (osoba) => {
    toast.add({ severity: 'error', summary: 'Greška dodavanja korisnika', detail: `Korisnik: ${osoba.epr_ime} ${osoba.epr_prezime}`, life: 5000 });
}

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

watch(odabraniPartner, () => {
    console.log("Odabrani partner: ", odabraniPartner.value)
})

const addKorisnik = async ({ valid }) => {
    if (valid) {
        console.log("Dodajem korisnika...")
        openNewUserDialog.value = true

        const userData = {
            partnerId: korisnik.value?.epr_id,
            partnerLegalId: tvrtka.value?.epr_id,
            dateFrom: formatDateToDMY(razdoblje.value.vrijemeOd, '-'),
            dateTo: formatDateToDMY(razdoblje.value.vrijemeDo, '-'),
        }

        console.log("userData: ", userData)

        try {
            const response = await saveUser(userData);
            console.log("response: ", response)
            if (response) {
                showSuccesKorisnik(korisnik.value)
                await korisniciStore.fetchPravneOsobe()
            }
        } catch (error) {
            showErrorKorisnik(korisnik.value)
            console.log("Greška pri spremanju korisnika: ", error)
        } finally {
            openNewUserDialog.value = false
        }

    } else {
        console.error("Neispravno uneseni podaci!")
    }
}

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

const saveNewPartner = async () => {
    console.log("Odabrani partner: ", addPartnerValue.value)

    tempPartner.value.epr_tip = addPartnerValue.value.label === 'FIZ'
        ? 'FO'
        : addPartnerValue.value.label === 'PRV'
            ? 'PO'
            : null;

    tempPartner.value.epr_naziv ||= tempPartner.value.epr_ime + ' ' + tempPartner.value.epr_prezime;

    // UPPERCASE
    tempPartner.value = Object.fromEntries(
        Object.entries(tempPartner.value).map(([key, value]) => [
            key,
            key === 'epr_email' ? value : String(value).toUpperCase()
        ])
    );

    console.log("PARTNER: ", tempPartner.value)

    try {
        const response = await savePartner(tempPartner.value);
        if (response.status == 200) {
            const osoba = response.data;
            console.log("Osoba: ", osoba);
            showSuccessPartner(tempPartner.value)

            if (addPartnerValue.value.label === 'FIZ') {
                try {
                    console.log("Dohvaćanje fizickih osoba")
                    await korisniciStore.fetchFizickeOsobe();
                    console.log(korisniciStore.fizickeOsobe)
                } catch (error) {
                    console.error(error);
                }
            } else {
                try {
                    console.log("Dohvaćanje pravnih osoba")
                    await korisniciStore.fetchPravneOsobe();
                    console.log(korisniciStore.pravneOsobe)
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            console.error("Greska pri dodavanju partnera")
            showErrorPartner(tempPartner.value)
        }
    } catch (error) {
        console.error(error)
        showErrorPartner(tempPartner.value);
    } finally {
        resetPartner();
        openPartnerDialog.value = false;
    }
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

.datatable,
.toolbar {
    max-width: 1100px;
}

.inside-table {
    padding: 13px;
}

/* .dodaj-korisnika {
    font-weight: 500;
    opacity: 0.8;
    cursor: pointer;
}

.dodaj-korisnika:hover {
    opacity: 1;
    text-decoration: underline;
} */

.dodaj-korisnika {
    font-weight: 500;
    opacity: 0.4;
    cursor: not-allowed;
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

.btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.p-inputotp {
    width: 100% !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.dialog-header,
.partnerSelect {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    opacity: 1;
}

.partnerSelect {
    margin: 5px 0px 13px 0px;
}

.dialog-header * {
    font-size: 20px;
    font-weight: 700;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 8px;
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

/* .expand-icon:hover {
    cursor: pointer;
    background-color: #2ecc71;
} */

.closeDialog,
.closeDialog * {
    font-size: 16px;
}

.ukloni-btn,
.submitBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    background-color: var(--text-color);
    color: white;
}

.submitBtn * {
    color: white;
}

.submitBtn:hover {
    background-color: var(--text-color-hover);
}

.submitBtn:active {
    background-color: var(--text-color-focus);
}

.ukloni-btn {
    background-color: var(--red-soft);
    color: white;
}

.ukloni-btn * {
    color: white;
}

.ukloni-btn:hover {
    background-color: var(--red-hover);
}

.ukloni-btn:active {
    background-color: var(--red-focus);
}

.edit-btn {
    color: var(--text-color);
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
}

.edit-btn:hover {
    background-color: rgb(236, 236, 236);
}

.edit-btn:active {
    background-color: rgb(223, 223, 223);
}

.ukloni-btn:disabled,
.edit-btn:disabled {
    color: var(--text-color);
    background-color: #b0b0b0;
    cursor: not-allowed;
}

.ukloni-btn:disabled *,
.edit-btn:disabled * {
    color: var(--text-color);
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

:deep(.p-datatable-row-toggle-button) {
    width: auto !important;
    height: 24px !important;
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