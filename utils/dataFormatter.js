const restructureData = (data) => {
    // Glavni objekt koji će sadržavati razvrstane podobjekte
    const groupedData = {};

    data.forEach(item => {
        const gridKey = item.tdg_grid;

        // Ako ključ ne postoji, inicijaliziraj prazan niz
        if (!groupedData[gridKey]) {
            groupedData[gridKey] = [];
        }

        // Gurni trenutni objekt u odgovarajući niz
        groupedData[gridKey].push(item);
    });

    // Sortiraj svaki niz unutar objekta prema tdg_rbr
    Object.keys(groupedData).forEach(key => {
        groupedData[key].sort((a, b) => a.tdg_rbr - b.tdg_rbr);
    });

    return groupedData;
}

export {
    restructureData,
}

// const restructureData = (data) => {
//     const groupedData = {};

//     // Grupiranje podataka
//     for (const item of data) {
//         const gridKey = item.tdg_grid;

//         if (!groupedData[gridKey]) {
//             groupedData[gridKey] = [];
//         }

//         groupedData[gridKey].push(item);
//     }

//     // Sortiranje svake grupe pomoću ugrađenog sortiranja koje je vrlo optimizirano
//     for (const key in groupedData) {
//         groupedData[key].sort((a, b) => a.tdg_rbr - b.tdg_rbr);
//     }

//     return groupedData;
// }

// export {
//     restructureData,
// }
