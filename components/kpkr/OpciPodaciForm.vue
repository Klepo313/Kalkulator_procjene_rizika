<template>
  <div class="form-container">
    <Toast />

    <Form
      v-slot="$form"
      ref="formRef"
      :initial-values="initialValues"
      :resolver="currentResolver"
      :validate-on-blur="true"
      @submit="onFormSubmit"
      :class="['form', { 'full-width': !isEmptyIzracun }]">
      <!-- POLJA -->

      <div class="grid-item">
        <label>Naziv predloška:</label>
        <div class="grid-item-field">
          <InputText
            v-model="initialValues.naziv"
            name="naziv"
            placeholder="Naziv predloška"
            fluid
            :readonly="!isEmptyIzracun" />
          <Message
            v-if="$form.naziv?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.naziv.error.message }}</Message
          >
        </div>
      </div>

      <div class="grid-item">
        <label>Datum:</label>
        <div class="grid-item-field">
          <DatePicker
            v-model="initialValues.datum"
            name="datum"
            show-icon
            icon-display="input"
            date-format="dd.mm.yy"
            placeholder="Unesi datum"
            fluid
            readonly />
          <Message
            v-if="$form.datum?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.datum.error.message }}</Message
          >
        </div>
      </div>

      <div class="grid-item">
        <label>Vrsta izračuna:</label>
        <div class="grid-item-field">
          <template v-if="isEmptyIzracun && !vrstaIzracuna?.tvz_id">
            <Select
              v-model="initialValues.vrstaIzracuna"
              name="vrstaIzracuna"
              :options="vrsteIzracuna"
              option-label="tvz_naziv"
              placeholder="Vrsta izračuna"
              @change="(e) => handleVrstaIzracunaChange(e, $form)" />
          </template>
          <template v-else>
            <InputText
              :value="initialValues.vrstaIzracuna?.tvz_naziv"
              readonly
              fluid />
          </template>
          <Message
            v-if="$form.vrstaIzracuna?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.vrstaIzracuna.error.message }}</Message
          >
        </div>
      </div>

      <div class="grid-item">
        <label>Katastarska općina:</label>
        <div class="grid-item-field">
          <template v-if="isEmptyIzracun">
            <AutoComplete
              v-model="initialValues.katastarskaOpcina"
              name="katastarskaOpcina"
              :suggestions="filteredOpcine"
              :option-label="optionLabelOpcina"
              placeholder="Katastarska općina"
              @complete="searchOpcine"
              @item-select="(e) => handleOpcinaSelect(e, $form)" />
          </template>
          <template v-else>
            <InputText
              :value="
                initialValues.katastarskaOpcina?.kop_sif +
                ' - ' +
                initialValues.katastarskaOpcina?.kop_naziv
              "
              readonly
              fluid />
          </template>
          <Message
            v-if="$form.katastarskaOpcina?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.katastarskaOpcina.error.message }}</Message
          >
        </div>
      </div>

      <div class="grid-item">
        <label>Katastarska čestica:</label>
        <div class="grid-item-field">
          <template v-if="isEmptyIzracun">
            <AutoComplete
              v-model="initialValues.katastarskaCestica"
              name="katastarskaCestica"
              :suggestions="filteredCestice"
              option-label="kcs_sif"
              placeholder="Katastarska čestica (opcionalno)"
              :disabled="!$form.katastarskaOpcina?.value"
              @complete="searchCestice"
              :readonly="!isEmptyIzracun" />
          </template>
          <template v-else>
            <InputText
              :value="initialValues.katastarskaCestica"
              placeholder="/"
              readonly
              fluid />
          </template>
          <font-awesome-icon
            v-if="loadingCestice"
            icon="spinner"
            spin
            class="loading-icon" />
          <Message
            v-if="$form.katastarskaCestica?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.katastarskaCestica.error.message }}</Message
          >
        </div>
      </div>

      <div v-if="vrstaIzracuna?.tvz_naziv !== 'Djelatnost'" class="grid-item">
        <label>Vrsta imovine:</label>
        <div class="grid-item-field">
          <template v-if="isEmptyIzracun">
            <Select
              v-model="initialValues.vrstaImovine"
              name="vrstaImovine"
              :options="vrsteImovine"
              option-label="tvo_naziv"
              placeholder="Vrsta imovine"
              :disabled="disableVrstaImovine" />
            <Message
              v-if="$form.vrstaImovine?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.vrstaImovine.error.message }}</Message
            >
          </template>
          <template v-else>
            <InputText :value="initialValues.vrstaImovine" readonly fluid />
          </template>
        </div>
      </div>

      <div v-if="vrstaIzracuna?.tvz_naziv !== 'Imovina'" class="grid-item">
        <label>Djelatnost:</label>
        <div class="grid-item-field">
          <template v-if="isEmptyIzracun">
            <AutoComplete
              v-model="initialValues.djelatnost"
              name="djelatnost"
              forceSelection
              :suggestions="filteredDjelatnosti"
              :option-label="optionLabelDjelatnost"
              placeholder="Djelatnost"
              :disabled="disableDjelatnost"
              @complete="searchDjelatnosti"
              @item-select="(e) => handleDjelatnostSelect(e, $form)"
              :readonly="!isEmptyIzracun"
              class="autocomplete" />

            <!-- appendTo="self"
              panelClass="inherit-width"
              :panelStyle="{ whiteSpace: 'pre-wrap' }" -->
            <Message
              v-if="$form.djelatnost?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.djelatnost.error.message }}</Message
            >
          </template>
          <!-- :placeholder="initialValues.djelatnost ? 'Djelatnost' : '/'" -->
          <template v-else>
            <Textarea
              :value="
                initialValues.djelatnost?.djl_sif +
                '\n' +
                initialValues.djelatnost?.djl_naziv
              "
              readonly
              autoResize
              rows="1"
              class="readonly-textarea" />
          </template>
        </div>
      </div>

      <div v-if="vrstaIzracuna?.tvz_naziv !== 'Imovina'" class="grid-item">
        <label>Skupina djelatnosti:</label>
        <InputText
          v-tooltip.top="isEmptyIzracun ? `Polje nije za unos` : ''"
          v-model="initialValues.skupinaDjelatnosti"
          name="skupinaDjelatnosti1"
          placeholder="Skupina djelatnosti"
          class="readonly-polja"
          disabled
          fluid
          readonly />
      </div>

      <div class="grid-item" style="height: 39px">
        <label>Klimatski scenarij:</label>
        <div class="grid-item-field radiogroup-container">
          <template v-if="isEmptyIzracun">
            <div
              v-for="s in scenariji"
              :key="s.tvs_id"
              :title="s.tvs_naziv"
              class="radiogroup">
              <RadioButton
                v-model="initialValues.scenarij"
                :inputId="s.tvs_id"
                :value="s.tvs_sif"
                :disabled="s.tvs_sif === 'SSP'"
                name="scenarij" />
              <label class="radio-label" :for="s.tvs_id">{{ s.tvs_sif }}</label>
            </div>
          </template>

          <template v-else>
            <div v-if="initialValues.scenarij" class="radiogroup">
              <RadioButton
                :modelValue="initialValues.scenarij"
                :inputId="initialValues.scenarij"
                :value="initialValues.scenarij"
                name="scenarij" />
              <label class="radio-label" :for="initialValues.scenarij">
                {{ initialValues.scenarij }}
              </label>
            </div>
          </template>
        </div>

        <Message
          v-if="$form.scenarij?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $form.scenarij.error.message }}
        </Message>
      </div>

      <div class="grid-item">
        <label>Ispostava:</label>
        <InputText
          v-tooltip.top="isEmptyIzracun ? `Polje nije za unos` : ''"
          v-model="initialValues.ispostava"
          name="ispostava1"
          placeholder="Ispostava"
          class="readonly-polja"
          disabled
          fluid
          readonly />
      </div>

      <div class="grid-item">
        <label>Područni ured:</label>
        <InputText
          v-tooltip.top="isEmptyIzracun ? `Polje nije za unos` : ''"
          v-model="initialValues.podrucniUred"
          name="podrucniUred1"
          placeholder="Područni ured"
          class="readonly-polja"
          disabled
          fluid
          readonly />
      </div>

      <div class="grid-item">
        <label class="napomena">Napomena:</label>
        <Textarea
          v-model="initialValues.napomena"
          name="napomena"
          :placeholder="isEmptyIzracun ? 'Napomena' : '/'"
          rows="5"
          autoResize
          :readonly="!isEmptyIzracun" />
      </div>
      <Button
        id="submitBtn"
        type="submit"
        severity="secondary"
        :class="{ filled: isEmptyIzracun }"
        icon="pi pi-save"
        :label="
          isEmptyIzracun ? 'Spremi i zaključaj' : 'Predložak je zaključan'
        "
        :disabled="!isEmptyIzracun" />

      <span v-if="isEmptyIzracun" class="advice-container">
        <p>
          Potrebno je popuniti sva obvezna polja kako bi se predložak mogao
          spremiti i kako biste mogli nastaviti u sljedeći korak.
        </p>
      </span>

      <!-- <Fieldset
        legend="Form States"
        class="h-80 overflow-auto"
        @click="resetForm">
        <pre class="whitespace-pre-wrap">{{ $form }}</pre>
      </Fieldset> -->
    </Form>

    <!-- <Fieldset
      v-if="isEmptyIzracun"
      legend="Popis prava na izračun"
      class="fieldset">
      <p class="m-0">Imovina 5</p>
      <p class="m-0">Djelatnost 5</p>
    </Fieldset> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { useOpciStore } from "~/stores/main-store";

