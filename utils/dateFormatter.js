// utils/dateFormatter.js
export function formatDateToDMY(dateString, delimiter) {
    const date = new Date(dateString);

    // Get day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0'); // pad with leading zero if needed
    const month = String(date.getUTCMonth()).padStart(2, '0'); // January is 0!
    const year = date.getUTCFullYear();

    if (delimiter == '.') {
        return `${parseInt(day)}${delimiter}${month}${delimiter}${year}`;
    } else {
        return `${year}${delimiter}${month}${delimiter}${day}`;
    }
}

export function formatDMYtoYMD(dateString) {
    const [day, month, year] = dateString.split('.');

    // Return formatted date as yyyy-mm-dd
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function formatDateToISO(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        throw new Error("Invalid Date object");
    }

    return date.toISOString();
}

export function getYearsRange(datod, datdo) {
    const startYear = new Date(datod).getUTCFullYear();
    const endYear = new Date(datdo).getUTCFullYear();

    // Ako je početna i krajnja godina ista, prikaži samo jednu godinu
    if (startYear === endYear) {
        return `${startYear}`;
    }

    // Ako su različite, prikaži raspon godina
    return `${startYear} - ${endYear}`;
}

