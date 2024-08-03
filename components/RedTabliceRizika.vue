<template>
    <div>
        <div class="grid">
            <div class="_grid-item">15</div>
            <div class="_grid-item db-s double">8</div>
            <div class="_grid-item">10</div>
            <div class="_grid-item">-1</div>
            <div class="_grid-item">0</div>
            <div class="_grid-item">11</div>
            <div class="_grid-item">1</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

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
    grid-template-rows: 1fr;
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
    border: 1px solid #a6c9ec;
    border-bottom: none;
    border-right: none;
}

.db-r {
    border-right: 12px dashed #a6c9ec;
}

.db-s {
    border-left-style: dashed;
    border-left: 2px dashed #a6c9ec;
}

/* < 0 */
.lightgray {
    background-color: #caedfb;
    font-style: italic;
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
