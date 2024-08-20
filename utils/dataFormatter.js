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