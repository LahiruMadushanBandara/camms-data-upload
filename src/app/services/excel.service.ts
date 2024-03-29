import { Injectable } from '@angular/core';
import * as FileSaver from "file-saver";
import * as ExcelJS from "exceljs";


const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public async exportAsExcelFile(workbookData: any[], excelFileName: string) {
    const workbook = new ExcelJS.Workbook();

      const sheet = workbook.addWorksheet("errors");
      this.CreateHeadersAndRows(workbookData,sheet);

      this.FormatSheet(sheet)
    
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, excelFileName);
  }

  public getSpreadSheetCellNumber(row:any, column:any) {
    let result = "";

    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }

    // Get spreadsheet row number
    result += `${row + 1}`;

    return result;
  }

  public FormatSheet(sheet:ExcelJS.Worksheet){
    sheet.columns.forEach(column => {
      column.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      column.width = 20
    });

    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C0C0C0' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: '#000000' },
        size: 11
      }
    })
  }

  public CreateHeadersAndRows(workbookData: any[], worksheet:ExcelJS.Worksheet){
    const uniqueHeaders = [
      ...new Set(
        workbookData.reduce((prev:any, next:any) => [...prev, ...Object.keys(next)], [])
      )
    ];
    worksheet.columns = uniqueHeaders.map((x:any) => ({ header: x, key: x }));

    workbookData.forEach((jsonRow:any, i:any) => {
      let cellValues = { ...jsonRow };

      uniqueHeaders.forEach((header:any, j) => {
        if (Array.isArray(jsonRow[header])) {
          cellValues[header] = "";
        }
      });
      worksheet.addRow(cellValues);
      uniqueHeaders.forEach((header:any, j) => {
        if (Array.isArray(jsonRow[header])) {
          const jsonDropdown = jsonRow[header];
          worksheet.getCell(
            this.getSpreadSheetCellNumber(i + 1, j)
          ).dataValidation = {
            type: "list",
            formulae: [`"${jsonDropdown.join(",")}"`]
          };
        }
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
