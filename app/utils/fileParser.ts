import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parses a file and returns an array of strings (one per row/item)
 * @param file The file to parse
 * @returns Promise that resolves to an array of strings (one per row)
 */
export const parseFileToRows = async (file: File): Promise<string[]> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Handle Excel files
  if (fileExt === 'xlsx' || fileExt === 'xls') {
    return parseExcel(file);
  }
  
  // Handle CSV and text files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        const content = event.target.result;
        
        // Parse based on file type
        switch (fileExt) {
          case 'csv': 
            // Use PapaParse for CSV files
            Papa.parse(content, {
              complete: (results) => {
                try {
                  // Convert the parsed data to strings
                  const rows = results.data
                    .filter(row => Array.isArray(row) && row.some(cell => cell && cell.toString().trim() !== ''))
                    .map(row => {
                      // Filter out empty cells and join with commas
                      return (row as any[])
                        .filter(cell => cell && cell.toString().trim() !== '')
                        .map(cell => cell.toString().trim())
                        .join(', ');
                    });
                  
                  resolve(rows);
                } catch (error) {
                  reject(error);
                }
              },
              error: (error: Error | { message: string }) => {
                reject(error);
              }
            });
            break;
            
          case 'txt':
          case 'text':
          case 'md':
          case 'markdown':
          default:
            // Default to line-by-line parsing
            const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
            resolve(lines);
            break;
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error parsing file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parse an Excel file using xlsx
 */
async function parseExcel(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Parse the Excel file
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
        
        // Process rows similar to CSV
        const rows = jsonData
          .filter(row => Array.isArray(row) && row.some((cell: any) => cell !== undefined && cell.toString().trim() !== ''))
          .map(row => {
            return row
              .filter((cell: any) => cell !== undefined && cell.toString().trim() !== '')
              .map((cell: any) => cell.toString().trim())
              .join(', ');
          });
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  });
} 