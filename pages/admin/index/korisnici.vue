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
                            Odaberi partnera kojemu želiš izmjeniti podatke ili ga ukloniti iz sustava
                            aplikacije. <br>
                            Tko je partner, a tko korisnik? <u style="font-style: italic; cursor: pointer;">Pročitaj
                                ovdje</u>.
                        </p>
                    </div>
                    <div class="datatable">
                        <DataTable v-model:filters="filters" v-model:expandedRowGroups="expandedGroups"
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
                            <Column header="Ime i prezime" filter-field="ime" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <font-awesome-icon icon="user-circle" size="lg" />
                                        <span>{{ data.ime + " " + data.prezime }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="Pretraži po imenu"
                                        @input="filterCallback()" />
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
                            :style="{ width: '450px' }" @hide="resetOdabraniKorisnik">
                            <template #header>
                                <div class="dialog-header">
                                    <font-awesome-icon icon="user-pen" />
                                    <span>Uredi korisnika</span>
                                </div>
                            </template>
                            <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="p-fluid"
                                @submit.prevent="saveKorisnik">
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
                                                <button id="reset" class="resetBtn" type="reset" @click="updateKorime">
                                                    <font-awesome-icon icon="rotate-right" class="button-icon" />
                                                </button>
                                            </div>
                                            <InputText id="korime" name="username" v-model="odabraniKorisnik.korime"
                                                placeholder="Korisničko ime korisnika" readonly required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="lock" />
                                                <label for="lozinka">Lozinka</label>
                                                <button id="reset" class="resetBtn" type="reset" @click="updateLozinka">
                                                    <font-awesome-icon icon="rotate-right" class="button-icon" />
                                                </button>
                                            </div>
                                            <Password id="lozinka" v-model="odabraniKorisnik.lozinka" name="password"
                                                :feedback="false" toggleMask fluid placeholder="Lozinka korisnika"
                                                type="password" readonly required />
                                            <template v-if="$form.password?.invalid">
                                                <Message v-for="(error, index) of $form.password.errors" :key="index"
                                                    severity="error" size="small" variant="simple">{{ error.message }}
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
                                            <DatePicker id="datod" v-model="odabraniKorisnik.vrijeme_od" show-icon fluid
                                                icon-display="input" input-id="odabraniKorisnik.vrijeme_od"
                                                date-format="dd.mm.yy" placeholder="Vrijedi od" required />
                                        </div>
                                        <div>
                                            <div class="label-container">
                                                <font-awesome-icon icon="calendar-plus" />
                                                <label for="datdo">Vrijedi do</label>
                                            </div>
                                            <DatePicker id="datdo" v-model="odabraniKorisnik.vrijeme_do" show-icon fluid
                                                icon-display="input" input-id="odabraniKorisnik.vrijeme_do"
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
                                <div class="section">
                                    <div class="field-heading">
                                        <h2 class="p-text-bold">Prava korisnika</h2>
                                        <p>Izmjeni prava korisnika na korištenje aplikacija te prava unutar aplikacija
                                        </p>
                                    </div>
                                    <Accordion value="0">
                                        <AccordionPanel value="0">
                                            <AccordionHeader class="acc-header">
                                                <Checkbox value="1" />
                                                <span class="acc-header-title">
                                                    <img src="../../../public/static/images/kpkr_logo_slim.svg"
                                                        alt="kpkr_logo">
                                                    <span class="acc-header-title-text">Kalkulator procjene klimatskih
                                                        rizika</span>
                                                </span>
                                            </AccordionHeader>
                                            <AccordionContent>
                                                <p class="m-0">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut
                                                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco
                                                    laboris nisi ut aliquip ex ea commodo
                                                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                                                    esse cillum dolore eu
                                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                                                    proident, sunt in culpa qui
                                                    officia deserunt mollit anim id est laborum.
                                                </p>
                                            </AccordionContent>
                                        </AccordionPanel>

                                        <AccordionPanel value="1">
                                            <AccordionHeader class="acc-header">
                                                <Checkbox value="2" />
                                                <span class="acc-header-title">
                                                    <img src="../../../public/static/images/kesp_logo_slim.svg"
                                                        alt="kesp">
                                                    <span class="acc-header-title-text">Kalkulator emisija stakleničkih
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
                                                    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                                                    sed quia consequuntur
                                                    magni dolores eos qui ratione voluptatem sequi nesciunt.
                                                    Consectetur, adipisci velit, sed
                                                    quia non numquam eius modi.
                                                </p>
                                            </AccordionContent>
                                        </AccordionPanel>
                                    </Accordion>
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

                        <Dialog v-model:visible="deleteKorisnikaDialog" :style="{ width: '450px' }"
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
            </div>
        </main>
        <footer />
    </div>
</template>

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import z from 'zod';

definePageMeta({
    middleware: [
        'auth'
    ],
});

const odabraniKorisnik = ref(null);
const editKorisnikDialog = ref(false);
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
    tvrtka: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tvrtka_usluge: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: 'equals' },
});

const imena = ['Ivan', 'Marko', 'Josip', 'Petar', 'Slavko', 'Antonio', 'Mehmedaga', 'Jusuf', 'Izet', 'Stjepan'];
const prezimena = ['Jonjić', 'Slavuj', 'Bigec', 'Krstić', 'Mujkić', 'Hađičumbrović', 'Koliker'];
const tvrtke = ['Digitalna Inovacija', 'Kreativna Rješenja', 'Globalna Tehnologija', 'Inovativni Servisi', 'Tehno Eksperti', 'Digitalni Horizonti'];
const tvrtke_usluge = ['Pametne Solucije', 'Inovativna Tehnologija', 'Tehno Partneri', 'Digitalni Lideri', 'Tehno Rješenja', 'Pametni Sistemi', 'Inovativni Projekti', 'Tehno Uspon', 'Digitalni Servisi', 'Tehno Inovacije', 'Pametni Projekti'];
const statuses = ref(['Aktivan', 'Neaktivan', 'Na čekanju', 'Odbijen']);

const korisnici = ref([]);

const brojKorisnika = 100; // Broj korisnika za generiranje
const sada = new Date();

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
        vrijemeOdDate.setHours(0, 0, 0, 0); // Postavi vrijeme na 00:00:00
        const vrijemeOdFormatted = formatDateToDMY(vrijemeOdDate, '.');

        const vrijemeDoDate = new Date(vrijemeOdDate.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)); // do godinu dana od vrijeme_od
        vrijemeDoDate.setHours(0, 0, 0, 0); // Postavi vrijeme na 00:00:00
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
            ime,
            prezime,
            tvrtka,
            tvrtka_usluge,
            status,
            vrijeme_od: vrijemeOdFormatted,
            vrijeme_do: vrijemeDoFormatted,
            korime,
            lozinka,
        });
    }

    korisnici.value.sort((a, b) => a.tvrtka.localeCompare(b.tvrtka));
    console.log(korisnici.value);
}

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


const resetOdabraniKorisnik = () => {
    odabraniKorisnik.value = null; // Ako imate originalne podatke ili postavite prazne vrijednosti
};

const saveKorisnik = () => {
    // Spremite promjene u bazu podataka ili napravite potrebnu akciju
    // Npr. apiCallToUpdateKorisnik(odabraniKorisnik.value);
    editKorisnikDialog.value = false;
};

const editKorisnik = (korisnik) => {
    if (korisnik) {
        console.log("Odabrani korisnik: ", korisnik);
        odabraniKorisnik.value = korisnik;
        editKorisnikDialog.value = true;
    }
};

</script>


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
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 13px;
}

.acc-header,
.acc-header-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.label-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
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