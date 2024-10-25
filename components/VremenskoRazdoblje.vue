<template>
    <div class="razdoblje">
        <div>
            <div class="opisnap">
                <label for="opis">
                    Naziv
                </label>
                <InputText type="text" id="opis" readonly />
            </div>
            <div class="opisnap">
                <label for="napomena">
                    Napomena
                </label>
                <Textarea id="napomena" readonly />
            </div>
            <div>
                <label for="startDate">
                    Početak razdoblja<span class="required">*</span>
                </label>
                <DatePicker id="startDate" v-model="datumOd" date-format="dd.mm.yy" show-icon fluid icon-display="input"
                    placeholder="Početni datum" readonly />
            </div>
            <div>
                <label for="endDate">
                    Kraj razdoblja<span class="required">*</span>
                </label>
                <DatePicker id="endDate" v-model="datumDo" date-format="dd.mm.yy" show-icon fluid icon-display="input"
                    placeholder="Krajnji datum" readonly />
            </div>
        </div>
    </div>
</template>

<script script>
import { useKespStore } from '#imports';

const kespStore = useKespStore();

const godina = computed({
    get: () => kespStore.godina,
    set: (value) => kespStore.setGodina(value),
});

const datumOd = computed(() => kespStore.datumOd);
const datumDo = computed(() => kespStore.datumDo);

console.log(datumOd.value, datumDo.value, godina.value);

</script>

<style scoped>
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

.required {
    color: var(--red-soft);
}
</style>