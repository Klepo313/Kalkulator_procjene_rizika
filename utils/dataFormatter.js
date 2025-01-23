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

const formatNumber = (value, maxDigitNumber) => {
    // return new Intl.NumberFormat('en-US').format(value);
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: maxDigitNumber || 2 }).format(value);
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


function splitOpis(opis) {
    return opis.split('-').filter(item => item.trim() !== '').map(item => item.trim());
}

function formatOpis(opis) {
    return opis.split('-').map(item => item.trim()).join('<br />');
}

const formatEndl = (tekst) => {
    if (typeof tekst !== 'string') return []; // Provjeri je li ulaz string

    // Podijeli tekst na dijelove prema crtici '-', uključujući prazne linije
    const dijelovi = tekst.split('\n'); // Razdvajanje prema linijama (novi red)

    // Procesiranje linija kako bi se zadržale crtice i formatiranje
    return dijelovi.map((linija) => {
        const trimmedLine = linija.trim(); // Ukloni višak razmaka
        if (trimmedLine.startsWith('-')) {
            // Ako linija počinje s '-', zadrži je kako jest
            return trimmedLine;
        }
        // Ako linija ne počinje s '-', samo vrati trimovanu liniju
        return trimmedLine;
    });
};


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

function calculatePercentage(data) {
    // Provjera i pretvaranje elemenata u brojeve
    const numericData = data.map(value => Number(value));

    // Izračun ukupne sume elemenata
    const total = numericData.reduce((sum, value) => sum + value, 0);

    // Izračun postotaka za svaki element
    const percentages = numericData.map(value => ((value / total) * 100).toFixed(2));

    // Vraćanje niza s postotcima
    return percentages;
}

export {
    restructureData,
    formatNumber,
    truncateText,
    splitOpis,
    formatOpis,
    formatEndl,
    advancedFormatOpis,
    transformCategories,
    transformAndFormatCategories,
    ukloniKvacicu,
    generirajLozinku,
    calculatePercentage
}