const opciStore = useOpciStore();
const toast = useToast();

const emit = defineEmits<{
  (e: "save", formData: any): void;
  (e: "save-success", payload: { success: boolean; newId?: string }): void;
}>();

const props = defineProps<{
  aizId: string | null;
  izracun: any;
  vrsteIzracuna: any[];
  vrsteImovine: any[];
  djelatnosti: any[];
  scenariji: any[];
  katastarskeOpcine: any[];
  isSaveSuccess: boolean;
  vrstaIzracunaQuery?: { tvz_id: string | number; tvz_naziv: string } | null;
}>();

const idIzracuna = ref<string | null>(props.aizId);

// Ispravno reaktivno stanje praznog izračuna
const isEmptyIzracun = computed(() => !idIzracuna.value);

const formRef = ref();
const loadingCestice = ref(false);
const vrstaIzracuna = computed(() =>
  props.izracun?.aiz_tvz_id
    ? {
        tvz_id: props.izracun.aiz_tvz_id,
        tvz_naziv: props.izracun.tvz_naziv,
      }
    : null || props.vrstaIzracunaQuery || null
);

console.log("vrstaIzracuna", vrstaIzracuna.value);

const disableDjelatnost = computed(
  () => isEmptyIzracun.value && vrstaIzracuna.value?.tvz_naziv === "Imovina"
);
const disableVrstaImovine = computed(
  () => isEmptyIzracun.value && vrstaIzracuna.value?.tvz_naziv === "Djelatnost"
);

