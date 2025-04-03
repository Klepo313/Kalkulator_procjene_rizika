<template>
  <div class="main-content">
    <div>
      <h2>Emisije rashladnih uređaja</h2>
      <p>
        Emisije rashladnih uređaja u vlasništvu ili pod kontrolom organizacije.
      </p>
    </div>
    <DataTable
      row-group-mode="subheader"
      group-rows-by="uvg_naziv"
      :sort-order="1"
      scrollable
      scroll-height="800px"
      :value="gwpIzracuni"
      removable-sort
      show-gridlines
      :rows="5"
      data-key="uir_id"
      striped-rows
    >
      <template #empty> Nema spremljenih emisija </template>
      <template #loading> Učitavanje emisija. Molimo pričekajte. </template>
      <!--  row-group-mode="rowspan" group-rows-by="izvor" -->
      <template #groupheader="slotProps">
        <div style="display: flex; align-items: center; gap: 5px">
          <font-awesome-icon icon="bottle-droplet" />
          <span>
            {{ slotProps.data.uvg_naziv }}
          </span>
        </div>
      </template>
      <Column field="uvg_naziv" header="Naziv" />
      <Column header="Broj">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column
      field="ugr_naziv"
      header="Vrsta rashladnog uređaja"
      style="min-width: 12rem; max-width: 14rem"
      >
    </Column>
    <Column
      field="uir_brjed"
      header="Broj jedinica"
      style="width: 10%; min-width: 8rem"
    >
    </Column>
      <Column
        field="uir_kapacitet"
        header="Količina rashladnog sredstva u sustavu (kg)"
        style="min-width: 8rem"
      >
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" placeholder="0" min="1" fluid />
        </template>
      </Column>
      <Column
        field="uir_ugradnja"
        header="Izvještajna godina - ugradnja rashladnih uređaja"
      >
        <template #body="slotProps">
          <Tag
            :value="returnStatus(slotProps.data.uir_ugradnja)"
            :severity="getStatusLabel(slotProps.data.uir_ugradnja)"
          />
        </template>
      </Column>
      <Column
        field="uir_rad"
        header="Izvještajna godina - normalan rad rashladnih uređaja"
      >
        <template #body="slotProps">
          <Tag
            :value="returnStatus(slotProps.data.uir_rad)"
            :severity="getStatusLabel(slotProps.data.uir_rad)"
          />
        </template>
      </Column>
      <Column
        field="uir_kraj"
        header="Izvještajna godina - demontirana/zbrinuta oprema"
      >
        <template #body="slotProps">
          <Tag
            :value="returnStatus(slotProps.data.uir_kraj)"
            :severity="getStatusLabel(slotProps.data.uir_kraj)"
          />
        </template>
      </Column>
      <Column field="uir_emisija" header="Emisija eCO2/kg">
        <template #body="{ data, field }">
          <strong style="text-decoration: none; color: var(--kesp-primary)">{{
            formatNumber(data[field], 5)
          }}</strong>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
const kespStore = useKespStore();
const gwpIzracuni = computed(() => kespStore.gwpPredlosci);

watch(
  () => kespStore.gwpPredlosci,
  () => {
    console.log("Da: ", kespStore.gwpPredlosci);
  }
);

const returnStatus = (status) => {
  switch (status) {
    case "Da":
      return "Da";
    case "Ne":
      return "Ne";
    default:
      return null;
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.main-content > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
