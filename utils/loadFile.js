import { read } from 'xlsx';

// Funkcija za učitavanje Excel datoteke
export const loadExcelFile = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const blob = await response.blob();
        const file = await blob.arrayBuffer();
        const workbook = read(file);

        // console.log('Excel file loaded successfully:', workbook);

        return workbook;
    } catch (error) {
        // console.error('Error loading Excel file:', error);
        throw error;
    }
};
