<template>
    <div class="risk-matrix">
        <table>
            <thead>
                <tr>
                    <th rowspan="2">Ranljivost</th>
                    <th colspan="5">Utjecaj</th>
                </tr>
                <tr>
                    <th>Beznačajan</th>
                    <th>Niski</th>
                    <th>Srednji</th>
                    <th>Visoki</th>
                    <th>Vrlo visoki</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Niska</td>
                    <td class="gray">1</td>
                    <td class="green">2</td>
                    <td class="yellow">3</td>
                    <td class="orange">4</td>
                    <td class="red">5</td>
                </tr>
                <tr>
                    <td>Srednja</td>
                    <td class="green">2</td>
                    <td class="yellow">4</td>
                    <td class="yellow">6</td>
                    <td class="orange">8</td>
                    <td class="orange">10</td>
                </tr>
                <tr>
                    <td>Visoka</td>
                    <td class="green">3</td>
                    <td class="yellow">6</td>
                    <td class="orange">9</td>
                    <td class="red">12</td>
                    <td class="red">15</td>
                </tr>
            </tbody>
        </table>
        <div class="legend">
            <!-- <strong>Legenda:</strong> -->
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

<script>
export default {
    name: 'RiskMatrix',
};
</script>

<style scoped>
.risk-matrix {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

table {
    border-collapse: collapse;
    width: 50%;
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
</style>