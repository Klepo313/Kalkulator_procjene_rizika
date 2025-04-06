<template>
  <Toast />
  <Dialog
    v-model:visible="modelVisible"
    :modal="true"
    :closable="false"
    header="Dodaj korisnički račun"
    :style="{ width: '600px' }"
    @hide="onHide()"
    @show="updateFIZosobe()"
  >
    <div class="form-div">
      <Form
        v-slot="$formKorisnik"
        :initial-values="initialValuesAddKorisnik"
        :resolver="addKorisnikResolver"
        :validate-on-value-update="true"
        :validate-on-blur="true"
        class="form"
        @submit="addKorisnik"
      >
        <div class="field">
          <div class="label-container">
            <font-awesome-icon icon="building" />
            <label for="tvrtka">Tvrtka</label>
          </div>
          <Select
            id="tvrtka"
            key="epr_id"
            v-model="tvrtka"
            name="tvrtka"
            filter
            :options="PRVpartneri"
            :option-label="
              (option) =>
                option.epr_naziv +
                  (', ' + option?.epr_adresa) +
                  (', ' + option?.epr_mjesto) || ''
            "
            placeholder="Odaberi tvrtku odabranog partnera"
          />

          <Message
            v-if="$formKorisnik.tvrtka?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formKorisnik.tvrtka.error.message }}</Message
          >
        </div>
        <div class="field">
          <div class="label-container">
            <font-awesome-icon icon="user" />
            <label for="osoba">Osoba</label>
          </div>
          <Select
            id="osoba"
            v-model="osoba"
            name="osoba"
            filter
            :options="searchFIZosobe"
            :option-label="
              (option) =>
                option.epr_naziv +
                ' (' +
                (option?.epr_email || option?.epr_oib) +
                ')'
            "
            placeholder="Odaberi osobu koju želiš dodati kao korisnika"
          />
          <Message
            v-if="$formKorisnik.osoba?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formKorisnik.osoba.error.message }}</Message
          >
        </div>
        <span v-if="osoba && !osoba?.epr_email">
          <p style="color: red; font-weight: bold">
            Korisnik {{ osoba?.epr_naziv }} nema spremljen email. Molimo unesite
            email
          </p>
        </span>
        <hr />
        <div class="field-heading">
          <h2 class="p-text-bold">Postavke korisničkog računa</h2>
          <p>Izmijeni raspon trajanja korisničkog računa</p>
        </div>
        <div class="field-split" style="margin-top: 13px">
          <div>
            <div class="label-container">
              <font-awesome-icon icon="calendar-plus" />
              <label for="datumOd">Vrijedi od</label>
            </div>
            <DatePicker
              id="datumOd"
              v-model="razdoblje.vrijemeOd"
              name="datumOd"
              show-icon
              fluid
              icon-display="input"
              input-id="odabraniKorisnik.vrijeme_od"
              date-format="dd.mm.yy"
              placeholder="Vrijedi od"
              required
            />
            <Message
              v-if="$formKorisnik.datumOd?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $formKorisnik.datumOd.error.message }}</Message
            >
          </div>
          <div>
            <div class="label-container">
              <font-awesome-icon icon="calendar-plus" />
              <label for="datumDo">Vrijedi do</label>
            </div>
            <DatePicker
              id="datumDo"
              v-model="razdoblje.vrijemeDo"
              name="datumDo"
              show-icon
              fluid
              icon-display="input"
              input-id="odabraniKorisnik.vrijeme_do"
              date-format="dd.mm.yy"
              placeholder="Vrijedi do"
            />
            <Message
              v-if="$formKorisnik.datumDo?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $formKorisnik.datumDo.error.message }}</Message
            >
          </div>
        </div>
        <!-- <div>
          <UserRights :user="dohvaceniKorisnik" />
        </div> -->
        <div class="checkbox-container">
          <!--v-if="osoba?.eko_id && osoba?.epr_email"-->
          <Checkbox
            v-model="slanjeMaila"
            input-id="slanjeMaila"
            value="true"
            name="slanjeMaila"
          />
          <label for="slanjeMaila"
            >Dodavanjem ovog korisničkog računa želim da se automatski pošalje
            email korisniku sa njegovim pristupnim korisničkim podacima.</label
          >
        </div>
        <div class="btn-container">
          <Button severity="secondary" @click="modelVisible = false">
            Odustani
          </Button>
          <button
            id="saveBtn"
            type="submit"
            style="margin-top: 20px"
            :disabled="!$formKorisnik.valid || btnAlreadySubmitted"
          >
            <font-awesome-icon icon="save" class="save-icon" />
            Spremi
          </button>
        </div>
      </Form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useKorisniciStore } from "#build/imports";
