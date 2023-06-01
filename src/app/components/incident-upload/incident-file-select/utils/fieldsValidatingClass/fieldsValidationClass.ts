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
        case 'DATEPICKER':
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
    displayingSheet: Worksheet,
    listSheet: Worksheet
  ): Worksheet {
    const dropDownListHandling = new dropDownListHandlingClass();
    var fieldNum = 1;
    var fieldLetter = '';
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
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
          this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
          break;
        case 'TEXT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //if end of fildname include 'id' , 'code' , 'no' add unique field validation
          this.uniqueValidation(
            fieldLetter,
            x.isRequired,
            displayingSheet,
            x.fieldName,
            x.propertyDisplayText
          );
          break;
        case 'MULTILINETEXT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NUMERIC':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.integerValidation(
            fieldLetter,
            100,
            1000,
            x.isRequired,
            displayingSheet
          );
          break;
        case 'BIT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          this.bitValidation(fieldLetter, x.isRequired, displayingSheet);
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
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'SINGLESELECT':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'INCIDENTCODEANDTITLE':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'RADIOBUTTON':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          // this.singleSelectDropDown(
          //   fieldLetter,
          //   4,
          //   x.isRequired,
          //   displayingSheet,
          //   'DataTable',
          //   'A'
          // );
          break;
        case 'RISKRATINGTYPE':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'INCIDENTPRIORITYTYPE':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'INCIDENTSEVERITYTYPE':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'INVESTIGATIONSTATUS':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'LASTREVIEWEDBY':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
          break;
        case 'LASTEREVIEWEDDATE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //date validation
          this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
          break;
        case 'NEXTREVIEWDATE':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //date validation
          this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
          break;
        case 'REVIEWCOMMENT':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCATEGORY':
          //drop Down part i
          dropDownReferenceList = dropDownListHandling.selectDropDown(
            x.fieldName,
            listSheet
          );
          //field recognition
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;

          //drop down part  ii
          dropDownReferenceList.refLetter != ''
            ? this.singleSelectDropDown(
                fieldLetter,
                dropDownReferenceList.listLen,
                x.isRequired,
                displayingSheet,
                'TempData',
                dropDownReferenceList.refLetter,
                dropDownReferenceList.refNum
              )
            : console.log(
                `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
              );
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
          //date validation
          this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
          break;
        case 'DATEPICKER':
          fieldLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          //date validation
          this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
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
    return displayingSheet;
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

  private singleSelectDropDown(
    fieldLetter: string,
    length: number,
    require: boolean,
    displayingSheet: Worksheet,
    dataTableName: string,
    dataTableCellLetter: string,
    dataTableCellNumber: number
  ) {
    console.log('single DropDowns ->', fieldLetter);
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(fieldLetter + i).dataValidation = {
        type: 'list',
        allowBlank: !require,
        showErrorMessage: true,

        formulae: [
          `=${dataTableName}!$${dataTableCellLetter}$${
            dataTableCellNumber + 1
          }:$${dataTableCellLetter}${length + 1}`,
        ],
      };
    }
  }

  //function for date
  private dateValidation(
    fieldLetter: string,
    require: boolean,
    displayingSheet: Worksheet
  ) {
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(fieldLetter + i).dataValidation = {
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

  //function for integerValidation
  private integerValidation(
    fieldLetter: string,
    minVal: number,
    maxVal: number,
    require: boolean,
    displayingSheet: Worksheet
  ) {
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(fieldLetter + i).dataValidation = {
        type: 'custom',
        allowBlank: !require,
        showErrorMessage: true,
        error: `Enter  a number from ${minVal} to ${maxVal}`,
        errorTitle: `Invalid number Format`,
        formulae: [
          `=AND(ISNUMBER(${fieldLetter}${i}), ${fieldLetter}${i}>=${minVal} , ${fieldLetter}${i}<=${maxVal} , MOD(${fieldLetter}${i},1)=0)`,
        ],
      };
    }
  }

  private bitValidation(
    fieldLetter: string,
    require: boolean,
    displayingSheet: Worksheet
  ) {
    console.log('singleselect dropdown forloop run');
    const dropdownValues = ['True', 'False'];
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(fieldLetter + i).dataValidation = {
        type: 'list',
        formulae: ['"' + dropdownValues.join(',') + '"'],
      };
    }
  }

  private uniqueValidation(
    fieldLetter: string,
    require: boolean,
    displayingSheet: Worksheet,
    fieldName: string,
    displayName: string
  ) {
    if (this.checkString(fieldName)) {
      console.log('Unique Property -> ', displayName);
      for (let i = 2; i < 5000; i++) {
        displayingSheet.getCell(`${fieldLetter}` + i).dataValidation = {
          type: 'custom',
          allowBlank: !require,
          showErrorMessage: true,
          error: `Please enter unique ${displayName}`,
          errorTitle: `Duplicate ${displayName}`,
          formulae: [
            `=COUNTIF($${fieldLetter}$2:$${fieldLetter}${i}, $${fieldLetter}${i})=1`,
          ],
        };
      }
    }
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
