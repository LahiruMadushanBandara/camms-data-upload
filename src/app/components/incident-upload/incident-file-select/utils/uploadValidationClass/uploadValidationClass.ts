import { Workbook } from 'exceljs';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { workflowElementInfoWithRow } from './models/workflowElementInfoWithRow.model';
import { returnExcelCoulmnForNumericValue } from 'src/app/utils/functions/returnExcelCoulmnForNumericValue';
import { uniqueFieldsSelected } from './models/uniqueFieldsSelected.model';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';

export class uploadValidationClass {
  constructor(private incidentSharedData: IncidentUploadSharedService) {}
  public run() {
    console.log('Hi');
  }

  public async readExcel(
    lastCellLetter: string,
    workflowElementInfoFinal: WorkflowElementInfo[],
    codes: any,
    arryBuffer?: Promise<ArrayBuffer>
  ) {
    let uniqueFieldSelected: uniqueFieldsSelected[] = [];
    //add row name to workflow element info object
    const workFlowWithRow: workflowElementInfoWithRow[] =
      this.mapWorkFlowWithRow(workflowElementInfoFinal);
    console.log('workflowlistwithRow->', workFlowWithRow);
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
        var IncidentBulk: any[] = [];
        var model: any = {};
        //go thorugh select row
        for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
          const row = worksheet.getRow(y);

          // console.log('Y', y);
          for (let x = startColumnNumber; x <= endColumnNumber; x++) {
            let cell = row.getCell(x);
            let cellVal = cell.value ? cell.value.toString() : null;
            let rowNo = row.number.toString();
            if (this.checkString(workFlowWithRow[x - 1].propertyDisplayText)) {
              //Set uniqueFields to array
              if (
                !uniqueFieldSelected.find(
                  (value) => value.ColumnLetter == workFlowWithRow[x - 1].row
                )
              ) {
                uniqueFieldSelected.push({
                  propertyDisplayText:
                    workFlowWithRow[x - 1].propertyDisplayText,
                  ColumnLetter: workFlowWithRow[x - 1].row,
                  ColumnNumber: x,
                });
                console.log('uniqueFielsSelected->', uniqueFieldSelected);
              }
            }

            if (cellVal != null) {
              model[`${workFlowWithRow[x - 1].propertyDisplayText}`] = cellVal;
              if (
                uniqueFieldSelected.find(
                  (value) => value.ColumnLetter == workFlowWithRow[x - 1].row
                )
              ) {
                if (!regexAllowCharactersNoSpace.test(cellVal)) {
                  let data = {
                    RowNo: rowNo,
                    Column: `${workFlowWithRow[x - 1].propertyDisplayText}`,
                    ValueEntered: cellVal,
                    ErrorMessage: 'Invalid Cell Data',
                    ExpectedType: 'Alphanumerics',
                  };
                  errorList.push(data);
                }
              }
            } else {
              //filter sheet value is null but Required fields
              if (workFlowWithRow[x - 1].isRequired) {
                console.log(
                  'In sheeet null but Required->',
                  workFlowWithRow[x - 1].propertyDisplayText
                );
                let data = {
                  RowNo: rowNo,
                  Column: workFlowWithRow[x - 1].propertyDisplayText,
                  ValueEntered: cell.value,
                  ErrorMessage: `${
                    workFlowWithRow[x - 1].propertyDisplayText
                  } Column ${y} row Value is empty (This is Required Fileld)`,
                  ExpectedType: 'Alphanumerics',
                };
                errorList.push(data);
              }
            }
          }
          IncidentBulk.push(model);
          model = {};
        }
        var duplicateValuesInUniqueFields: any;
        for (let i = 0; i < uniqueFieldSelected.length; i++) {
          const fieldDisplayName = uniqueFieldSelected[i].propertyDisplayText;
          console.log('fieldDisplayName->', fieldDisplayName);
          duplicateValuesInUniqueFields = IncidentBulk.map(
            (v) => v[`${uniqueFieldSelected[i].propertyDisplayText}`]
          ).filter((v, i, vIds) => vIds.indexOf(v) !== i);

          if (duplicateValuesInUniqueFields.length > 0) {
            console.log(
              'duplicateValuesInUniqueFields.length->',
              duplicateValuesInUniqueFields.length
            );
            for (let j = 0; j < duplicateValuesInUniqueFields.length; j++) {
              let data = {
                RowNo: '',
                Column: fieldDisplayName,
                ValueEntered: duplicateValuesInUniqueFields[j],
                ErrorMessage: `${fieldDisplayName} field Cannot be Duplicated`,
                ExpectedType: `Duplicate Cell Data`,
              };
              errorList.push(data);
            }
          }
        }
        this.incidentSharedData.changeDataList(IncidentBulk, errorList);
        console.log('duplicateIds->', duplicateValuesInUniqueFields);
        console.log('errorList - >', errorList);
        console.log('IncidentBulk ->', IncidentBulk);
      });
    });
  }

  private mapWorkFlowWithRow(workflowElementInfoFinal: WorkflowElementInfo[]) {
    const workFlowWithRow: workflowElementInfoWithRow[] = [];
    for (let i = 0; i < workflowElementInfoFinal.length; i++) {
      workFlowWithRow[i] = {
        fieldName: workflowElementInfoFinal[i].fieldName,
        dataTypeName: workflowElementInfoFinal[i].dataTypeName,
        propertyDisplayText: workflowElementInfoFinal[i].propertyDisplayText,
        isRequired: workflowElementInfoFinal[i].isRequired,
        isVisibleInDetail: workflowElementInfoFinal[i].isVisibleInDetail,
        row: returnExcelCoulmnForNumericValue(i + 1),
      };
    }
    return workFlowWithRow;
  }
  private checkString(input: string): boolean {
    const lowerCase = input.toLowerCase();
    return (
      lowerCase.endsWith('code') ||
      lowerCase.endsWith('no') ||
      lowerCase.endsWith('id')
    );
  }
}
