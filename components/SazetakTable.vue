<template>
    <div>
        <div v-if="data" class="grid">
            <!-- v-for tdg_rbr == 10 -->
            <div class="_grid-item">{{ data[0].history }}</div>
            <div class="_grid-item db-s">{{ data[0].p0_4_5 }}</div>
            <div class="_grid-item">{{ data[0].p0_8_5 }}</div>
            <div class="_grid-item">{{ data[0].p1_4_5 }}</div>
            <div class="_grid-item">{{ data[0].p1_8_5 }}</div>
            <div class="_grid-item">{{ data[0].p2_4_5 }}</div>
            <div class="_grid-item">{{ data[0].p2_8_5 }}</div>

            <div class="_grid-item">{{ data[1].history }}</div>
            <div class="_grid-item db-s">{{ data[1].p0_4_5 }}</div>
            <div class="_grid-item">{{ data[1].p0_8_5 }}</div>
            <div class="_grid-item">{{ data[1].p1_4_5 }}</div>
            <div class="_grid-item">{{ data[1].p1_8_5 }}</div>
            <div class="_grid-item">{{ data[1].p2_4_5 }}</div>
            <div class="_grid-item">{{ data[1].p2_8_5 }}</div>

            <div class="_grid-item">{{ data[2].history }}</div>
            <div class="_grid-item db-s">{{ data[2].p0_4_5 }}</div>
            <div class="_grid-item">{{ data[2].p0_8_5 }}</div>
            <div class="_grid-item">{{ data[2].p1_4_5 }}</div>
            <div class="_grid-item">{{ data[2].p1_8_5 }}</div>
            <div class="_grid-item">{{ data[2].p2_4_5 }}</div>
            <div class="_grid-item">{{ data[2].p2_8_5 }}</div>

            <div class="_grid-item">{{ data[3].history }}</div>
            <div class="_grid-item db-s">{{ data[3].p0_4_5 }}</div>
            <div class="_grid-item">{{ data[3].p0_8_5 }}</div>
            <div class="_grid-item">{{ data[3].p1_4_5 }}</div>
            <div class="_grid-item">{{ data[3].p1_8_5 }}</div>
            <div class="_grid-item">{{ data[3].p2_4_5 }}</div>
            <div class="_grid-item">{{ data[3].p2_8_5 }}</div>
            <!-- Dodaj template blokove za tdg_rbr 30, 40, itd. -->

        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    pozicija: Number,
    data: Object,
})

const pozicija = props.pozicija
const data = ref(props.data);
//data.value = props.data

console.log("data za --", pozicija, ": ", data.value)

function setColor() {
    const gridItems = document.querySelectorAll('._grid-item');
    gridItems.forEach(item => {
        const value = parseInt(item.textContent);
        if (!isNaN(value)) {
            if (value < 0) {
                item.classList.add('lightgray');
            } else if (value === 0) {
                item.classList.add('white');
            } else if (value === 1) {
                item.classList.add('gray');
            } else if (value >= 2 && value <= 3) {
                item.classList.add('green');
            } else if (value >= 4 && value <= 6) {
                item.classList.add('yellow');
            } else if (value >= 7 && value <= 10) {
                item.classList.add('orange');
            } else if (value >= 11 && value <= 15) {
                item.classList.add('red');
            } else {
                item.classList.add('white');
            }
        }
    });
}

onMounted(() => {
    setColor();
});
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(4, 1fr);
    box-sizing: border-box;

    width: 100%;
    height: 100%;
}

._grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    box-sizing: border-box;
    border: 1px solid #2a2a2a;
    border-bottom: none;
    border-right: none;
}

.db-r {
    border-right: 1px dashed #2a2a2a;
}

.db-s {
    border-left-style: dashed;
}

/* < 0 */
.lightgray {
    background-color: #caedfb;
}

/* = 0 */
.white {
    background-color: #ffffff;
}

/* > 0 */
.gray {
    background-color: #bfbfbf;
}

/* [2, 3] */
.green {
    background-color: #92d050;
}

/* [4, 6] */
.yellow {
    background-color: #ffff00;
}

/* [7, 10] */
.orange {
    background-color: #ffc000;
}

/* [11, 15] */
.red {
    background-color: #ff0000;
}
</style>
