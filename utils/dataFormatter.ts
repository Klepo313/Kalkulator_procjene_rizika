// const restructureData = (data) => {
//     // Glavni objekt koji će sadržavati razvrstane podobjekte
//     const groupedData = {};

//     data.forEach(item => {
//         const gridKey = item.tdg_grid;

//         // Ako ključ ne postoji, inicijaliziraj prazan niz
//         if (!groupedData[gridKey]) {
//             groupedData[gridKey] = [];
//         }

//         // Gurni trenutni objekt u odgovarajući niz
//         groupedData[gridKey].push(item);
//     });

//     // Sortiraj svaki niz unutar objekta prema tdg_rbr
//     Object.keys(groupedData).forEach(key => {
//         groupedData[key].sort((a, b) => a.tdg_rbr - b.tdg_rbr);
//     });

//     return groupedData;
// }

// const formatNumber = (value, maxDigitNumber) => {
//     return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: maxDigitNumber || 2 }).format(value);
// }

// const formatDateString = (dateString) => {
//     // Uklanja sve ne-brojčane znakove (točka, zarez, crtica, kosa crta itd.)
//     return dateString.replace(/[^0-9]/g, '');
// }

// const truncateText = (text, length) => {
//     return text.length > length ? text.slice(0, length) + '...' : text;
// };

// const transformCategories = (categories) => {
//     // Step 1: Create a map to easily look up objects by their ukt_id (now "key")
//     const map = new Map();

//     // Step 2: Transform ukt_id to key and initialize children array
//     categories.forEach(item => {
//         map.set(item.ukt_id, {
//             ...item,
//             relevant: item.usk_odabran === 'D' ? true : false, // Initialize as false, will set later
//             key: item.ukt_id,
//             children: []
//         });
//         delete map.get(item.ukt_id).ukt_id; // Remove old ukt_id property
//     });

//     // Step 3: Populate children arrays for parent objects
//     const result = [];
//     map.forEach(item => {
//         if (item.ukt_ukt_id) {
//             const parent = map.get(item.ukt_ukt_id);
//             if (parent) {
//                 parent.children.push(item);
//             }
//         } else {
//             result.push(item); // Top-level categories
//         }
//     });

//     return result;
// };


// function splitOpis(opis) {
//     return opis.split('-').filter(item => item.trim() !== '').map(item => item.trim());
// }

// function formatOpis(opis) {
//     return opis.split('-').map(item => item.trim()).join('<br />');
// }

// const formatEndl = (tekst) => {
//     if (typeof tekst !== 'string') return []; // Provjeri je li ulaz string

//     // Podijeli tekst na dijelove prema crtici '-', uključujući prazne linije
//     const dijelovi = tekst.split('\n'); // Razdvajanje prema linijama (novi red)

//     // Procesiranje linija kako bi se zadržale crtice i formatiranje
//     return dijelovi.map((linija) => {
//         const trimmedLine = linija.trim(); // Ukloni višak razmaka
//         if (trimmedLine.startsWith('-')) {
//             // Ako linija počinje s '-', zadrži je kako jest
//             return trimmedLine;
//         }
//         // Ako linija ne počinje s '-', samo vrati trimovanu liniju
//         return trimmedLine;
//     });
// };


// function advancedFormatOpis(opis) {
//     const segments = opis.split(':'); // Dijelimo sadržaj prema dvotočki
//     let formatted = segments[0].trim(); // Prvi dio je uvodni tekst prije dvotočke
//     if (segments.length > 1) {
//         const natuknice = segments[1].split('-').filter(item => item.trim() !== ''); // Razdvajamo natuknice -
//         if (natuknice.length > 0) {
//             formatted += ':<ul class="intern">'; // Početak liste
//             natuknice.forEach(item => {
//                 formatted += `<li class="tab-opis">${item.trim()}</li>`; // Dodavanje svakog elementa liste
//             });
//             formatted += '</ul>'; // Kraj liste
//         }
//     }
//     // Dodavanje preloma linija gdje nema dvotočke
//     return formatted //.replace(/- /g, '<br />'); // style="display:block; margin-bottom: 8px;" 
// }

// function formatDescription(item) {
//     const fieldsToFormat = ["ukt_opis", "ukt_podaci", "ukt_nacin", "ukt_dinamika", "ukt_mingran"];

//     fieldsToFormat.forEach(field => {
//         if (item[field]) {
//             item[field] = item[field].includes('-')
//                 ? splitOpis(item[field]).join('\n- ')
//                 : item[field];
//         }
//     });
// }

// function transformAndFormatCategories(categories) {
//     const transformed = transformCategories(categories);

//     function applyFormattingRecursively(items) {
//         items.forEach(item => {
//             formatDescription(item);
//             if (item.children && item.children.length > 0) {
//                 applyFormattingRecursively(item.children);
//             }
//         });
//     }

//     applyFormattingRecursively(transformed);

//     return transformed;
// }

