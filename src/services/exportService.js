// Export functionality for CSV and PDF

import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';

/**
 * Export item data to CSV format
 * @param {Array} columnValues - Array of column value objects
 * @param {string} itemName - Name of the item
 */
export const exportToCSV = (columnValues, itemName = 'item') => {
  try {
    // Prepare data for CSV
    const csvData = columnValues.map(column => ({
      'Field Name': column.title,
      'Field Value': column.text || '',
      'Field Type': column.type
    }));

    // Convert to CSV using papaparse
    const csv = Papa.unparse(csvData);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${itemName.replace(/\s+/g, '_')}_details_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, message: 'CSV exported successfully' };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, message: 'Failed to export CSV' };
  }
};

/**
 * Export item data to PDF format
 * @param {string} elementId - ID of the DOM element to convert to PDF
 * @param {string} itemName - Name of the item
 */
export const exportToPDF = async (elementId, itemName = 'item') => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }

    const opt = {
      margin: 10,
      filename: `${itemName.replace(/\s+/g, '_')}_details_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    
    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, message: 'Failed to export PDF' };
  }
};

/**
 * Prepare item data for export (sanitize and format)
 * @param {Array} columnValues - Array of column value objects
 */
export const prepareExportData = (columnValues) => {
  return columnValues.map(column => ({
    ...column,
    text: column.text || 'N/A',
    displayValue: getDisplayValue(column)
  }));
};

/**
 * Get display value for a column based on its type
 * @param {Object} column - Column value object
 */
const getDisplayValue = (column) => {
  if (!column.value) return column.text || 'N/A';
  
  try {
    const parsedValue = JSON.parse(column.value);
    
    // Handle specific column types
    switch (column.type) {
      case 'multiple-person':
      case 'people':
        return parsedValue.personsAndTeams?.map(p => p.name).join(', ') || column.text;
      
      case 'date':
      case 'timeline':
        return parsedValue.date || column.text;
      
      case 'tags':
        return parsedValue.tag_ids?.join(', ') || column.text;
      
      default:
        return column.text || 'N/A';
    }
  } catch {
    return column.text || 'N/A';
  }
};
