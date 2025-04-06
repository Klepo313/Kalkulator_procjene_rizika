<template>
  <Toast />
  <Dialog
    v-model:visible="modelVisible"
    header="Dodaj partnera"
    :modal="true"
    :closable="false"
    :style="{ width: '600px' }"
    @hide="resetPartnerDialog"
  >
    <div class="field-heading">
      <h2 class="p-text-bold">Vrsta partnera</h2>
      <p>Odaberi fizičkog ili pravnog partnera</p>
      <div class="partnerSelect">
        <SelectButton
          v-model="addPartnerValue"
          :options="partneriOptions"
          option-label="naziv"
        />
      </div>
    </div>

    <!-- Forma za fizičkog partnera -->
    <template v-if="addPartnerValue.label === 'FIZ'">
      <Form
        v-slot="$formPartner"
        :initial-values="initialValueAddPartner.FIZ"
        :resolver="addPartnerResolverFIZ"
        :validate-on-value-update="true"
        :validate-on-blur="true"
        class="form"
        @submit="saveNewPartner"
      >
        <div class="section">
          <div class="field field-split">
            <div class="field">
              <div class="label-container">
                <font-awesome-icon icon="user" />
                <label for="ime">Ime</label>
              </div>
              <InputText
                id="ime"
                v-model="tempPartner.epr_ime"
                name="epr_ime"
                placeholder="Ime korisnika"
              />
              <Message
                v-if="$formPartner.epr_ime?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $formPartner.epr_ime.error.message }}
              </Message>
            </div>
            <div class="field">
              <div class="label-container">
                <font-awesome-icon icon="user" />
                <label for="prezime">Prezime</label>
              </div>
              <InputText
                id="prezime"
                v-model="tempPartner.epr_prezime"
                name="epr_prezime"
                placeholder="Prezime korisnika"
              />
              <Message
                v-if="$formPartner.epr_prezime?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $formPartner.epr_prezime.error.message }}
              </Message>
            </div>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="address-card" />
              <label for="oib">OIB</label>
            </div>
            <InputOtp
              id="oib"
              v-model="tempPartner.epr_oib"
              name="epr_oib"
              :length="11"
              integer-only
            />
            <Message
              v-if="$formPartner.epr_oib?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_oib.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="envelope" />
              <label for="email">Email</label>
            </div>
            <InputText
              id="email"
              v-model="tempPartner.epr_email"
              name="epr_email"
              placeholder="Email partnera"
            />
            <Message
              v-if="$formPartner.epr_email?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_email.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="map-location" />
              <label for="adresa">Adresa</label>
            </div>
            <InputText
              id="adresa"
              v-model="tempPartner.epr_adresa"
              name="epr_adresa"
              placeholder="Adresa"
            />
            <Message
              v-if="$formPartner.epr_adresa?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_adresa.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="city" />
              <label for="mjesto">Mjesto</label>
            </div>
            <InputText
              id="mjesto"
              v-model="tempPartner.epr_mjesto"
              name="epr_mjesto"
              placeholder="Mjesto"
            />
            <Message
              v-if="$formPartner.epr_mjesto?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_mjesto.error.message }}
            </Message>
          </div>
        </div>
        <div class="btn-container">
          <button
            class="p-button p-component p-button-secondary"
            @click="modelVisible = false"
          >
            Odustani
          </button>
          <button id="saveBtn" type="submit">Dodaj partnera</button>
        </div>
      </Form>
    </template>

    <!-- Forma za pravnog partnera -->
    <template v-if="addPartnerValue.label === 'PRV'">
      <Form
        v-slot="$formPartner"
        :initial-values="initialValueAddPartner.PRV"
        :resolver="addPartnerResolverPRV"
        :validate-on-value-update="true"
        :validate-on-blur="true"
        class="form"
        @submit="saveNewPartner"
      >
        <div class="section">
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="building" />
              <label for="naziv">Naziv tvrtke</label>
            </div>
            <InputText
              id="naziv"
              v-model="tempPartner.epr_naziv"
              name="epr_naziv"
              placeholder="Naziv tvrtke"
            />
            <Message
              v-if="$formPartner.epr_naziv?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_naziv.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="address-card" />
              <label for="oib">OIB tvrtke</label>
            </div>
            <InputOtp
              id="oib"
              v-model="tempPartner.epr_oib"
              name="epr_oib"
              :length="11"
              integer-only
            />
            <Message
              v-if="$formPartner.epr_oib?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_oib.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="map-location" />
              <label for="adresa">Adresa tvrtke</label>
            </div>
            <InputText
              id="adresa"
              v-model="tempPartner.epr_adresa"
              name="epr_adresa"
              placeholder="Adresa tvrtke"
            />
            <Message
              v-if="$formPartner.epr_adresa?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_adresa.error.message }}
            </Message>
          </div>
          <div class="field">
            <div class="label-container">
              <font-awesome-icon icon="city" />
              <label for="mjesto">Mjesto</label>
            </div>
            <InputText
              id="mjesto"
              v-model="tempPartner.epr_mjesto"
              name="epr_mjesto"
              placeholder="Mjesto"
            />
            <Message
              v-if="$formPartner.epr_mjesto?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $formPartner.epr_mjesto.error.message }}
            </Message>
          </div>
        </div>
        <div class="btn-container">
          <Button
            class="p-button p-component p-button-secondary"
            @click="modelVisible = false"
          >
            Odustani
          </Button>
          <button id="saveBtn" type="submit">Dodaj partnera</button>
        </div>
      </Form>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { savePartner } from "~/service/admin/users";
