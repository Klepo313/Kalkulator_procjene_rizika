/**
 * Returns the icon name based on the type of vehicle.
 *
 * @param {string} vrstaVozila - The vehicle type.
 *   Expected values:
 *     - 'Osobna vozila' returns 'car-side'
 *     - 'Teretna vozila' returns 'truck'
 *     - 'Strojevi' returns 'tractor'
 *     - 'Zrakoplovi' returns 'plane'
 *     - 'Fugitivne emisije' returns 'atom'
 *     - 'Lož ulje' returns 'oil-can'
 *     - 'Biodizel', 'B20 biodizel', 'Nepokretni izvori' return 'gas-pump'
 *     - 'UNP', 'LPG', 'CNG', 'E85 Etanol' return 'bottle-droplet'
 * @returns {string} The icon name corresponding to the vehicle type.
 */
export const getVehicleIcon = (vrstaVozila: string): string => {
    switch (vrstaVozila) {
        case 'Osobna vozila':
            return 'car-side'; // Ikona za osobno vozilo
        case 'Teretna vozila':
            return 'truck'; // Ikona za teretno vozilo
        case 'Strojevi':
            return 'tractor'; // Ikona za stroj
        case 'Zrakoplovi':
            return 'plane'; // Ikona za zrakoplovo
        case 'Fugitivne emisije':
            return 'atom';
        case 'Lož ulje':
            return 'oil-can';
        case 'Biodizel':
        case 'B20 biodizel':
        case 'Nepokretni izvori':
            return 'gas-pump';
        case 'UNP':
        case 'LPG':
        case 'CNG':
        case 'E85 Etanol':
            return 'bottle-droplet';
        default:
            return 'car'; // Default ikona ako nije specificirano
    }
};

/**
 * Returns a status label based on the provided status.
 *
 * @param {string} status - The status value.
 *   Expected values:
 *     - 'D' or 'Da' return 'success'
 *     - 'N' or 'Ne' return 'danger'
 * @returns {string} The corresponding status label.
 */
export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'D':
        case 'Da':
            return 'success';
        case 'N':
        case 'Ne':
            return 'danger';
        default:
            return 'secondary';
    }
};

/**
 * Returns a severity label based on the provided status.
 *
 * @param {number | boolean} status - The status value.
 *   Expected values:
 *     - 1 returns 'success'
 *     - false returns 'danger'
 * @returns {string} The corresponding severity label.
 */
export const getSeverity = (status: number | boolean): string => {
    switch (status) {
        case 1:
            return 'success';
        case false:
            return 'danger';
        default:
            return 'info';
    }
};
