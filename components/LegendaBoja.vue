<template>
    <div class="risk-matrix">
        <div class="matrix">

            <div class="matrix-header">
                Matrica rizika
            </div>

            <div class="grid">
                <div class="grid-item nb" />

                <div class="grid-item nb-b">Utjecaj</div>
                <div class="grid-item nb-r ranjivost">Ranjivost</div>

                <div class="grid-item nb" />
                <div class="grid-item nb" />

                <div class="grid-item nb-b nb-r">Beznačajan</div>
                <div class="grid-item nb-b nb-r">Niski</div>
                <div class="grid-item nb-b nb-r">Srednji</div>
                <div class="grid-item nb-b nb-r">Visoki</div>
                <div class="grid-item nb-b">Vrlo visoki</div>
                <div class="grid-item nb-r nb-b">Niska</div>

                <div class="grid-item nb-r nb-b" :class="getColorClass(1)">1</div>
                <div class="grid-item nb-r nb-b" :class="getColorClass(2)">2</div>
                <div class="grid-item nb-r nb-b" :class="getColorClass(3)">3</div>
                <div class="grid-item nb-r nb-b" :class="getColorClass(4)">4</div>
                <div class="grid-item nb-b" :class="getColorClass(5)">5</div>

                <div class="grid-item nb-b nb-r">Srednja</div>
                <div class="grid-item nb-b nb-r" :class="getColorClass(2)">2</div>
                <div class="grid-item nb-b nb-r" :class="getColorClass(4)">4</div>
                <div class="grid-item nb-b nb-r" :class="getColorClass(6)">6</div>
                <div class="grid-item nb-b nb-r" :class="getColorClass(8)">8</div>
                <div class="grid-item nb-b" :class="getColorClass(10)">10</div>

                <div class="grid-item nb-r">Visoka</div>
                <div class="grid-item nb-r" :class="getColorClass(3)">3</div>
                <div class="grid-item nb-r" :class="getColorClass(6)">6</div>
                <div class="grid-item nb-r" :class="getColorClass(9)">9</div>
                <div class="grid-item nb-r" :class="getColorClass(12)">12</div>
                <div class="grid-item" :class="getColorClass(15)">15</div>
            </div>

        </div>
        <div class="legend">
            <div>
                <div class="legend-item"><span class="green" /> BEZNAČAJAN</div>
                <div class="legend-item"><span class="yellow" /> NISKI</div>
                <div class="legend-item"><span class="orange" /> SREDNJI</div>
                <div class="legend-item"><span class="red" /> VISOKI</div>
                <div class="legend-item"><span class="red" /> VRLO VISOKI</div>
            </div>
            <div>
                <div class="legend-item"><span class="nullgray" />
                    RIZIK OD KLIMATSKE PROMJENE OSTAJE ISTI
                </div>
                <div class="legend-item"><span class="lightgray" />
                    SMANJENJE POJAVE
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { getColorClass } from '#imports';


</script>

<style scoped>
.risk-matrix {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.matrix {
    width: 60%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    background-color: white;
    /* gap: 20px; */

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
}

.matrix-header {
    width: 100%;
    padding: 10px 0px;
    background-color: #dceaf7;

    font-size: 16px;
    font-weight: bold;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    border-radius: 5px 5px 0px 0px;
}

.grid {
    width: 100%;
    margin: 0;
    padding: 20px;

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);

    background-color: white;

    /* border: 1px solid #2a2a2a; */
    border-top: none;
    border-radius: 0px 0px 5px 5px;
}

.grid-item {
    width: 100%;
    height: 100%;
    padding: 8px;

    font-size: 14px;
    font-weight: 600;
    text-align: center;

    border: 1px solid #2a2a2a;

    display: flex;
    align-items: center;
    justify-content: center;
}

.ranjivost {
    width: auto;
    writing-mode: sideways-lr;
    text-orientation: upright;
}

.grid-item:nth-child(1) {
    grid-row: 1 / 3;
    grid-column: 2;
}

.grid-item:nth-child(2) {
    grid-row: 1;
    grid-column: 3 / 8;
}

.grid-item:nth-child(3) {
    grid-row: 3 / 7;
    grid-column: 1;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid #000;
    text-align: center;
    padding: 8px;
}

.legend {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 13px;
}

.legend>div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 26px;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
}

.legend-item span {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.gray {
    background-color: #bfbfbf;
}

.green {
    background-color: #92d050;
}

.yellow {
    background-color: #ffff00;
}

.orange {
    background-color: #ffc000;
}

.red {
    background-color: #ff0000;
}

.nullgray {
    background-color: rgb(239, 239, 239);
}

.lightgray {
    background-color: #caedfb;
    font-style: italic;
}

.nb {
    border: none;
}

.nb-t {
    border-top: none;
}

.nb-b {
    border-bottom: none;
}

.nb-l {
    border-left: none;
}

.nb-r {
    border-right: none;
}
</style>