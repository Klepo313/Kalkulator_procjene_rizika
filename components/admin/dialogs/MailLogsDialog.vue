<template>
  <Dialog
    :visible="modelVisible"
    header="Povijest poslane pošte"
    :style="{ width: '800px' }"
    :closable="false"
    maximizable
    modal
    :content-style="{ height: 'auto' }">
    <template #header>
      <span class="dialog-header-text-grid">
        <font-awesome-icon icon="envelope" class="dialog-header-icon-grid" />
        <span class="dialog-header-text-span span1">
          {{ userName }}
        </span>
        <span class="dialog-header-text-span span2">
          {{ user?.epr_email || user?.epr_oib }}
        </span>
      </span>
    </template>
    <template #default>
      <DataTable
        :value="mailLogs"
        :rows="10"
        scrollable
        scroll-height="400px"
        removable-sort>
        <template #empty>
          <span style="opacity: 0.8; font-style: italic"
            >Nema poslanih mailova</span
          >
        </template>
        <Column header="#" header-style="width:3rem">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="naslov" header="Naslov" sortable />
        <Column field="datum" header="Datum" sortable >
          <template #body="slotProps">
            {{ formatDateToDMY(slotProps.data.datum, '.') }}
          </template>
        </Column>
      </DataTable>
    </template>
    <template #footer>
      <div class="mail-dialog-footer">
        <button class="p-button p-component p-button-secondary" @click="close">
          Zatvori
        </button>
        <button
          id="saveBtn"
          type="button"
          @click="$emit('send-mail', user?.eko_id, user?.eko_par_id_za)">
          <font-awesome-icon icon="paper-plane" />
          Pošalji novi mail korisniku
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
const props = defineProps({
  visible: Boolean,
  mailLogs: { type: Array, default: () => [] },
  user: { type: Object, default: () => ({}) },
});
const emits = defineEmits(["update:visible", "send-mail"]);

const modelVisible = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    modelVisible.value = val;
  }
);

const user = computed(() => props.user);
console.log(user.value);

const close = () => {
  emits("update:visible", false);
};

const userName = computed(() =>
  props.user ? `${props.user.epr_ime} ${props.user.epr_prezime}` : ""
);
</script>

<style scoped>
.dialog-header-text-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
}
.dialog-header-icon-grid {
  grid-column: 1;
  grid-row: 1 / 3;
  font-size: 1.2rem;
}
.dialog-header-text-span.span1 {
  font-size: 1.2rem;
}
.dialog-header-text-span.span2 {
  opacity: 0.6;
}
.mail-dialog-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#saveBtn {
  width: auto;
  background: none;
  border: var(--border);
  font-weight: 500;

  background-color: var(--text-color);
  color: white;

  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding: 13px;
  gap: 8px;
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
