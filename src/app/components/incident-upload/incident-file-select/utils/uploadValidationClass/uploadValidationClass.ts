import { Workbook } from 'exceljs';

export class uploadValidationClass {
  constructor() {}
  public run() {
    console.log('Hi');
  }

  public async readExcel(codes: any, arryBuffer?: Promise<ArrayBuffer>) {
    var lastCellLetter: string;
    const workbook = new Workbook();
    arryBuffer?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });
        let rangeCell = `A2:${lastCellLetter}${rowCount}`;
        console.log(rowCount);
      });
    });
  }
}
