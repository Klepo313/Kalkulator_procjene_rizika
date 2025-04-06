<template>
  <Toast />
  <Dialog
    :visible="modelVisible"
    header="Uredi korisnika"
    :modal="true"
    :closable="false"
    :style="{ width: '1000px' }"
    @hide="resetOdabraniKorisnik"
    @show="onOpenEditUserDialog"
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-header-text">
          <strong>{{ user.epr_ime + " " + user.epr_prezime }}</strong>
          <span>{{ user.epr_email || user.epr_oib }}</span>
        </div>
      </div>
    </template>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="0" class="tab-header">
          <font-awesome-icon
            :icon="[activeTab === '0' ? 'fas' : 'far', 'address-card']"
          />
          Postavke korisničkog računa
        </Tab>
        <Tab value="1" class="tab-header">
          <font-awesome-icon
            :icon="[activeTab === '1' ? 'fas' : 'far', 'user']"
          />
          Osobni podaci korisnika
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <!-- Renderiraj formu samo ako props.user ima vrijednost (npr. eko_id) -->
          <div v-if="localUser && localUser?.eko_datod && localUser?.eko_datdo">
            <Form
              v-slot="$form"
              :resolver="resolver"
              :initial-values="initialValues"
              class="p-fluid"
              @submit="save"
            >
              <!-- Ostatak forme -->
              <div class="section section-razdoblje">
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
                    <DatePicker
                      id="datod"
                      name="eko_datod"
                      v-model="localUser.eko_datod"
                      icon-display="input"
                      input-id="user.eko_datod"
                      show-icon
                      date-format="dd.mm.yy"
                      placeholder="Vrijedi od"
                      required
                    />
                    <Message
                      v-if="$form.eko_datod?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                    >
                      {{ $form.eko_datod.error.message }}
                    </Message>
                  </div>
                  <div>
                    <div class="label-container">
                      <font-awesome-icon icon="calendar-plus" />
                      <label for="datdo">Vrijedi do</label>
                    </div>
                    <DatePicker
                      id="datdo"
                      name="eko_datdo"
                      v-model="localUser.eko_datdo"
                      icon-display="input"
                      show-icon
                      input-id="user.eko_datdo"
                      date-format="dd.mm.yy"
                      placeholder="Vrijedi do"
                    />
                    <Message
                      v-if="$form.eko_datdo?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                    >
                      {{ $form.eko_datdo.error.message }}
                    </Message>
                  </div>
                </div>
                <div class="field status-field">
                  <span>Status: </span>
                  <span>
                    <Tag
                    :value="user.aktivan ? 'Aktivan' : 'Neaktivan'"
                    :severity="getSeverity(user.aktivan)"
                    />
                  </span>
                  <span style="font-style: italic; opacity: 0.8;">
                    ({{ getTimeLeft(user.eko_datdo) }})
                  </span>
                </div>
                <!-- <div v-if="user.aktivan" class="field status-field">
                  <span>
                    Račun aktivan još: {{ getTimeLeft(user.eko_datdo) }}.
                  </span>
                </div> -->
              </div>
              <hr />
              <div class="section">
                <div class="field-heading">
                  <h2 class="p-text-bold">Prava korisnika</h2>
                  <p>
                    Izmjeni prava korisnika na korištenje aplikacija te prava
                    unutar aplikacija
                  </p>
                </div>
                <UserRights :user="user" />
              </div>
              <div class="section footer">
                <Button severity="secondary" @click="close"> Odustani </Button>
                <button class="submitBtn" type="submit">Spremi promjene</button>
              </div>
            </Form>
          </div>
          <!-- Prikaz loading state-a dok se podaci ne učitaju -->
          <div v-else>Učitavanje podataka...</div>
        </TabPanel>
        <TabPanel value="1">
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { getUser } from "~/service/user/user";
import UserRights from "../UserRights.vue";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Message from "primevue/message";
import Tag from "primevue/tag";

const emits = defineEmits(["update:visible", "save"]);

const props = defineProps({
  visible: Boolean,
  user: { type: Object, default: () => ({}) },
});

// Computed property za prikaz dialoga
const modelVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", val);
  },
});

const activeTab = ref("0");

// Koristi computed property da uvijek radiš s najnovijim korisničkim podacima
const localUser = ref(props.user);
// console.log("localUser: ", localUser.value);

// Inicijaliziraj initialValues na temelju user-a
const initialValues = ref({
  eko_datod: localUser.value?.eko_datod || "",
  eko_datdo: localUser.value?.eko_datdo || "",
});

// Ažuriraj initialValues kad se localUser promijeni
watch(
  () => localUser.value,
  (newUser) => {
    if (newUser && newUser.eko_id) {
      initialValues.value.eko_datod = newUser.eko_datod;
      initialValues.value.eko_datdo = newUser.eko_datdo;
    }
  },
  { immediate: true }
);

// Resolver za validaciju datuma
const resolver = zodResolver(
  z.object({
    eko_datod: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string" && arg.trim() !== "") {
          const date = new Date(arg);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      z.date({
        required_error: "Datum je obavezan.",
        invalid_type_error: "Datum nije valjan.",
      })
    ),
    eko_datdo: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string" && arg.trim() !== "") {
          const date = new Date(arg);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      z.date({
        required_error: "Datum je obavezan.",
        invalid_type_error: "Datum nije valjan.",
      })
    ),
  })
);

const close = () => {
  emits("update:visible", false);
};

const save = async ({ valid }) => {
  if (valid) {
    // Logika za spremanje podataka...
    close();
  }
};
</script>

<style scoped>
.dialog-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.dialog-header-text {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}
.dialog-header-text strong {
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
}
.dialog-header-text span {
  opacity: 0.7;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.section.section-razdoblje {
  max-width: 500px;
}
.section.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
.tab-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.p-tab,
.p-tab-active {
  padding: 0px 10px;
  opacity: 0.7 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.p-tab-active {
  background: none !important;
  border-color: var(--text-color) !important;
  border-radius: 0;
  color: var(--text-color) !important;
  opacity: 1 !important;
}

:deep(.p-tablist-active-bar) {
  background: var(--text-color) !important;
}
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.p-fluid-partner {
  display: flex;
  flex-direction: column;
  gap: 26px;
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
.field-split > div {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.field-split > div {
  flex-direction: column;
  flex: 1;
}

.field-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.status-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

hr {
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

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.p-checkbox-checked .p-checkbox-box) {
  border-color: var(--text-color) !important;
  background: var(--text-color) !important;
}

.btn-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.section.prava {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prava-field,
.prava-field-label,
.prava-field-checkbox {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.prava-field {
  flex-direction: column;
  background-color: var(--admin-bg-color);
  border: var(--border);
  padding: 13px;
  border-radius: 5px;
}

.podprava,
.podprava-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.podprava {
  border-left: var(--border);
  padding-left: 25px;
}

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
</style>
