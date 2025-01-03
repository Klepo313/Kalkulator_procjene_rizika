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
    // Step 1: Create a map to easily look up objects by their ukt_id (now "key")
    const map = new Map();

    // Step 2: Transform ukt_id to key and initialize children array
    categories.forEach(item => {
        map.set(item.ukt_id, {
            ...item,
            relevant: item.usk_odabran === 'D' ? true : false, // Initialize as false, will set later
            key: item.ukt_id,
            children: []
        });
        delete map.get(item.ukt_id).ukt_id; // Remove old ukt_id property
    });

    // Step 3: Populate children arrays for parent objects
    const result = [];
    map.forEach(item => {
        if (item.ukt_ukt_id) {
            const parent = map.get(item.ukt_ukt_id);
            if (parent) {
                parent.children.push(item);
            }
        } else {
            result.push(item); // Top-level categories
        }
    });

    return result;
};

// // Step 3: Build the hierarchy by assigning children
// const result = [];
// categories.forEach(item => {
//     const parent = map.get(item.ukt_ukt_id);
//     const current = map.get(item.ukt_id);
//     if (parent) {
//         parent.children.push(current);
//     } else {
//         result.push(current); // Top-level nodes with no parent
//     }
// });

// // Step 4: Assign random relevant values to parent nodes
// const assignRelevance = (nodes) => {
//     nodes.forEach(node => {
//         // Randomly assign relevance for parent nodes
//         node.relevant = Math.random() < 0.8 ? false : true;

//         // Propagate relevance to children
//         if (node.children.length > 0) {
//             if (!node.relevant) {
//                 // If parent is not relevant, children cannot be relevant
//                 node.children.forEach(child => child.relevant = false);
//             } else {
//                 // If parent is relevant, assign random relevance to children
//                 assignRelevance(node.children);
//             }
//         }
//     });
// };

// assignRelevance(result);


function splitOpis(opis) {
    return opis.split('-').filter(item => item.trim() !== '').map(item => item.trim());
}

function formatOpis(opis) {
    return opis.split('-').map(item => item.trim()).join('<br />');
}

function advancedFormatOpis(opis) {
    const segments = opis.split(':'); // Dijelimo sadržaj prema dvotočki
    let formatted = segments[0].trim(); // Prvi dio je uvodni tekst prije dvotočke
    if (segments.length > 1) {
        const natuknice = segments[1].split('-').filter(item => item.trim() !== ''); // Razdvajamo natuknice -
        if (natuknice.length > 0) {
            formatted += ':<ul class="intern">'; // Početak liste
            natuknice.forEach(item => {
                formatted += `<li class="tab-opis">${item.trim()}</li>`; // Dodavanje svakog elementa liste
            });
            formatted += '</ul>'; // Kraj liste
        }
    }
    // Dodavanje preloma linija gdje nema dvotočke
    return formatted //.replace(/- /g, '<br />'); // style="display:block; margin-bottom: 8px;" 
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

const ukloniKvacicu = (str) => {
    return str
        .replace(/[š]/g, 's')
        .replace(/[č]/g, 'c')
        .replace(/[ć]/g, 'c')
        .replace(/[đ]/g, 'd')
        .replace(/[ž]/g, 'z')
        .replace(/[Š]/g, 'S')
        .replace(/[Č]/g, 'C')
        .replace(/[Ć]/g, 'C')
        .replace(/[Đ]/g, 'D')
        .replace(/[Ž]/g, 'Z');
}

const generirajLozinku = () => {
    const malaSlova = 'abcdefghijklmnopqrstuvwxyz';
    const velikaSlova = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const brojevi = '0123456789';
    const sveZnakovi = malaSlova + velikaSlova + brojevi;

    const duljina = Math.floor(Math.random() * 3) + 6; // 6 do 8 znakova
    let lozinka = '';
    lozinka += malaSlova[Math.floor(Math.random() * malaSlova.length)];
    lozinka += velikaSlova[Math.floor(Math.random() * velikaSlova.length)];
    lozinka += brojevi[Math.floor(Math.random() * brojevi.length)];

    while (lozinka.length < duljina) {
        lozinka += sveZnakovi[Math.floor(Math.random() * sveZnakovi.length)];
    }

    return ukloniKvacicu(lozinka.split('').sort(() => 0.5 - Math.random()).join('')); // Promiješaj znakove i ukloni kvačicu
}

export {
    restructureData,
    formatNumber,
    truncateText,
    splitOpis,
    formatOpis,
    advancedFormatOpis,
    transformCategories,
    transformAndFormatCategories,
    ukloniKvacicu,
    generirajLozinku,
}