import { useKorisniciStore } from "#build/imports";

const props = defineProps({
  visible: Boolean,
});
const emits = defineEmits(["update:visible", "submit"]);

const toast = useToast();

const korisniciStore = useKorisniciStore();

const modelVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", val);
  },
});

const addPartnerValue = ref({
  label: "FIZ",
  naziv: "Fizički partner",
});

// write watch method to clear tempPartner on addPartnerValue change
watch(addPartnerValue, () => {
  reset();
});

const initialValueAddPartner = ref({
  FIZ: {
    epr_ime: "",
    epr_prezime: "",
    epr_email: "",
    epr_oib: "",
    epr_adresa: "",
    epr_mjesto: "",
  },
  PRV: {
    epr_naziv: "",
    epr_oib: "",
    epr_adresa: "",
    epr_mjesto: "",
  },
});

const partneriOptions = ref([
  { label: "FIZ", naziv: "Fizički partner" },
  { label: "PRV", naziv: "Pravni partner" },
]);

const addPartnerResolverFIZ = zodResolver(
  z.object({
    epr_ime: z.string().min(1, { message: "Ime je obavezno" }),
    epr_prezime: z.string().min(1, { message: "Prezime je obavezno" }),
    epr_oib: z.string().superRefine((_, ctx) => {
      // Koristimo vrijednost iz tempPartner varijable kao cjelinu
      const oibValue = tempPartner.value.epr_oib || "";
      if (oibValue.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `OIB mora imati točno 11 znakova, trenutno ima ${oibValue.length} znakova`,
        });
      }
    }),
    epr_email: z
      .string()
      .min(1, { message: "Email je obavezan" })
      .email("Email nije ispravnog formata (primjer@tvrtka.com)"),
    epr_adresa: z.string().min(1, { message: "Adresa je obavezna" }),
    epr_mjesto: z.string().min(1, { message: "Mjesto je obavezno" }),
  })
);

const addPartnerResolverPRV = zodResolver(
  z.object({
    epr_naziv: z.string().min(1, { message: "Tvrtka je obavezna" }),
    epr_oib: z.string().superRefine((_, ctx) => {
      // Koristimo vrijednost iz tempPartner varijable kao cjelinu
      const oibValue = tempPartner.value.epr_oib || "";
      if (oibValue.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `OIB mora imati točno 11 znakova, trenutno ima ${oibValue.length} znakova`,
        });
      }
    }),
    epr_adresa: z.string().min(1, { message: "Adresa je obavezna" }),
    epr_mjesto: z.string().min(1, { message: "Mjesto je obavezno" }),
  })
);

const showSuccessPartner = (osoba) => {
  toast.add({
    severity: "success",
    summary: "Uspješno dodan partner",
    detail: `Partner: ${
      osoba.epr_naziv || osoba.epr_ime + " " + osoba.epr_prezime
    }`,
    life: 3000,
  });
};

const showErrorPartner = (osoba) => {
  toast.add({
    severity: "error",
    summary: "Greška dodavanja partnera",
    detail: `Partner: ${
      osoba.epr_naziv || osoba.epr_ime + " " + osoba.epr_prezime
    }`,
    life: 3000,
  });
};