import { checkIfEmailIsSent, saveUser } from "~/service/admin/users";
import UserRights from "../UserRights";

const korisniciStore = useKorisniciStore();
const toast = useToast();

const props = defineProps({
  visible: Boolean,
  tvrtke: { type: Array, default: () => [] },
  osobe: { type: Array, default: () => [] },
  tvrtka: { type: Object, default: () => {} },
});
const emits = defineEmits(["update:visible", "submit"]);

const modelVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", val);
  },
});

// console.log("tt: ", props.tvrtka);

const tvrtka = ref(null);
const osoba = ref(null);
const dohvaceniKorisnik = ref(null);
const searchFIZosobe = computed(() => korisniciStore.searchFizickeOsobe);
const FIZpartneri = computed(() => korisniciStore.fizickeOsobe);
const PRVpartneri = computed(() => korisniciStore.pravneOsobe);
const datumOd = ref(new Date());
const datumDo = ref(
  new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate()
  )
);

const razdoblje = ref({
  vrijemeOd: datumOd.value,
  vrijemeDo: datumDo.value,
});

const slanjeMaila = ref(false);

const initialValuesAddKorisnik = ref({
  osoba: {},
  tvrtka: props.tvrtka || {},
  datumOd: razdoblje.value.vrijemeOd,
  datumDo: razdoblje.value.vrijemeDo,
});

const addKorisnikResolver = zodResolver(
  z.object({
    // tvrtka: z.string({ message: "Tvrtka je obavezna." }),
    tvrtka: z.object({
      epr_naziv: z.string().min(1, { message: "Tvrtka je obavezna." }),
    }),
    osoba: z.object({
      epr_ime: z.string().min(1, "Ime je obavezno"),
      epr_prezime: z.string().min(1, "Prezime je obavezno"),
      epr_email: z
        .string()
        .email("Email nije ispravan")
        .min(1, "Email je obavezan"),
    }),
    datumOd: z
      .date()
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Početni datum mora biti danas ili kasnije",
      }),
    datumDo: z.date().refine((date) => date > datumOd.value, {
      message: "Krajnji datum mora biti veći od početnog",
    }),
  })
);

const updateFIZosobe = () => {
  korisniciStore.fetchFizickeOsobe();
  tvrtka.value = props.tvrtka || {};
  initialValuesAddKorisnik.value.tvrtka = props.tvrtka || {};
  // console.log("tvrtka: ", tvrtka.value);
  // console.log(
  //   "initialValuesAddKorisnik.value.tvrtka: ",
  //   initialValuesAddKorisnik.value.tvrtka
  // );
};

const optionLabel = (option) =>
  `${option.epr_naziv} (${option.epr_email || option.epr_oib})`;

watch(
  () => datumOd.value,
  (newVal) => {
    initialValues.value.datumOd = newVal;
  }
);
watch(
  () => datumDo.value,
  (newVal) => {
    initialValues.value.datumDo = newVal;
  }
);

watch(
  () => props.visible,
  (val) => {
    modelVisible.value = val;
  }
);

watch(
  () => razdoblje.value,
  (noviRazdoblje) => {
    initialValuesAddKorisnik.value.datumOd = noviRazdoblje.vrijemeOd;
    initialValuesAddKorisnik.value.datumDo = noviRazdoblje.vrijemeDo;
  },
  { deep: true }
);

