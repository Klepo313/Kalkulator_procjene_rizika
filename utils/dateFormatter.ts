// utils/dateFormatter.ts

// Za funkciju formatDateToDMY – svaki item mora imati tdg_grid (ključ) i tdg_rbr (redoslijed)
export function formatDateToDMY(dateString: string, delimiter: string): string {
    const date = new Date(dateString);

    // Dohvati dan, mjesec i godinu u lokalnom vremenu
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Siječanj je 0, pa se dodaje 1
    const year = date.getFullYear();

    if (delimiter === '.') {
        // Ako se koristi točka, pretvara se dan u broj da se ukloni vodeća nula
        return `${parseInt(day, 10)}${delimiter}${month}${delimiter}${year}`;
    } else {
        return `${year}${delimiter}${month}${delimiter}${day}`;
    }
}

/**
 * Pretvara ISO timestamp u JavaScript Date objekt.
 * @param isoString ISO 8601 string, npr. "2025-04-22T16:51:33.634Z"
 * @returns Date objekt s ispravnim vremenom
 */
export const parseIsoToDate = (isoString: string): Date => {
    return new Date(isoString);
};


/**
 * Vraća formatirani datum u formatu dd.mm.yyyy.
 * @param dateString Datum u formatu yyyy-mm-dd.
 * @returns Datum u formatu dd.mm.yyyy.
 * */
export function formatDMYtoYMD(dateString: string): string {
    const [day, month, year] = dateString.split('.');

    // Vraća formatirani datum kao yyyy-mm-dd
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Vraća formatirani datum u ISO 8601 formatu.
 * @param date Datum u obliku Date.
 * @returns Datum u ISO 8601 formatu.
 * @throws Error ako je ulazni datum nevaljan.
 * */
export function formatDateToISO(date: Date): string {
    // Provjera je li ulaz valjani Date objekt
    if (!(date instanceof Date)) {
        throw new Error("Invalid Date object");
    }
    return date.toISOString();
}

/**
 * Vraća raspon godina iz dva datuma.
 * @param datod Početni datum u formatu dd.mm.yyyy.
 * @param datdo Krajnji datum u formatu dd.mm.yyyy.
 * @returns Raspon godina.  
 * */
export function getYearsRange(datod: string, datdo: string): string {
    const startYear = new Date(datod).getUTCFullYear();
    const endYear = new Date(datdo).getUTCFullYear();

    // Ako su početna i krajnja godina iste, prikaži samo jednu godinu
    if (startYear === endYear) {
        return `${startYear}`;
    }

    // Inače, prikaži raspon godina
    return `${startYear} - ${endYear}`;
}

/**
 * Uklanja sve znakove koji nisu brojevi iz stringa.
 */
export const formatDateString = (dateString: string): string => {
    return dateString.replace(/[^0-9]/g, '');
};

/**
 * 
 * @param n Broj godina
 * @returns riječ godina
 */
export const getYearWord = (n: number): string => {
    if (n === 1) return "godina";
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "godine";
    return "godina";
};

/**
 * 
 * @param n Broj mjeseci
 * @returns riječ mjeseci
 */
export const getMonthWord = (n: number): string => {
    if (n === 1) return "mjesec";
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "mjeseca";
    return "mjeseci";
};

/**
 * 
 * @param n Broj dana
 * @returns riječ dana
 */
const getDayWord = (n: number): string => (n === 1 ? "dan" : "dana");

/**
 * 
 * @param date Datum
 * @returns Vraća raspon godina, mjeseci i dana
 */
export const getTimeLeft = (date: Date | string): string => {
    const today = new Date();
    const endDate = new Date(date);
    const timeDiff = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft >= 3650) {
        return 'Trajno';
    } else if (daysLeft >= 365) {
        const years = Math.floor(daysLeft / 365);
        const remainingDays = daysLeft % 365;
        const months = Math.floor(remainingDays / 30);
        const days = remainingDays % 30;
        let result = `${years} ${getYearWord(years)}`;
        if (months > 0) {
            result += `, ${months} ${getMonthWord(months)}`;
        }
        if (days > 0) {
            result += `, ${days} ${getDayWord(days)}`;
        }
        return result;
    } else if (daysLeft >= 30) {
        const months = Math.floor(daysLeft / 30);
        const days = daysLeft % 30;
        let result = `${months} ${getMonthWord(months)}`;
        if (days > 0) {
            result += `, ${days} ${getDayWord(days)}`;
        }
        return result;
    } else {
        return `${daysLeft} ${getDayWord(daysLeft)}`;
    }
};