<template>
  <div>
    <Toast />
    <Dialog
      :visible="modelVisible"
      header="Novi ugovor"
      :modal="true"
      :closable="false"
      :style="{ width: '600px' }"
      @hide="onHide"
      @show="onOpenNewContractDialog"
    >
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initial-values="initialValues"
        class="p-fluid"
        @submit="saveUgovor"
      >
        <div class="field">
          <div class="label-container">
            <font-awesome-icon icon="building" />
            <label for="epr_naziv">Pravna osoba za koju se dodaje ugovor</label>
          </div>
          <Select
            id="epr_naziv"
            v-model="initialValues.epr_naziv"
            :options="PRVpartneri"
            :option-label="
              (option) =>
                option.epr_naziv +
                  (', ' + option?.epr_adresa) +
                  (', ' + option?.epr_mjesto) || ''
            "
            name="epr_naziv"
            placeholder="Odaberi pravnu osobu"
            required
          />
          <Message
            v-if="$form.epr_naziv?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.epr_naziv.error.message }}</Message
          >
        </div>
        <div class="field-split">
          <div>
            <div class="label-container">
              <font-awesome-icon icon="calendar-plus" />
              <label for="datod">Datum od kada ugovor vrijedi</label>
            </div>
            <DatePicker
              id="datod"
              v-model="initialValues.ugv_datod"
              icon-display="input"
              input-id="datod"
              name="ugv_datod"
              show-icon
              date-format="dd.mm.yy"
              placeholder="Datum od"
              required
            />
            <Message
              v-if="$form.ugv_datod?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ugv_datod.error.message }}</Message
            >
          </div>
          <div>
            <div class="label-container">
              <font-awesome-icon icon="calendar-minus" />
              <label for="datdo">Datum do kada ugovor vrijedi</label>
            </div>
            <DatePicker
              id="datdo"
              v-model="initialValues.ugv_datdo"
              icon-display="input"
              name="ugv_datdo"
              show-icon
              input-id="datdo"
              date-format="dd.mm.yy"
              placeholder="Datum do"
            />
            <Message
              v-if="$form.ugv_datdo?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ugv_datdo.error.message }}</Message
            >
            <Message
              v-if="
                areDatesInvalid(initialValues.ugv_datod, initialValues.ugv_datdo)
              "
              severity="error"
              size="small"
              variant="simple"
              >Datum od mora biti manji od datuma do</Message
            >
          </div>
        </div>
        <div class="field-split">
          <div>
            <div class="label-container">
              <label for="ugv_kpkr_max">Broj izračuna za KPKR</label>
              <font-awesome-icon
                v-tooltip.top="
                  'Broj izračuna za Kalkulator procjene klimatskih rizika'
                "
                icon="info-circle"
              />
            </div>
            <InputNumber
              id="ugv_kpkr_max"
              v-model="initialValues.ugv_kpkr_max"
              name="ugv_kpkr_max"
              show-buttons
              :step="10"
              placeholder="0"
              @focus="selectInputText"
            />
            <Message
              v-if="$form.ugv_kpkr_max?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ugv_kpkr_max.error.message }}</Message
            >
          </div>
          <div>
            <div class="label-container">
              <!-- <font-awesome-icon icon="dollar-sign" /> -->
              <label for="ugv_kesp_max">Broj izračuna za KESP</label>
              <font-awesome-icon
                v-tooltip.top="
                  'Broj izračuna za Kalkulator emisija stakleničkih plinova'
                "
                icon="info-circle"
              />
            </div>
            <InputNumber
              id="ugv_kesp_max"
              v-model="initialValues.ugv_kesp_max"
              show-buttons
              :step="10"
              name="ugv_kesp_max"
              placeholder="0"
              @focus="selectInputText"
            />
            <Message
              v-if="$form.ugv_kesp_max?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.ugv_kesp_max.error.message }}</Message
            >
          </div>
        </div>
        <div class="btn-container">
          <Button
            class="p-button p-component p-button-secondary"
            @click="modelVisible = false"
          >
            Odustani
          </Button>
          <button id="saveBtn" type="submit" style="margin-top: 20px">
            <font-awesome-icon icon="save" class="save-icon" />
            Spremi
          </button>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { saveContract } from "~/service/admin/users";

const korisniciStore = useKorisniciStore();
const toast = useToast();