console.log("disableDjelatnost", disableDjelatnost.value);
console.log("disableVrstaImovine", disableVrstaImovine.value);

const filteredOpcine = ref<any[]>([]);
const filteredCestice = ref<any[]>([]);
const filteredDjelatnosti = ref<any[]>([]);

const today = new Date();

const initialValues = reactive({
  naziv: props.izracun?.aiz_opis || "",
  datum: props.izracun?.aiz_datum ? new Date(props.izracun.aiz_datum) : today,
  vrstaIzracuna: props.izracun?.aiz_tvz_id
    ? { tvz_id: props.izracun.aiz_tvz_id, tvz_naziv: props.izracun.tvz_naziv }
    : vrstaIzracuna.value || null,
  katastarskaOpcina: props.izracun?.aiz_kop_id
    ? {
        kop_id: props.izracun.aiz_kop_id,
        kop_sif: props.izracun.kop_sif,
        kop_naziv: props.izracun.kop_naziv,
      }
    : null,
  katastarskaCestica: props.izracun?.kcs_sif || null,
  vrstaImovine: props.izracun?.tvo_naziv || null,
  djelatnost: props.izracun?.aiz_djl_id
    ? {
        djl_id: props.izracun?.aiz_djl_id,
        djl_sif: props.izracun?.djl_sif,
        djl_naziv: props.izracun?.djl_naziv,
      }
    : null,
  skupinaDjelatnosti: props.izracun?.djl_naziv_sk || "",
  scenarij:
    props.scenariji.find((s) => s.tvs_id === props.izracun?.tvs_id)?.tvs_sif ||
    "RCP",
  ispostava: props.izracun?.isp_naziv || "",
  podrucniUred: props.izracun?.puk_naziv || "",
  napomena: props.izracun?.aiz_napomena || "",
});

const requiredNullableObject = (errorMessage: string) =>
  z
    .object({})
    .nullable()
    .refine((val) => val !== null, { message: errorMessage });

const schemaDefault = z.object({
  datum: z.date({ required_error: "Datum je obavezan." }),
  vrstaIzracuna: requiredNullableObject("Vrsta izračuna je obavezna"),

  katastarskaOpcina: z
    .union([z.object({ kop_naziv: z.string() }), z.string(), z.null()])
    .refine((val) => val && typeof val === "object" && val.kop_naziv, {
      message: "Katastarska općina je obavezna",
    }),

  katastarskaCestica: z
    .union([
      z.object({
        kcs_sif: z.string().min(1),
      }),
      z.string(),
      z.null(),
      z.literal(""),
    ])
    .refine((val) => !val || (typeof val === "object" && !!val.kcs_sif), {
      message: "Katastarska čestica nije validna",
    }),

  scenarijId: z.string().min(1, { message: "Klimatski scenarij je obavezan." }),
});

