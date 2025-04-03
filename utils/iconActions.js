export const getVehicleIcon = (vrstaVozila) => {
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
            return 'oil-can'; // Ikona za osobno vozilo
        case ('Biodizel', 'B20 biodizel', 'Nepokretni izvori'):
            return 'gas-pump'; // Ikona za teretno vozilo
        case ('UNP', 'LPG', 'CNG', 'E85 Etanol'):
            return 'bottle-droplet'; // Ikona za stroj
        default:
            return 'car'; // Default ikona ako nije specificirano
    }
};

export const getStatusLabel = (status) => {
    switch (status) {
        case 'D':
            return 'success';
        case 'Da':
            return 'success';
        case 'N':
            return 'danger';
        case 'Ne':
            return 'danger';
        default:
            return 'secondary';
    }
};

export const getSeverity = (status) => {
    switch (status) {
        case 1:
            return 'success'
        case false:
            return 'danger';
        default:
            return 'info';
    }
}