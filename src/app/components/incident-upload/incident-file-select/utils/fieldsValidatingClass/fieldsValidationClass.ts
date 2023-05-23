import { Worksheet } from 'exceljs';
import { WorkflowElementInfo } from '../../../../../models/WorkflowElementInfo.model';
import { dropDownListHandlingClass } from '../listCreatingClass/dropDownListHandligClass';
import { dropDownReference } from '../listCreatingClass/models/dropDownReference.model';

export class fieldsValidationClass {
  constructor() {}

  public getFinalArray(types: WorkflowElementInfo[]): WorkflowElementInfo[] {
    var finalArray: WorkflowElementInfo[] = [];
    types.forEach((x: WorkflowElementInfo) => {
      switch (x.dataTypeName) {
        case 'INTEGER':
          finalArray.push(x);
          break;
        case 'DATETIME':
          finalArray.push(x);
          break;
        case 'TEXT':
          finalArray.push(x);
          break;
        case 'MULTILINETEXT':
          finalArray.push(x);
          break;
        case 'NUMERIC':
          finalArray.push(x);
          break;
        case 'BIT':
          finalArray.push(x);
          break;
        case 'STAFF':
          finalArray.push(x);
          break;
        case 'STAFF_MULTISELECT':
          finalArray.push(x);
          break;
        case 'BUSINESSUNIT':
          finalArray.push(x);
          break;
        case 'BUSINESSUNIT_MULTISELECT':
          finalArray.push(x);
          break;
        case 'MULTISELECT':
          finalArray.push(x);
          break;
        case 'SINGLESELECT':
          finalArray.push(x);
          break;
        case 'INCIDENTCODEANDTITLE':
          finalArray.push(x);
          break;
        case 'RADIOBUTTON':
          finalArray.push(x);
          break;
        case 'RISKRATINGTYPE':
          finalArray.push(x);
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          finalArray.push(x);
          break;
        case 'INCIDENTPRIORITYTYPE':
          finalArray.push(x);
          break;
        case 'INCIDENTSEVERITYTYPE':
          finalArray.push(x);
          break;
        case 'INVESTIGATIONSTATUS':
          finalArray.push(x);
          break;
        case 'LASTREVIEWEDBY':
          finalArray.push(x);
          break;
        case 'LASTEREVIEWEDDATE':
          finalArray.push(x);
          break;
        case 'NEXTREVIEWDATE':
          finalArray.push(x);
          break;
        case 'REVIEWCOMMENT':
          finalArray.push(x);
          break;
        case 'INCIDENTCATEGORY':
          finalArray.push(x);
          break;
        case 'RICHTEXT':
          finalArray.push(x);
          break;
        case 'ORGANISATION_HIERARCHY_LINK':
          finalArray.push(x);
          break;
        case 'INCIDENTSUBMITTEDDATE':
          finalArray.push(x);
          break;
        default:
          console.log(
            'ignore - ',
            x.propertyDisplayText,
            ',type - ',
            x.dataTypeName,
            ',require - ',
            x.isRequired
          );
          break;
      }
    });
    return finalArray;
  }
  public fieldsValidationFunction(
    types: WorkflowElementInfo[],
    sheet: Worksheet,
    listSheet: Worksheet
  ): Worksheet {
    const dropDownListHandling = new dropDownListHandlingClass();
    var fieldNum = 1;
    var fieldLetter = '';
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: 'Z',
      refNum: 0,
      listLen: 0,
    };
    types.forEach((x: WorkflowElementInfo) => {
      switch (x.dataTypeName) {
        case 'INTEGER':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          break;
        case 'DATETIME':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //add time validation

          this.dateValidation2(fieldLetter, x.isRequired, sheet);
          break;
        case 'TEXT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell(fieldLetter + i).dataValidation = {
              type: 'custom',
              allowBlank: false,
              showErrorMessage: true,
              error: 'Please enter valid phone number',
              errorTitle: 'Invald format',
              formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`],
            };
          }
          break;
        case 'MULTILINETEXT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NUMERIC':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.numberValidation(fieldLetter, 100, 1000, x.isRequired, sheet);
          break;
        case 'BIT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.numberValidation(fieldLetter, 0, 1, x.isRequired, sheet);
          break;
        case 'STAFF':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'STAFF_MULTISELECT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT_MULTISELECT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'MULTISELECT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'SINGLESELECT':
          // dropDownReferenceList = dropDownListHandling.selectDropDown(
          //   x.fieldName,
          //   listSheet
          // );
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          // this.singleSelectDropDown(
          //   fieldLetter,
          //   dropDownReferenceList.listLen,
          //   x.isRequired,
          //   sheet,
          //   'TempData',
          //   dropDownReferenceList.refLetter + dropDownReferenceList.refNum
          // );
          break;
        case 'INCIDENTCODEANDTITLE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'TempData',
            'A'
          );
          break;
        case 'RADIOBUTTON':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'RISKRATINGTYPE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'INCIDENTPRIORITYTYPE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'INCIDENTSEVERITYTYPE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'INVESTIGATIONSTATUS':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          break;
        case 'LASTREVIEWEDBY':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //stafflist
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'TempData',
            'A'
          );
          break;
        case 'LASTEREVIEWEDDATE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NEXTREVIEWDATE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.dateValidation(fieldLetter, x.isRequired, sheet);
          break;
        case 'REVIEWCOMMENT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCATEGORY':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          this.singleSelectDropDown(
            fieldLetter,
            4,
            x.isRequired,
            sheet,
            'DataTable',
            'A'
          );
          fieldNum++;
          break;
        case 'RICHTEXT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'ORGANISATION_HIERARCHY_LINK':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTSUBMITTEDDATE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          break;

        default:
          console.log(
            'ignore - ',
            x.propertyDisplayText,
            ',type - ',
            x.dataTypeName,
            ',require - ',
            x.isRequired
          );
          break;
      }
    });
    return sheet;
  }

  //This function is use to set mandortory fields , if we give numeric value it retuns column name ex - (1- 'A' , 27 - 'AA' , 28 - 'AB')
  private returnExcelCoulmnForNumericValue(index: number): string {
    let result = '';
    while (index > 0) {
      const remainder = (index - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      index = Math.floor((index - 1) / 26);
    }
    return result;
  }

  //function for dropdown
  private singleSelectDropDown(
    fieldLetter: string,
    length: number,
    require: boolean,
    sheet: Worksheet,
    dataTableName: string,
    dataTableCell: string
  ) {
    for (let i = 2; i < 5000; i++) {
      sheet.getCell(fieldLetter + i).dataValidation = {
        type: 'list',
        allowBlank: !require,
        showErrorMessage: true,
        formulae: [
          `=${dataTableName}!${dataTableCell}:$${dataTableCell}${length}`,
        ],
        // formulae: [`=DataTables!$F$2:$F${hierarchies.length + 1}`]
      };
    }
  }

  //function for date
  private dateValidation(
    fieldLetter: string,
    require: boolean,
    sheet: Worksheet
  ) {
    for (let i = 2; i < 5000; i++) {
      sheet.getCell(fieldLetter + i).dataValidation = {
        type: 'custom',
        allowBlank: !require,
        showErrorMessage: true,
        error: 'Please enter correct date',
        errorTitle: 'Incorrect date format - mm/dd/yyyy',
        formulae: [`=AND(ISNUMBER(I${i}),LEFT(CELL("format",I${i}),1)="D")`],
      };
    }
  }
  private dateValidation2(
    fieldLetter: string,
    require: boolean,
    sheet: Worksheet
  ) {
    for (let i = 2; i < 5000; i++) {
      sheet.getCell(fieldLetter + i).dataValidation = {
        type: 'custom',
        showErrorMessage: true,
        error: 'Please enter correct date',
        errorTitle: 'Incorrect date format - mm/dd/yyyy',
        formulae: [
          `=AND(ISNUMBER(${fieldLetter}${i}),LEFT(CELL("format",${fieldLetter}${i}),1)="D")`,
        ],
      };
    }
  }

  private numberValidation(
    fieldLetter: string,
    minVal: number,
    maxVal: number,
    require: boolean,
    sheet: Worksheet
  ) {
    for (let i = 2; i < 5000; i++) {
      sheet.getCell(fieldLetter + i).dataValidation = {
        type: 'custom',
        allowBlank: !require,
        showErrorMessage: true,
        error: 'Enter  a number from ${minVal} to ${maxVal}',
        errorTitle: `Invalid number Format`,
        formulae: [
          `=AND(ISNUMBER(${fieldLetter}${i}), LEN(${fieldLetter}${i})>=${minVal} , LEN(${fieldLetter}${i})<=${maxVal})`,
        ],
      };
    }
  }
}