const isFormDirty = () => {
  if (!formRef.value) return false;

  return Object.values(formRef.value.fields).some((field: any) => {
    return field.states?.dirty === true;
  });
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.reset();
};

watch(
  () => props.isSaveSuccess, // Moraš staviti funkciju koja vraća vrijednost propa
  (newVal) => {
    console.log("isSaveSuccess promijenjen:", newVal);
    if (newVal) {
      resetForm();
    }
  }
);

const confirmNavigation = () => {
  return window.confirm(
    "Imate nespremljene promjene. Jeste li sigurni da želite napustiti stranicu?"
  );
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isFormDirty()) {
    event.preventDefault();
    event.returnValue = ""; // mora ostati, iako ignoriraju tekst
  }
};

onBeforeRouteLeave((_to, _from, next) => {
  if (isFormDirty()) {
    confirmNavigation() ? next() : next(false);
  } else {
    next();
  }
});

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

const currentResolver = ref(zodResolver(schemaDefault));

watchEffect(() => {
  const r = vrstaIzracuna.value;
  if (r?.tvz_id) {
    console.log("vrstaIzracuna u watch", r.tvz_naziv);
    currentResolver.value = zodResolver(buildSchema(r.tvz_naziv));
  }
});

function buildSchema(vrstaIzracuna: string) {
  let dynamicFields = {};

  if (vrstaIzracuna === "Imovina") {
    disableDjelatnost.value = true;
    disableVrstaImovine.value = false;
    dynamicFields = {
      vrstaImovine: z
        .object({ tvo_naziv: z.string() })
        .nullable()
        .refine((val) => val !== null, {
          message: "Vrsta imovine je obavezna.",
        }),
      djelatnost: z.any().optional(), // omogućujemo null
    };
  } else if (vrstaIzracuna === "Djelatnost") {
    disableDjelatnost.value = false;
    disableVrstaImovine.value = true;
    dynamicFields = {
      djelatnost: z.union([
        z.object({
          djl_naziv: z.string().min(1, "Djelatnost je obavezna."),
        }),
        z.any().refine((val) => false, { message: "Djelatnost je obavezna." }),
      ]),

      vrstaImovine: z.any().optional(), // omogućujemo null
    };
  } else {
    disableDjelatnost.value = false;
    disableVrstaImovine.value = false;
    dynamicFields = {
      vrstaImovine: z.any().optional(),
      djelatnost: z.any().optional(),
    };
  }

  return schemaDefault.extend(dynamicFields);
}

function handleVrstaIzracunaChange(event: any, $form: any) {
  console.log("$form", $form);
  const value = event.value?.tvz_naziv;

  currentResolver.value = zodResolver(buildSchema(value));

  initialValues.vrstaImovine = null;
  initialValues.djelatnost = null;
  initialValues.skupinaDjelatnosti = "";
}

async function handleOpcinaSelect(event: any, _$form: any) {
  const opcina = event.value;

  if (opcina?.kop_id) {
    loadingCestice.value = true;
    initialValues.katastarskaCestica = null;

    try {
      await opciStore.fetchParticlesForMunicipalities(opcina.kop_id);
      filteredCestice.value = opciStore.katastarske_cestice || [];

      initialValues.ispostava = opcina?.isp_naziv || "";
      initialValues.podrucniUred = opcina?.isp_naziv || "";
    } catch (error) {
      console.error("Greška kod dohvaćanja čestica:", error);
    } finally {
      loadingCestice.value = false;
    }
  }
}

function handleDjelatnostSelect(event: any, _$form: any) {
  const djelatnost = event.value;
  //   $form.skupinaDjelatnosti.value = djelatnost?.djl_skp_naziv || "";
  initialValues.skupinaDjelatnosti = djelatnost?.djl_skp_naziv || "";
}

function searchOpcine(event: any) {
  const query = event.query.toLowerCase();

  const startsWithMatches = props.katastarskeOpcine.filter((item) => {
    const combined = `${item.kop_sif} - ${item.kop_naziv}`.toLowerCase();
    return combined.startsWith(query);
  });

  const containsMatches = props.katastarskeOpcine.filter((item) => {
    const combined = `${item.kop_sif} - ${item.kop_naziv}`.toLowerCase();
    return !combined.startsWith(query) && combined.includes(query);
  });

  filteredOpcine.value = [...startsWithMatches, ...containsMatches];
}