const saveNewPartner = async ({ valid }) => {
  // console.log("tempPartner: ", tempPartner.value)
  if (valid) {
    tempPartner.value.epr_tip =
      addPartnerValue.value.label === "FIZ"
        ? "FO"
        : addPartnerValue.value.label === "PRV"
        ? "PO"
        : null;

    tempPartner.value.epr_naziv ||=
      tempPartner.value.epr_prezime + " " + tempPartner.value.epr_ime;

    // UPPERCASE
    tempPartner.value = Object.fromEntries(
      Object.entries(tempPartner.value).map(([key, value]) => [
        key,
        key === "epr_email" ? value : String(value).toUpperCase(),
      ])
    );

    // console.log("PARTNER: ", tempPartner.value)

    try {
      const response = await savePartner(tempPartner.value);
      if (response.status == 200) {
        const osoba = response.data;
        // console.log("Osoba: ", osoba);
        showSuccessPartner(tempPartner.value);

        if (addPartnerValue.value.label === "FIZ") {
          try {
            // console.log("Dohvaćanje fizickih osoba")
            await korisniciStore.fetchFizickeOsobe();
            // console.log(korisniciStore.fizickeOsobe)
          } catch (error) {
            // console.error(error);
          }
        } else {
          try {
            // console.log("Dohvaćanje pravnih osoba")
            await korisniciStore.fetchPravneOsobe();
            korisniciStore.fizickeOsobe = [];
            // console.log(korisniciStore.pravneOsobe)
          } catch (error) {
            // console.error(error);
          }
        }
        // await korisniciStore.fetchOsobe();
      } else {
        // console.error("Greska pri dodavanju partnera");
        showErrorPartner(tempPartner.value);
      }
    } catch (error) {
      // console.error(error);
      showErrorPartner(tempPartner.value);
    } finally {
      resetPartnerDialog();
      modelVisible.value = false;
    }
  }
};

const tempPartner = ref({
  epr_tip: "",
  epr_oib: "",
  epr_naziv: "",
  epr_ime: "",
  epr_prezime: "",
  epr_mjesto: "",
  epr_adresa: "",
  epr_email: "",
});

const initialFIZ = ref({
  epr_ime: "",
  epr_prezime: "",
  epr_email: "",
  epr_oib: "",
  epr_adresa: "",
  epr_mjesto: "",
});
const initialPRV = ref({
  epr_naziv: "",
  epr_oib: "",
  epr_adresa: "",
  epr_mjesto: "",
});

const resolverFIZ = zodResolver(
  z.object({
    epr_ime: z.string().min(1, { message: "Ime je obavezno" }),
    epr_prezime: z.string().min(1, { message: "Prezime je obavezno" }),
    epr_oib: z.string().refine((val) => val.length === 11, {
      message: "OIB mora imati točno 11 znakova",
    }),
    epr_email: z.string().min(1, { message: "Email je obavezan" }).email(),
    epr_adresa: z.string().min(1, { message: "Adresa je obavezna" }),
    epr_mjesto: z.string().min(1, { message: "Mjesto je obavezno" }),
  })
);

const resolverPRV = zodResolver(
  z.object({
    epr_naziv: z.string().min(1, { message: "Naziv je obavezan" }),
    epr_oib: z.string().refine((val) => val.length === 11, {
      message: "OIB mora imati točno 11 znakova",
    }),
    epr_adresa: z.string().min(1, { message: "Adresa je obavezna" }),
    epr_mjesto: z.string().min(1, { message: "Mjesto je obavezno" }),
  })
);

const cancel = () => {
  emits("update:visible", false);
  reset();
};

const reset = () => {
  tempPartner.value = {
    epr_tip: "",
    epr_oib: "",
    epr_naziv: "",
    epr_ime: "",
    epr_prezime: "",
    epr_mjesto: "",
    epr_adresa: "",
    epr_email: "",
  };
};

const submitFIZ = ({ valid }) => {
  if (valid) {
    tempPartner.value.epr_tip = "FO";
    if (!tempPartner.value.epr_naziv) {
      tempPartner.value.epr_naziv =
        tempPartner.value.epr_ime + " " + tempPartner.value.epr_prezime;
    }
    emits("submit", tempPartner.value);
    reset();
  }
};

const submitPRV = ({ valid }) => {
  if (valid) {
    tempPartner.value.epr_tip = "PO";
    emits("submit", tempPartner.value);
    reset();
  }
};

watch(
  () => props.visible,
  (val) => {
    modelVisible.value = val;
  }
);
const resetPartnerDialog = () => {
  emits("update:visible", false);
  reset();
};
</script>

<style scoped>
.partnerSelect {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 5px 0px 13px 0px;
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
.field-split {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.field-split > div {
  width: 300px;
  display: flex;
  gap: 5px;
  flex-direction: column;
  flex: 1;
}
.label-container,
.section {
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

.section {
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 13px;
}

.section > * {
  width: 100%;
}

#oib {
  justify-content: space-between;
}

#saveBtn {
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
</style>