// const ukloniKvacicu = (str) => {
//     return str
//         .replace(/[š]/g, 's')
//         .replace(/[č]/g, 'c')
//         .replace(/[ć]/g, 'c')
//         .replace(/[đ]/g, 'd')
//         .replace(/[ž]/g, 'z')
//         .replace(/[Š]/g, 'S')
//         .replace(/[Č]/g, 'C')
//         .replace(/[Ć]/g, 'C')
//         .replace(/[Đ]/g, 'D')
//         .replace(/[Ž]/g, 'Z');
// }

// const generirajLozinku = () => {
//     const malaSlova = 'abcdefghijklmnopqrstuvwxyz';
//     const velikaSlova = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const brojevi = '0123456789';
//     const sveZnakovi = malaSlova + velikaSlova + brojevi;

//     const duljina = Math.floor(Math.random() * 3) + 6; // 6 do 8 znakova
//     let lozinka = '';
//     lozinka += malaSlova[Math.floor(Math.random() * malaSlova.length)];
//     lozinka += velikaSlova[Math.floor(Math.random() * velikaSlova.length)];
//     lozinka += brojevi[Math.floor(Math.random() * brojevi.length)];

//     while (lozinka.length < duljina) {
//         lozinka += sveZnakovi[Math.floor(Math.random() * sveZnakovi.length)];
//     }

//     return ukloniKvacicu(lozinka.split('').sort(() => 0.5 - Math.random()).join('')); // Promiješaj znakove i ukloni kvačicu
// }

// function calculatePercentage(data) {
//     // Provjera i pretvaranje elemenata u brojeve
//     const numericData = data.map(value => Number(value));

//     // Izračun ukupne sume elemenata
//     const total = numericData.reduce((sum, value) => sum + value, 0);

//     // Izračun postotaka za svaki element
//     const percentages = numericData.map(value => ((value / total) * 100).toFixed(2));

//     // Vraćanje niza s postotcima
//     return percentages;
// }

// function mapByMatch<T, U>(
//     targetArray: T[],
//     matchingArray: U[],
//     key: keyof T & keyof U
//   ): T[] {
//     return targetArray.map(item => {
//       const matchingItem = matchingArray.find(match => match[key] === item[key]);
//       return {
//         ...item,
//         [key]: matchingItem || item[key],
//       };
//     });
//   }


// export {
//     restructureData,
//     formatNumber,
//     truncateText,
//     splitOpis,
//     formatOpis,
//     formatEndl,
//     advancedFormatOpis,
//     transformCategories,
//     transformAndFormatCategories,
//     ukloniKvacicu,
//     generirajLozinku,
//     calculatePercentage,
//     formatDateString
// }


// utils.ts

// INTERFACE DEFINICIJE



// Za funkciju restructureData – svaki item mora imati tdg_grid (ključ) i tdg_rbr (redoslijed)
interface TdgItem {
    tdg_grid: string;
    tdg_rbr: number;
    [key: string]: any;
}

// Za kategorije – ulazni format
export interface Category {
    ukt_id: string;
    usk_odabran: string;
    ukt_ukt_id?: string;
    [key: string]: any;
}

// Za transformirane kategorije – prebacujemo ukt_id u key, dodajemo relevant i children
export interface TransformedCategory extends Omit<Category, 'ukt_id'> {
    key: string;
    relevant: boolean;
    children: TransformedCategory[];
}

// FUNKCIJE

/**
 * Grupira podatke prema vrijednosti property-ja tdg_grid i sortira svaki podniz prema tdg_rbr.
 */
export const restructureData = (data: TdgItem[]): { [key: string]: TdgItem[] } => {
    const groupedData: { [key: string]: TdgItem[] } = {};

    data.forEach(item => {
        const gridKey = item.tdg_grid;
        if (!groupedData[gridKey]) {
            groupedData[gridKey] = [];
        }
        groupedData[gridKey].push(item);
    });

    Object.keys(groupedData).forEach(key => {
        groupedData[key].sort((a, b) => a.tdg_rbr - b.tdg_rbr);
    });

    return groupedData;
};

/**
 * Formatira broj koristeći njemački format brojeva.
 */
export const formatNumber = (value: number, maxDigitNumber?: number): string => {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDigitNumber || 2,
    }).format(value);
};

/**
 * Skraćuje tekst na zadanu duljinu i dodaje "..." ako je duži.
 */
export const truncateText = (text: string, length: number): string => {
    return text.length > length ? text.slice(0, length) + '...' : text;
};

/**
 * Transformira kategorije: prebacuje ukt_id u key, dodaje relevant (na temelju usk_odabran)
 * i strukturira hijerarhiju prema ukt_ukt_id.
 */
export const transformCategories = (categories: Category[]): TransformedCategory[] => {
    const map = new Map<string, TransformedCategory>();

    categories.forEach(item => {
        map.set(item.ukt_id, {
            ...item,
            relevant: item.usk_odabran === 'D',
            key: item.ukt_id,
            children: [],
        });
        // Ukloni stari property ukt_id
        const mappedItem = map.get(item.ukt_id);
        if (mappedItem) {
            delete mappedItem.ukt_id;
        }
    });

    const result: TransformedCategory[] = [];
    map.forEach(item => {
        if (item.ukt_ukt_id) {
            const parent = map.get(item.ukt_ukt_id);
            if (parent) {
                parent.children.push(item);
            }
        } else {
            result.push(item);
        }
    });

    return result;
};

