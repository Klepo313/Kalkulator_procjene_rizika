
const firstRow = ref([
    { class: 'grid-item vertical tablegreen th nb-b', label: 'Kronični', rowStart: 1, rowSpan: 28, colSpan: 1 }, // Započinje u 1. redu i traje 26 redova
    { class: 'grid-item vertical tablegreen th', label: 'Akutni', rowStart: 29, rowSpan: 16, colSpan: 1 }, // Započinje odmah nakon "Kronični", tj. u 27. redu
    { class: 'grid-item pink nb-l nb-b nb-r', label: 'Temperatura', rowStart: 1, rowSpan: 1, colSpan: 9 },
    { class: 'grid-item lightgreen db-l nb-b nb-r', label: 'Vjetar', rowSpan: 1, colSpan: 9 },
    { class: 'grid-item lightblue db-l nb-b nb-r', label: 'Voda', rowSpan: 1, colSpan: 9 },
    { class: 'grid-item headergray db-l nb-b', label: 'Čvrsta masa', rowSpan: 1, colSpan: 9 }
]);

const secondRow = ref([
    { class: 'grid-item postojeci nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-b', label: 'P0', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-b sb-w-l', label: 'P1', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-b sb-w-l', label: 'P2', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-b sb-w-l', label: 'P0', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-b sb-w-l', label: 'P1', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-b sb-w-l', label: 'P2', colSpan: 1, rowSpan: 1 },
])

const thirdRow = ref([
    { class: 'grid-item nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item tablegreen nb', label: '', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item pad5 darkgreen nb-r nb-t nb-b', label: `RCP 4.5`, colSpan: 3, rowSpan: 1 },
    { class: 'grid-item pad5 darkgreen nb-b nb-t sb-w-l', label: `SSP 8.5`, colSpan: 3, rowSpan: 1 },
])

const fourthRow = ref([
    { class: 'grid-item nb', label: '', colSpan: 2, rowSpan: 1 },
    { class: 'grid-item tablegreen nb pad-lr-5 sb-t sb-l f12', label: 'Postojeći', colSpan: 1, rowSpan: 1 },
    { class: 'grid-item darkgreen nb-r nb-t nb-b sb-w-t', label: 'Rizik od promjene', colSpan: 6, rowSpan: 1 },
])

const popisPozicija = [
    '11', '12', '13', '14',
    '21', '22', '23', '24',
    '31', '32', '33', '34',
    '41', '42', '43', '44',
    '51', '52', '53', '54',
    '61', '62', '63', '64',
    '71', '72', '73', '74',
    '81', '82', '83', '84',
    '91', '92', '93', '94',
    '101', '102', '103', '104',
]

const gridHeaderItemConfig = {
    // Prvi red
    '11': { row: 5, column: 2 },
    '12': { row: 5, column: 11 },
    '13': { row: 5, column: 20 },
    '14': { row: 5, column: 29 },

    // Drugi red
    '21': { row: 9, column: 2 },
    '22': { row: 9, column: 11 },
    '23': { row: 9, column: 20 },
    '24': { row: 9, column: 29 },

    // Treći red
    '31': { row: 13, column: 2 },
    '32': { row: 13, column: 11 },
    '33': { row: 13, column: 20 },
    '34': { row: 13, column: 29 },

    // Četvrti red
    '41': { row: 17, column: 2 },
    '42': { row: 17, column: 11 },
    '43': { row: 17, column: 20 },
    '44': { row: 17, column: 29 },

    // Peti red
    '51': { row: 21, column: 2 },
    '52': { row: 21, column: 11 },
    '53': { row: 21, column: 20 },
    '54': { row: 21, column: 29 },

    // Šesti red
    '61': { row: 25, column: 2 },
    '62': { row: 25, column: 11 },
    '63': { row: 25, column: 20 },
    '64': { row: 25, column: 29 },

    // Sedmi red
    '71': { row: 29, column: 2 },
    '72': { row: 29, column: 11 },
    '73': { row: 29, column: 20 },
    '74': { row: 29, column: 29 },

    // Osmi red
    '81': { row: 33, column: 2 },
    '82': { row: 33, column: 11 },
    '83': { row: 33, column: 20 },
    '84': { row: 33, column: 29 },

    // Deveti red
    '91': { row: 37, column: 2 },
    '92': { row: 37, column: 11 },
    '93': { row: 37, column: 20 },
    '94': { row: 37, column: 29 },

    // Deseti red
    '101': { row: 41, column: 2 },
    '102': { row: 41, column: 11 },
    '103': { row: 41, column: 20 },
    '104': { row: 41, column: 29 },
};

const parametri = ['imovina', 'ulaz', 'izlaz', 'procesi'];

const parametriPositions = {
    'imovina': {
        // Prvi red
        '11': { row: 5, column: 3 },
        '12': { row: 5, column: 12 },
        '13': { row: 5, column: 21 },
        '14': { row: 5, column: 30 },

        // Drugi red
        '21': { row: 9, column: 3 },
        '22': { row: 9, column: 12 },
        '23': { row: 9, column: 21 },
        '24': { row: 9, column: 30 },

        // Treći red
        '31': { row: 13, column: 3 },
        '32': { row: 13, column: 12 },
        '33': { row: 13, column: 21 },
        '34': { row: 13, column: 30 },

        // Četvrti red
        '41': { row: 17, column: 3 },
        '42': { row: 17, column: 12 },
        '43': { row: 17, column: 21 },
        '44': { row: 17, column: 30 },

        // Peti red
        '51': { row: 21, column: 3 },
        '52': { row: 21, column: 12 },
        '53': { row: 21, column: 21 },
        '54': { row: 21, column: 30 },

        // Šesti red
        '61': { row: 25, column: 3 },
        '62': { row: 25, column: 12 },
        '63': { row: 25, column: 21 },
        '64': { row: 25, column: 30 },

        // Sedmi red
        '71': { row: 29, column: 3 },
        '72': { row: 29, column: 12 },
        '73': { row: 29, column: 21 },
        '74': { row: 29, column: 30 },

        // Osmi red
        '81': { row: 33, column: 3 },
        '82': { row: 33, column: 12 },
        '83': { row: 33, column: 21 },
        '84': { row: 33, column: 30 },

        // Deveti red
        '91': { row: 37, column: 3 },
        '92': { row: 37, column: 12 },
        '93': { row: 37, column: 21 },
        '94': { row: 37, column: 30 },

        // Deseti red
        '101': { row: 41, column: 3 },
        '102': { row: 41, column: 12 },
        '103': { row: 41, column: 21 },
        '104': { row: 41, column: 30 },
    },
    'ulaz': {
        // Prvi red
        '11': { row: 6, column: 3 },
        '12': { row: 6, column: 12 },
        '13': { row: 6, column: 21 },
        '14': { row: 6, column: 30 },
        // Drugi red
        '21': { row: 10, column: 3 },
        '22': { row: 10, column: 12 },
        '23': { row: 10, column: 21 },
        '24': { row: 10, column: 30 },
        // Treći red
        '31': { row: 14, column: 3 },
        '32': { row: 14, column: 12 },
        '33': { row: 14, column: 21 },
        '34': { row: 14, column: 30 },
        // Četvrti red
        '41': { row: 18, column: 3 },
        '42': { row: 18, column: 12 },
        '43': { row: 18, column: 21 },
        '44': { row: 18, column: 30 },
        // Peti red
        '51': { row: 22, column: 3 },
        '52': { row: 22, column: 12 },
        '53': { row: 22, column: 21 },
        '54': { row: 22, column: 30 },
        // Šesti red
        '61': { row: 26, column: 3 },
        '62': { row: 26, column: 12 },
        '63': { row: 26, column: 21 },
        '64': { row: 26, column: 30 },
        // Sedmi red
        '71': { row: 30, column: 3 },
        '72': { row: 30, column: 12 },
        '73': { row: 30, column: 21 },
        '74': { row: 30, column: 30 },
        // Osmi red
        '81': { row: 34, column: 3 },
        '82': { row: 34, column: 12 },
        '83': { row: 34, column: 21 },
        '84': { row: 34, column: 30 },
        // Deveti red
        '91': { row: 38, column: 3 },
        '92': { row: 38, column: 12 },
        '93': { row: 38, column: 21 },
        '94': { row: 38, column: 30 },
        // Deseti red
        '101': { row: 42, column: 3 },
        '102': { row: 42, column: 12 },
        '103': { row: 42, column: 21 },
        '104': { row: 42, column: 30 },
    },
    'izlaz': {
        '11': { row: 7, column: 3 },
        '12': { row: 7, column: 12 },
        '13': { row: 7, column: 21 },
        '14': { row: 7, column: 30 },
        '21': { row: 11, column: 3 },
        '22': { row: 11, column: 12 },
        '23': { row: 11, column: 21 },
        '24': { row: 11, column: 30 },
        '31': { row: 15, column: 3 },
        '32': { row: 15, column: 12 },
        '33': { row: 15, column: 21 },
        '34': { row: 15, column: 30 },
        '41': { row: 19, column: 3 },
        '42': { row: 19, column: 12 },
        '43': { row: 19, column: 21 },
        '44': { row: 19, column: 30 },
        '51': { row: 23, column: 3 },
        '52': { row: 23, column: 12 },
        '53': { row: 23, column: 21 },
        '54': { row: 23, column: 30 },
        '61': { row: 27, column: 3 },
        '62': { row: 27, column: 12 },
        '63': { row: 27, column: 21 },
        '64': { row: 27, column: 30 },
        '71': { row: 31, column: 3 },
        '72': { row: 31, column: 12 },
        '73': { row: 31, column: 21 },
        '74': { row: 31, column: 30 },
        '81': { row: 35, column: 3 },
        '82': { row: 35, column: 12 },
        '83': { row: 35, column: 21 },
        '84': { row: 35, column: 30 },
        '91': { row: 39, column: 3 },
        '92': { row: 39, column: 12 },
        '93': { row: 39, column: 21 },
        '94': { row: 39, column: 30 },
        '101': { row: 43, column: 3 },
        '102': { row: 43, column: 12 },
        '103': { row: 43, column: 21 },
        '104': { row: 43, column: 30 },
    },
    'procesi': {
        '11': { row: 8, column: 3 },
        '12': { row: 8, column: 12 },
        '13': { row: 8, column: 21 },
        '14': { row: 8, column: 30 },
        '21': { row: 12, column: 3 },
        '22': { row: 12, column: 12 },
        '23': { row: 12, column: 21 },
        '24': { row: 12, column: 30 },
        '31': { row: 16, column: 3 },
        '32': { row: 16, column: 12 },
        '33': { row: 16, column: 21 },
        '34': { row: 16, column: 30 },
        '41': { row: 20, column: 3 },
        '42': { row: 20, column: 12 },
        '43': { row: 20, column: 21 },
        '44': { row: 20, column: 30 },
        '51': { row: 24, column: 3 },
        '52': { row: 24, column: 12 },
        '53': { row: 24, column: 21 },
        '54': { row: 24, column: 30 },
        '61': { row: 28, column: 3 },
        '62': { row: 28, column: 12 },
        '63': { row: 28, column: 21 },
        '64': { row: 28, column: 30 },
        '71': { row: 32, column: 3 },
        '72': { row: 32, column: 12 },
        '73': { row: 32, column: 21 },
        '74': { row: 32, column: 30 },
        '81': { row: 36, column: 3 },
        '82': { row: 36, column: 12 },
        '83': { row: 36, column: 21 },
        '84': { row: 36, column: 30 },
        '91': { row: 40, column: 3 },
        '92': { row: 40, column: 12 },
        '93': { row: 40, column: 21 },
        '94': { row: 40, column: 30 },
        '101': { row: 44, column: 3 },
        '102': { row: 44, column: 12 },
        '103': { row: 44, column: 21 },
        '104': { row: 44, column: 30 },
    }
};

// Definiramo početne retke i stupce za svaku poziciju ručno
const pozicijaPostavke = {
    '11': { rowStart: 5, columnStart: 4 },
    '12': { rowStart: 5, columnStart: 13 },
    '13': { rowStart: 5, columnStart: 22 },
    '14': { rowStart: 5, columnStart: 31 }, // Pozicija '14' je ispravno postavljena
    '21': { rowStart: 9, columnStart: 4 },
    '22': { rowStart: 9, columnStart: 13 },
    '23': { rowStart: 9, columnStart: 22 },
    '24': { rowStart: 9, columnStart: 31 },
    '31': { rowStart: 13, columnStart: 4 },
    '32': { rowStart: 13, columnStart: 13 },
    '33': { rowStart: 13, columnStart: 22 },
    '34': { rowStart: 13, columnStart: 31 },
    '41': { rowStart: 17, columnStart: 4 },
    '42': { rowStart: 17, columnStart: 13 },
    '43': { rowStart: 17, columnStart: 22 },
    '44': { rowStart: 17, columnStart: 31 },
    '51': { rowStart: 21, columnStart: 4 },
    '52': { rowStart: 21, columnStart: 13 },
    '53': { rowStart: 21, columnStart: 22 },
    '54': { rowStart: 21, columnStart: 31 },
    '61': { rowStart: 25, columnStart: 4 },
    '62': { rowStart: 25, columnStart: 13 },
    '63': { rowStart: 25, columnStart: 22 },
    '64': { rowStart: 25, columnStart: 31 },
    '71': { rowStart: 29, columnStart: 4 },
    '72': { rowStart: 29, columnStart: 13 },
    '73': { rowStart: 29, columnStart: 22 },
    '74': { rowStart: 29, columnStart: 31 },
    '81': { rowStart: 33, columnStart: 4 },
    '82': { rowStart: 33, columnStart: 13 },
    '83': { rowStart: 33, columnStart: 22 },
    '84': { rowStart: 33, columnStart: 31 },
    '91': { rowStart: 37, columnStart: 4 },
    '92': { rowStart: 37, columnStart: 13 },
    '93': { rowStart: 37, columnStart: 22 },
    '94': { rowStart: 37, columnStart: 31 },
    '101': { rowStart: 41, columnStart: 4 },
    '102': { rowStart: 41, columnStart: 13 },
    '103': { rowStart: 41, columnStart: 22 },
    '104': { rowStart: 41, columnStart: 31 },
};

const djelatnostCellRanges = {
    '11': { range: 'F19:L22' },
    '12': { range: 'O19:U22' },
    '13': { range: 'X19:AD22' },
    '14': { range: 'AG19:AM22' },

    '21': { range: 'F23:L26' },
    '23': { range: 'X23:AD26' },
    '24': { range: 'AG23:AM26' },

    '31': { range: 'F27:L30' },
    '33': { range: 'X27:AD30' },
    '34': { range: 'AG27:AM30' },

    '41': { range: 'F31:L34' },
    '43': { range: 'X31:AD34' },
    '44': { range: 'AG31:AM34' },

    '53': { range: 'X35:AD38' },

    '63': { range: 'X39:AD42' },

    '71': { range: 'F43:L46' },
    '72': { range: 'O43:U46' },
    '73': { range: 'X43:AD46' },
    '74': { range: 'AG43:AM46' },

    '81': { range: 'F47:L50' },
    '82': { range: 'O47:U50' },
    '83': { range: 'X47:AD50' },
    '84': { range: 'AG47:AM50' },

    '91': { range: 'F51:L54' },
    '92': { range: 'O51:U54' },
    '93': { range: 'X51:AD54' },
    '94': { range: 'AG51:AM54' },

    '103': { range: 'X55:AD58' },
};

const imovinaCellRanges = {
    '11': { range: 'E19:K19' },
    '12': { range: 'M19:S19' },
    '13': { range: 'U19:AA19' },
    '14': { range: 'AC19:AI19' },

    '21': { range: 'E20:K20' },
    '23': { range: 'U20:AA20' },
    '24': { range: 'AC20:AI20' },

    '31': { range: 'E21:K21' },
    '33': { range: 'U21:AA21' },
    '34': { range: 'AC21:AI21' },

    '41': { range: 'E22:K22' },
    '43': { range: 'U22:AA22' },
    '44': { range: 'AC22:AI22' },

    '53': { range: 'U23:AA23' },

    '63': { range: 'U24:AA24' },

    '71': { range: 'E25:K25' },
    '72': { range: 'M25:S25' },
    '73': { range: 'U25:AA25' },
    '74': { range: 'AC25:AI25' },

    '81': { range: 'E26:K26' },
    '82': { range: 'M26:S26' },
    '83': { range: 'U26:AA26' },
    '84': { range: 'AC26:AI26' },

    '91': { range: 'E27:K27' },
    '92': { range: 'M27:S27' },
    '93': { range: 'U27:AA27' },
    '94': { range: 'AC27:AI27' },

    '103': { range: 'U28:AA28' },
}

export {
    firstRow,
    secondRow,
    thirdRow,
    fourthRow,
    popisPozicija,
    gridHeaderItemConfig,
    parametri,
    parametriPositions,
    pozicijaPostavke,
    djelatnostCellRanges,
    imovinaCellRanges,
}