const props = defineProps({
  visible: Boolean,
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

const initialValues = ref({
  epr_naziv: "",
  ugv_datugv: "",
  ugv_datod: "",
  ugv_datdo: "",
  ugv_kpkr_max: "",
  ugv_kesp_max: "",
});

// const today = new Date();

const PRVpartneri = computed(() => korisniciStore.pravneOsobe);

const resolver = ref(
  zodResolver(
    z
      .object({
        epr_naziv: z.preprocess((val) => {
          // Ako je vrijednost objekt, izvlačimo samo naziv tvrtke.
          if (typeof val === "object" && val !== null) {
            return val.epr_naziv;
          }
          return val;
        }, z.string().trim().min(1, { message: "Tvrtka je obavezna." })),
        ugv_datugv: z.preprocess(
          (arg) => {
            if (arg instanceof Date) return arg;
            if (typeof arg === "string" && arg.trim() !== "")
              return new Date(arg);
            return undefined;
          },
          z
            .date({
              required_error: "Početni datum je obavezan.",
              invalid_type_error: "Početni datum nije valjan.",
            })
            .refine(
              (date) =>
                date.getTime() >=
                new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
              { message: "Početni datum mora biti danas ili kasnije." }
            )
        ),
        ugv_datod: z.preprocess(
          (arg) => {
            if (arg instanceof Date) return arg;
            if (typeof arg === "string" && arg.trim() !== "")
              return new Date(arg);
            return undefined;
          },
          z
            .date({
              required_error: "Datum od je obavezan.",
              invalid_type_error: "Datum od nije valjan.",
            })
            .refine(
              (date) =>
                date.getTime() >=
                new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
              { message: "Datum od mora biti danas ili kasnije." }
            )
        ),
        ugv_datdo: z.preprocess(
          (arg) => {
            if (arg instanceof Date) return arg;
            if (typeof arg === "string" && arg.trim() !== "")
              return new Date(arg);
            return undefined;
          },
          z
            .date({
              required_error: "Datum do je obavezan.",
              invalid_type_error: "Datum do nije valjan.",
            })
            .refine(
              (date) =>
                date.getTime() >=
                new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
              { message: "Datum do mora biti danas ili kasnije." }
            )
        ),
        ugv_kpkr_max: z.coerce
          .number({
            invalid_type_error: "Broj mora biti veći od nula.",
          })
          .refine((num) => num > 0, {
            message: "Broj mora biti veći od nula.",
          }),
        ugv_kesp_max: z.coerce
          .number({
            invalid_type_error: "Broj mora biti veći od nula.",
          })
          .refine((num) => num > 0, {
            message: "Broj mora biti veći od nula.",
          }),
      })
      .refine((data) => data.ugv_datdo.getTime() > data.ugv_datod.getTime(), {
        message:
          "Datum do kada ugovor vrijedi mora biti jednak ili nakon datuma od.",
        path: ["ugv_datdo"],
      })
  )
);

const areDatesInvalid = (date1, date2) => {
  // Provjeri jesu li oba datuma definirana i jesu li instanca Date
  if (date1 && date2 && date1 instanceof Date && date2 instanceof Date) {
    // Ako datum "od" je veći od datuma "do", redoslijed je neispravan
    return date1.getTime() > date2.getTime();
  }
  return false;
};

const selectInputText = (event) => {
  const target = event.target;
  if (target && typeof target.select === "function") {
    target.select();
  }
};

const onOpenNewContractDialog = () => {};
const onHide = () => {
  initialValues.value = {
    epr_naziv: "",
    ugv_datugv: "",
    ugv_datod: "",
    ugv_datdo: "",
    ugv_kpkr_max: "",
    ugv_kesp_max: "",
  };
  modelVisible.value = false;
  emits("update:visible", false);
};

const saveUgovor = async ({ valid }) => {
  if (
    valid &&
    !areDatesInvalid(initialValues.value.ugv_datod, initialValues.value.ugv_datdo)
  ) {
    // Save ugovor to the database
    console.log("Spremanje ugovora:", initialValues.value);
    const data = {
      contractId: null,
      legalPersonId: initialValues.value.epr_naziv?.epr_id,
      number: null,
      date: formatDateToDMY(new Date(), "-"),
      dateFrom: formatDateToDMY(initialValues.value?.ugv_datod, "-"),
      dateTo: formatDateToDMY(initialValues.value?.ugv_datdo, "-"),
      maxKpkrNumber: initialValues.value.ugv_kpkr_max,
      maxKespNumber: initialValues.value.ugv_kesp_max,
    };

    console.log("Prije spremanja ugovora: ", data);

    try {
      const response = await saveContract(data);
      if (response.status === 200) {
        console.log("Ugovor spremljen:", response);
        toast.add({
          severity: "success",
          summary: "Uspješno spremljen ugovor",
          detail: `${initialValues.value.epr_naziv?.epr_naziv}.`,
          life: 3000,
        })
        await korisniciStore.fetchUgovori();
      }
    } catch (error) {
      console.error("Greska pri spremanju ugovora:", error);
      toast.add({
        severity: "error",
        summary: "Greska pri spremanju ugovora",
        detail: `${initialValues.value.epr_naziv?.epr_naziv}.`,
        life: 3000,
      })
    } finally {
      onHide();
    }
  } else {
    // Display validation errors
    console.error("Validacija nije prošla:");
  }
};
</script>

<style scoped>
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 13px;
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
</style>
