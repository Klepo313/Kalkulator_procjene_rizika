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

const formatNumber = (value) => {
    // return new Intl.NumberFormat('en-US').format(value);
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
};

const transformCategories = (categories) => {
    // Create a map to easily look up objects by their ukt_id (now "key")
    const map = new Map();

    // Step 1: Transform ukt_id to key and initialize children array
    categories.forEach(item => {
        map.set(item.ukt_id, {
            ...item,
            // ukt_opis: splitOpis(item.ukt_opis),
            // ukt_podaci: splitOpis(item.ukt_podaci),
            // ukt_nacin: splitOpis(item.ukt_nacin),
            // ukt_dinamika: splitOpis(item.ukt_dinamika),
            // ukt_mingran: splitOpis(item.ukt_mingran),
            key: item.ukt_id,
            children: []
        });
        delete map.get(item.ukt_id).ukt_id; // Remove old ukt_id property
    });

    // Step 2: Build the hierarchy by assigning children
    const result = [];
    categories.forEach(item => {
        const parent = map.get(item.ukt_ukt_id);
        const current = map.get(item.ukt_id);
        if (parent) {
            parent.children.push(current);
        } else {
            result.push(current); // Top-level nodes with no parent
        }
    });

    return result;
}

function splitOpis(opis) {
    return opis.split('-').filter(item => item.trim() !== '').map(item => item.trim());
}


function formatDescription(item) {
    const fieldsToFormat = ["ukt_opis", "ukt_podaci", "ukt_nacin", "ukt_dinamika", "ukt_mingran"];

    fieldsToFormat.forEach(field => {
        if (item[field]) {
            item[field] = item[field].includes('-')
                ? splitOpis(item[field]).join('\n- ')
                : item[field];
        }
    });
}

function transformAndFormatCategories(categories) {
    const transformed = transformCategories(categories);

    function applyFormattingRecursively(items) {
        items.forEach(item => {
            formatDescription(item);
            if (item.children && item.children.length > 0) {
                applyFormattingRecursively(item.children);
            }
        });
    }

    applyFormattingRecursively(transformed);

    return transformed;
}

export {
    restructureData,
    formatNumber,
    truncateText,
    splitOpis,
    transformCategories,
    transformAndFormatCategories
}