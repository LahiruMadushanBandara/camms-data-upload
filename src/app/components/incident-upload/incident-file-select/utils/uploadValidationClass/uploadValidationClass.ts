import { Workbook } from 'exceljs';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';

export class uploadValidationClass {
  constructor() {}
  public run() {
    console.log('Hi');
  }

  public async readExcel(
    lastCellLetter: string,
    workflowElementInfoFinal: WorkflowElementInfo[],
    codes: any,
    arryBuffer?: Promise<ArrayBuffer>
  ) {
    const workbook = new Workbook();
    arryBuffer?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });
        console.log(lastCellLetter);
        let rangeCell = `A2:${lastCellLetter}${rowCount}`;
        const [startCell, endCell] = rangeCell.split(':');
        const [endCellColumn, endRow] = endCell.match(
          /[a-z]+|[^a-z]+/gi
        ) as string[];
        const [startCellColumn, startRow] = startCell.match(
          /[a-z]+|[^a-z]+/gi
        ) as string[];

        let endColumn = worksheet.getColumn(endCellColumn);
        let startColumn = worksheet.getColumn(startCellColumn);
        if (!endColumn) throw new Error('End column not found');
        if (!startColumn) throw new Error('Start column not found');
        const endColumnNumber = endColumn.number;
        const startColumnNumber = startColumn.number;
        console.log(endColumnNumber, startColumnNumber);

        let errorList = [];

        var regExp = /\(([^)]+)\)/;
        var regExAlpanumeric = /^[a-zA-Z0-9 -_]*$/;
        var regexAllowCharactersNoSpace = /^[a-zA-Z0-9-.@_]*$/;
        var regexAllowCharacters = /^[a-zA-Z0-9-.@_ ]*$/;
        var regExAlpanumericNoSpaces = /^[A-Za-z0-9]*$/;

        if (rowCount > 5000) {
          let data = {
            RowNo: '',
            Column: '',
            ValueEntered: '',
            ErrorMessage: 'Maximum Record Limit Exceeded',
            ExpectedType: 'Less than 5000 records',
          };
          errorList.push(data);
        }

        //go thorugh select row
        for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
          const row = worksheet.getRow(y);
          console.log('Y', y);
          for (let x = startColumnNumber; x <= endColumnNumber; x++) {
            let cell = row.getCell(x);
            let cellVal = cell.value ? cell.value.toString() : '';
            let rowNo = row.number.toString();
            console.log(
              'cell->',
              cell,
              'cellAddress',
              cell.address,
              'cellVal->',
              cellVal,
              'rowNo->',
              rowNo
            );
          }
        }
      });
    });
  }
}
