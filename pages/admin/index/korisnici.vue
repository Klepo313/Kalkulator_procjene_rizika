<template>
  <div class="body">
    <Toast />
    <ConfirmDialog group="mail">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="mail-container">
          <div class="mail-header">
            <font-awesome-icon icon="envelope" />
            <span>{{ message.title }}</span>
          </div>
          <div class="mail-body">
            <p>{{ message.message }}</p>
          </div>
          <div class="mail-footer">
            <Button
              label="Odustani"
              severity="secondary"
              class="p-button-text"
              @click="rejectCallback()"
            />
            <button class="dodaj-btn" @click="acceptCallback()">
              <font-awesome-icon icon="paper-plane" />
              Pošalji
            </button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <main>
      <h1>Dodavanje korisnika</h1>
      <div class="main-content">
        <section>
          <div>
            <h2>Popis korisnika</h2>
            <p>
              Popis korisnika za pravne osobe koje su zabilježene u sustavu.
            </p>
          </div>
          <UserList
            @open-new-user-dialog="openNewUserDialogHandler"
            @open-partner-dialog="partnerDialog = true"
            @send-mail="sendMail"
            @edit-user="editUser"
          />
        </section>
      </div>
    </main>
    <EditUserDialog
      v-if="selectedUser"
      :visible="editUserDialog"
      :user="selectedUser"
      @update:visible="editUserDialog = $event"
      @save="handleSaveUser"
      @send-mail="sendMail"
    />
    <NewUserDialog
      :visible="newUserDialog"
      :tvrtke="PRVpartneri"
      :osobe="searchFIZosobe"
      :tvrtka="selectedTvrtka"
      @update:visible="newUserDialog = $event"
      @submit="handleNewUser"
    />
    <PartnerDialog
      :visible="partnerDialog"
      @update:visible="partnerDialog = $event"
      @submit="handleNewPartner"
    />
    <MailLogsDialog
      :visible="mailLogsDialog"
      :mailLogs="mailLogs"
      :user="selectedUser"
      @update:visible="mailLogsDialog = $event"
    />
    <footer />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import UserList from "~/components/admin/lists/UserList.vue";
import EditUserDialog from "~/components/admin/dialogs/EditUserDialog.vue";
import MailLogsDialog from "~/components/admin/dialogs/MailLogsDialog.vue";
import NewUserDialog from "~/components/admin/dialogs/NewUserDialog.vue";
import PartnerDialog from "~/components/admin/dialogs/PartnerDialog.vue";
import { useKorisniciStore } from "#build/imports";
import { checkIfEmailIsSent } from "~/service/admin/users";
import { getPravaForUser, getUser } from "~/service/user/user";

const editUserDialog = ref(false);
const newUserDialog = ref(false);
const partnerDialog = ref(false);
const mailLogsDialog = ref(false);
const selectedUser = ref(null);
const selectedTvrtka = ref(null);
const prava = ref([]);
const mailLogs = ref([
  { id: 1, naziv: "Generirani korisnički podataci", date: "12/12/2024" },
  { id: 2, naziv: "Uređivanje korisničkih podataka", date: "11/11/2024" },
  { id: 3, naziv: "Generiranje e-pošte", date: "10/10/2024" },
]);
const confirm = useConfirm();
const toast = useToast();

const korisniciStore = useKorisniciStore();
const PRVpartneri = computed(() => korisniciStore.pravneOsobe);
const searchFIZosobe = computed(() => korisniciStore.searchFizickeOsobe);

const openNewUserDialogHandler = (data) => {
  // Ako se proslijedi podatak o pravnoj osobi, možete ga koristiti za popunjavanje forme
  selectedTvrtka.value = null;
  const isFilled = !!data;

  if (isFilled) {
    selectedTvrtka.value = findPRVpartner(data?.epr_id);
    // console.log("Popunjena tvrtka: ", selectedTvrtka.value);
  }

  newUserDialog.value = true;
};

const findPRVpartner = (epr_id) => {
  return PRVpartneri.value.find((partner) => partner.epr_id === epr_id);
};

const sendMail = (eko_id, eko_par_id_za) => {
  // console.log("eko_id: ", eko_id);
  // console.log("eko_par_id_za: ", eko_par_id_za);

  let infoToastId = null;

  infoToastId = toast.add({
    severity: "info",
    summary: "Slanje e-pošte...",
    detail: "Molimo pričekajte dok se e-pošta ne pošalje korisniku.",
    life: Infinity,
    closable: false,
  });

  confirm.require({
    group: "mail",
    title: "Želiš li poslati pristupne korisničke podatke korisniku?",
    message:
      "Poslat će se e-pošta korisniku sa njegovim pristupnim podacima za korištenje aplikacije.",
    header: "Slanje e-pošte",
    icon: "pi pi-envelope",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: async () => {
      try {
        await checkIfEmailIsSent(eko_id);

        // Uklanjanje info toasta
        toast.remove(infoToastId);

        toast.add({
          severity: "success",
          summary: "Uspješno poslan email",
          detail: "Poslan je email za željenog korisnika",
          life: 3000,
        });
      } catch (error) {
        toast.remove(infoToastId);

        toast.add({
          severity: "error",
          summary: "Greška pri slanju e-pošte",
          detail: error.message,
          life: 3000,
        });
      } finally {
        await korisniciStore.fetchKorisniciForLegalPartner(eko_par_id_za);
      }
    },
    reject: () => {
      toast.remove(infoToastId); // U slučaju da korisnik odbije slanje
    },
  });
};

const editUser = async (data) => {
  // console.log("Korisnik za uređivanje: ", data?.eko_id);

  try {
    const userData = await getUser(data?.eko_id);
    if (userData) {
      Object.keys(userData).forEach((key) => {
        if (key === "eko_datod" || key === "eko_datdo") {
          const originalDate = new Date(userData[key]);
          // Postavljamo datum bez vremenskog dijela
          data[key] = new Date(
            originalDate.getFullYear(),
            originalDate.getMonth(),
            originalDate.getDate()
          );
        } else {
          data[key] = userData[key];
        }
      });
    }
    selectedUser.value = data;
    editUserDialog.value = true;
  } catch (error) {
    // console.error(error);
  }

  // console.log("Popunjeni korisnik: ", data);
};

const handleSaveUser = (user) => {
  // Logika za spremanje promjena korisnika
  editUserDialog.value = false;
};

const handleNewUser = (userData) => {
  // Logika za dodavanje novog korisnika
};

const handleNewPartner = (partnerData) => {
  // Logika za dodavanje partnera
  partnerDialog.value = false;
};
</script>

<style scoped>
* {
  color: var(--text-color);
  opacity: 1 !important;
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
}

h2 {
  font-size: 16px;
  color: var(--text-color);
}

main {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto;
  gap: 34px;
  height: 100%;
}

main > div {
  width: 100%;
  height: 100%;
}

.main-content,
section {
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.mail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 26px;
}

.mail-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.mail-body {
  padding: 5px 0px;
  /* border-left: 1px solid var(--text-color); */
}

.mail-body p {
  font-size: 1rem;
}

.mail-header * {
  font-size: 1.2rem;
  font-weight: bold;
}

.mail-dialog-footer,
.mail-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

section {
  max-width: auto;
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

#saveBtn:hover > .save-icon {
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
#saveBtn:disabled > .save-icon {
  background-color: rgb(232, 232, 232);
  color: var(--text-color);
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

/* Ostali globalni stilovi, npr. tipografija, helper klase, keyframes itd. */
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
