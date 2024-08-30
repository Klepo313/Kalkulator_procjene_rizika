<template>
    <div>
        <div v-if="data" class="grid">
            <!-- v-for tdg_rbr == 10 -->
            <div class="_grid-item" :class="getColorClass(data[0].history)">{{ data[0].history }}</div>
            <div class="_grid-item db-s" :class="getColorClass(data[0].p0_4_5)">{{ data[0].p0_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[0].p1_4_5)">{{ data[0].p0_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[0].p2_4_5)">{{ data[0].p1_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[0].p0_8_5)">{{ data[0].p1_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[0].p1_8_5)">{{ data[0].p2_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[0].p2_8_5)">{{ data[0].p2_8_5 }}</div>

            <div class="_grid-item" :class="getColorClass(data[1].history)">{{ data[1].history }}</div>
            <div class="_grid-item db-s" :class="getColorClass(data[1].p0_4_5)">{{ data[1].p0_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[1].p1_4_5)">{{ data[1].p0_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[1].p2_4_5)">{{ data[1].p1_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[1].p0_8_5)">{{ data[1].p1_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[1].p1_8_5)">{{ data[1].p2_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[1].p2_8_5)">{{ data[1].p2_8_5 }}</div>

            <div class="_grid-item" :class="getColorClass(data[2].history)">{{ data[2].history }}</div>
            <div class="_grid-item db-s" :class="getColorClass(data[2].p0_4_5)">{{ data[2].p0_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[2].p1_4_5)">{{ data[2].p0_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[2].p2_4_5)">{{ data[2].p1_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[2].p0_8_5)">{{ data[2].p1_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[2].p1_8_5)">{{ data[2].p2_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[2].p2_8_5)">{{ data[2].p2_8_5 }}</div>

            <div class="_grid-item" :class="getColorClass(data[3].history)">{{ data[3].history }}</div>
            <div class="_grid-item db-s" :class="getColorClass(data[3].p0_4_5)">{{ data[3].p0_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[3].p1_4_5)">{{ data[3].p0_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[3].p2_4_5)">{{ data[3].p1_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[3].p0_8_5)">{{ data[3].p1_8_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[3].p1_8_5)">{{ data[3].p2_4_5 }}</div>
            <div class="_grid-item" :class="getColorClass(data[3].p2_8_5)">{{ data[3].p2_8_5 }}</div>
        </div>
        <div v-else class="grid">
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>

            <div class="_grid-item"><font-awesome-icon icon="spinner" spin /></div>
            <div class="_grid-item db-s">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="_grid-item">
                <font-awesome-icon icon="spinner" spin />
            </div>
        </div>
    </div>
</template>

<script setup>
import { getColorClass } from '../utils/getColorClass'

const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    pozicija: Number,
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
})

// Reaktivna vrednost data je direktno povezana sa props.data
const data = computed(() => props.data);

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