watch(
  () => props.tvrtka,
  (newVal) => {
    initialValuesAddKorisnik.value.tvrtka = newVal || {};
    tvrtka.value = newVal || {};
  },
  { immediate: true }
);

watch(tvrtka, (newVal) => {
  // tvrtka.value = newVal;
  // console.log("tvrtka: ", tvrtka.value);
});

const onHide = () => {
  tvrtka.value = null;
  osoba.value = null;
  razdoblje.value = {
    vrijemeOd: new Date(),
    vrijemeDo: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDate()
    ),
  };
  initialValuesAddKorisnik.value = {
    osoba: {},
    tvrtka: {},
    datumOd: razdoblje.value.vrijemeOd,
    datumDo: razdoblje.value.vrijemeDo,
  };
  modelVisible.value = false;
  emits("update:visible", false);
};

const showSuccesKorisnik = (osoba) => {
  toast.add({
    severity: "success",
    summary: "Uspješno dodan korisnik",
    detail: `Korisnik: ${osoba.epr_ime} ${osoba.epr_prezime}`,
    life: 3000,
  });
};

const showErrorKorisnik = (osoba) => {
  toast.add({
    severity: "error",
    summary: "Greška dodavanja korisnika",
    detail: `Korisnik: ${osoba.epr_ime} ${osoba.epr_prezime}`,
    life: 5000,
  });
};

const btnAlreadySubmitted = ref(false);
const addKorisnik = async ({ valid }) => {
  if (valid) {
    // console.log("Dodajem korisnika...", korisnik.value)

    const userData = {
      // eko_id: korisnik.value?.eko_id,
      partnerId: osoba.value?.epr_id,
      partnerLegalId: tvrtka.value?.epr_id,
      dateFrom: formatDateToDMY(razdoblje.value.vrijemeOd, "-"),
      dateTo: formatDateToDMY(razdoblje.value.vrijemeDo, "-"),
    };

    // console.log("userData: ", userData)

    try {
      btnAlreadySubmitted.value = true;
      const response = await saveUser(userData);
      // console.log("response: ", response)
      if (response) {
        showSuccesKorisnik(osoba.value);
        await korisniciStore.fetchPravneOsobe();
        korisniciStore.fizickeOsobe = [];

        const newUserId = response?.userId;
        // console.log(newUserId);
        // console.log( korisniciStore.pravneOsobe , korisniciStore.fizickeOsobe)

        // if(newUserId) {
        //   try {
        //     const fetchedUser = await getUser(newUserId)
        //     dohvaceniKorisnik.value = newUserId;
        //   } catch (error) {

        //   }
        // }
        // console.log("slanjemaila: ", slanjeMaila.value);
        if (slanjeMaila.value) {
          try {
            await checkIfEmailIsSent(newUserId);
            // const isSent = notifyData?.isNotified || notifyData?.message || undefined
            // // console.log("notifyData: ", notifyData, "isSent: ", isSent)
          } catch (e) {
            // console.log(e)
            showError("Greška pri slanju e-pošte korisniku!");
          }
        }

        korisniciStore.expandedRows = [];
        await korisniciStore.fetchPravneOsobe();
        korisniciStore.fizickeOsobe = [];
      }
    } catch (error) {
      showErrorKorisnik(osoba.value);
      // console.log("Greška pri spremanju korisnika: ", error)
    } finally {
      btnAlreadySubmitted.value = false;
      modelVisible.value = false;
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Podaci sa forme nisu validni",
      detail: `Provjerite podatke sa forme.`,
      life: 3000,
    });
  }
};
</script>

<style scoped>
hr {
  margin: 13px 0px;
  width: 100%;
  border: none;
  border-top: var(--border-line-sidebar);
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
.label-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.btn-container {
  margin-top: 13px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.checkbox-container {
  margin-top: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

#saveBtn {
  margin: 0 !important;
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

:deep(.p-checkbox-checked .p-checkbox-box) {
  border-color: var(--text-color) !important;
  background: var(--text-color) !important;
}
</style>
