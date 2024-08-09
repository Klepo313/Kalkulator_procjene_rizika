// utils/dateFormatter.js
export function formatDateToDMY(dateString) {
    const date = new Date(dateString);

    // Get day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0'); // pad with leading zero if needed
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
}
