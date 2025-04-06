import { read, type WorkBook } from 'xlsx';

/**
 * Loads an Excel file from the specified file path and returns the parsed workbook.
 *
 * @param {string} filePath - The path or URL to the Excel file.
 * @returns {Promise<WorkBook>} A promise that resolves to the parsed Excel workbook.
 * @throws Will throw an error if the file cannot be fetched or read.
 */
export const loadExcelFile = async (filePath: string): Promise<WorkBook> => {
  try {
    const response = await fetch(filePath);
    const blob = await response.blob();
    const fileBuffer = await blob.arrayBuffer();
    const workbook: WorkBook = read(fileBuffer);
    // console.log('Excel file loaded successfully:', workbook);
    return workbook;
  } catch (error) {
    // console.error('Error loading Excel file:', error);
    throw error;
  }
};