function searchCestice(event: any) {
  const query = event.query.toLowerCase();

  if (!query) {
    filteredCestice.value = opciStore.katastarske_cestice || [];
    return;
  }

  const startsWith: any[] = [];
  const contains: any[] = [];

  for (const cestica of opciStore.katastarske_cestice) {
    const kcsSif = cestica.kcs_sif?.toLowerCase() || "";

    if (kcsSif.startsWith(query)) {
      startsWith.push(cestica);
    } else if (kcsSif.includes(query)) {
      contains.push(cestica);
    }
  }

  filteredCestice.value = [...startsWith, ...contains];
}

function searchDjelatnosti(event: any) {
  const query = event.query.toLowerCase();

  const startsWithMatches = props.djelatnosti.filter((item) => {
    const combined = `${item.djl_sif} - ${item.djl_naziv}`.toLowerCase();
    return combined.startsWith(query);
  });

  const containsMatches = props.djelatnosti.filter((item) => {
    const combined = `${item.djl_sif} - ${item.djl_naziv}`.toLowerCase();
    return !combined.startsWith(query) && combined.includes(query);
  });

  filteredDjelatnosti.value = [...startsWithMatches, ...containsMatches];
}

const optionLabelOpcina = (option: any) =>
  `${option.kop_sif} - ${option.kop_naziv}`;

const optionLabelDjelatnost = (option: any) =>
  `${option.djl_sif} - ${option.djl_naziv}`;

function onFormSubmit({ valid }: any) {
  console.log(formRef.value.initialValues);
  if (valid) {
    emit("save", formRef.value.initialValues);
  } else {
    toast.add({
      severity: "info",
      summary: "Popunite potrebna polja na formi",
      detail: "Kada popunite potrebna polja na formi krenite u sljedeći korak",
      life: 5000,
    });
  }
}
</script>

<style scoped>
.form-container {
  display: grid;
  grid-template-columns: minmax(0, 700px) auto;
  gap: 52px;
  justify-content: start;
  width: 100%;
}

.form {
  width: 100%;
  max-width: 700px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
}
.form.full-width {
  grid-column: 1 / 3;
  /* max-width: none; */
}
.fieldset {
  max-width: 400px;
  /* width: min-content; */
  height: min-content;
}
:deep(.p-fieldset-legend) {
  padding-top: 0px !important;
}

:deep(.p-autocomplete-dropdown) {
  width: auto !important;
  height: 39px !important;
  border-radius: 0 5px 5px 0 !important;
  padding: 12px;
}
/* 
:deep(#pv_id_20_list.p-autocomplete-list) {
  max-width: auto !important;
} */

.grid-item {
  position: relative;
  height: 100%;
  width: 100%;
  /* grid-column: 1 / 4; */

  display: grid;
  grid-template-columns: 200px 1fr;
}

.grid-item > *,
.grid-item-field > *,
.radio-button-container {
  width: 100%;
}

.grid-item-field {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.grid-item-field.radiogroup-container {
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
}

.radiogroup {
  width: auto;
  display: flex;
  gap: 5px;
}

label.radio-label {
  width: auto !important;
}

.loading-icon {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 10px;
}

label {
  display: flex;
  align-items: center;
}

label.napomena {
  display: block;
  margin-top: 10px;
}

.readonly {
  pointer-events: none;
  opacity: 1;
}

.p-disabled {
  opacity: 1;
}

.p-inputtext.readonly-polja:disabled {
  color: var(--text-color) !important;
  background-color: var(--input-color) !important;
  cursor: default;
  opacity: 1;
  /* pointer-events: none; */
}

.advice-container {
  margin-top: 8px;
  padding: 5px 13px;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}

.inherit-width {
  max-width: 100% !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
}
.inherit-width .p-autocomplete-item {
  /* uklanja defaultno nowrap */
  white-space: normal !important;
  /* kad je riječ predugačka, prekini je */
  word-break: break-word !important;
  /* pojačaj visinu reda da dobiješ lijepo razmake */
  line-height: 1.4 !important;
  /* ponekad u PrimeVue-u stavke imaju fiksnu visinu – ovo uklanja ograničenje */
  height: auto !important;
}
#submitBtn {
  margin-top: 21px;
  padding: 0px 26px;
  color: var(--text-color);
  width: fit-content; /* ← Ovo! */
  min-width: unset;
  max-width: unset;
  justify-self: start; /* Ili center/end ovisno gdje želiš */
}
#submitBtn:hover,
#submitBtn:active {
  background-color: rgb(240, 240, 240);
}

#submitBtn.filled {
  background-color: var(--primary-color);
  color: white;
}
</style>