/**
 * Dijeli opis na dijelove prema crtici, filtrira prazne dijelove te ih trim-a.
 */
export const splitOpis = (opis: string): string[] => {
    return opis
        .split('-')
        .filter(item => item.trim() !== '')
        .map(item => item.trim());
};

/**
 * Formatira opis tako da razdvaja dijelove crticom i dodaje HTML <br />.
 */
export const formatOpis = (opis: string): string => {
    return opis.split('-').map(item => item.trim()).join('<br />');
};

/**
 * Formatira tekst tako da dijeli linije prema novom retku, te čuva crtice.
 */
export const formatEndl = (tekst: string): string[] => {
    if (typeof tekst !== 'string') return [];
    const dijelovi = tekst.split('\n');
    return dijelovi.map(linija => {
        const trimmedLine = linija.trim();
        if (trimmedLine.startsWith('-')) {
            return trimmedLine;
        }
        return trimmedLine;
    });
};

/**
 * Napredni format opisa:
 * Dijeli string prema dvotočki, a nakon toga dijeli natuknice prema crtici
 * i formatira ih kao HTML listu.
 */
export const advancedFormatOpis = (opis: string): string => {
    const segments = opis.split(':');
    let formatted = segments[0].trim();
    if (segments.length > 1) {
        const natuknice = segments[1].split('-').filter(item => item.trim() !== '');
        if (natuknice.length > 0) {
            formatted += ':<ul class="intern">';
            natuknice.forEach(item => {
                formatted += `<li class="tab-opis">${item.trim()}</li>`;
            });
            formatted += '</ul>';
        }
    }
    return formatted;
};

/**
 * Formatira opis za određene fieldove unutar objekta.
 */
export const formatDescription = (item: { [key: string]: any }): void => {
    const fieldsToFormat = [
        "ukt_opis",
        "ukt_podaci",
        "ukt_nacin",
        "ukt_dinamika",
        "ukt_mingran",
    ];

    fieldsToFormat.forEach(field => {
        if (item[field]) {
            item[field] = item[field].includes('-')
                ? splitOpis(item[field]).join('\n- ')
                : item[field];
        }
    });
};

/**
 * Transformira i formatira kategorije rekurzivno.
 */
export const transformAndFormatCategories = (categories: Category[]): TransformedCategory[] => {
    const transformed = transformCategories(categories);

    const applyFormattingRecursively = (items: TransformedCategory[]) => {
        items.forEach(item => {
            formatDescription(item);
            if (item.children && item.children.length > 0) {
                applyFormattingRecursively(item.children);
            }
        });
    };

    applyFormattingRecursively(transformed);

    return transformed;
};

/**
 * Uklanja kvačice i slične znakove iz stringa.
 */
export const ukloniKvacicu = (str: string): string => {
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
};

/**
 * Generira lozinku dužine između 6 i 8 znakova koja sadrži mala i velika slova te brojeve.
 */
export const generirajLozinku = (): string => {
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

    return ukloniKvacicu(
        lozinka
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('')
    );
};

/**
 * Izračunava postotke za niz brojeva ili stringova koje se mogu konvertirati u brojeve.
 */
export const calculatePercentage = (data: Array<number | string>): string[] => {
    const numericData = data.map(value => Number(value));
    const total = numericData.reduce((sum, value) => sum + value, 0);
    const percentages = numericData.map(value => ((value / total) * 100).toFixed(2));
    return percentages;
};

/**
 * Generička funkcija koja mapira niz targetArray i zamjenjuje vrijednosti prema podudaranju s matchingArray.
 */
export function mapByMatch<T, U, K1 extends keyof T, K2 extends keyof U>(
    targetArray: T[],
    matchingArray: U[],
    key_1: K1,
    key_2: K2
): T[] {
    return targetArray.map(item => {
        const matchingItem = matchingArray.find(match => match[key_2] === item[key_1]);
        return {
            ...item,
            // Ažuriramo vrijednost svojstva key_1 ako je pronađen matchingItem
            [key_1]: matchingItem ? matchingItem[key_2] : item[key_1],
            // Dodajemo novo svojstvo "match" u koje spremamo cjelokupni matching objekt
            match: matchingItem,
        };
    });
}

/**
 * Izračunava prosjek za niz brojeva ili stringova koje se mogu konvertirati u brojeve.
 */
export function groupByMatchUvgNaziv<T extends { match?: { uvg_naziv?: string, ugr_naziv?: string } }>(data: T[]): T[] {
    return data.sort((a, b) => {
        const uvgA = a.match?.uvg_naziv || '';
        const uvgB = b.match?.uvg_naziv || '';
        const cmp = uvgA.localeCompare(uvgB);
        if (cmp !== 0) {
            return cmp;
        }
        // Ako su uvg_naziv jednaki, usporedi prema ugr_naziv
        const ugrA = a.match?.ugr_naziv || '';
        const ugrB = b.match?.ugr_naziv || '';
        return ugrA.localeCompare(ugrB);
    });
}


