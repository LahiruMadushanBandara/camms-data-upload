import { Worksheet } from 'exceljs';
import { WorkflowElementInfo } from '../models/WorkflowElementInfo.model';

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
    sheet: Worksheet
  ): Worksheet {
    var fieldNum = 1;
    var fildLetter = '';
    types.forEach((x: WorkflowElementInfo) => {
      switch (x.dataTypeName) {
        case 'INTEGER':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell(fildLetter + i).dataValidation = {
              type: 'custom',
              allowBlank: false,
              showErrorMessage: true,
              error: 'Please enter Integer',
              errorTitle: 'Invalid phone number Format',
              formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`],
            };
          }

          break;
        case 'DATETIME':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell('D' + i).dataValidation = {
              type: 'custom',
              allowBlank: true,
              showErrorMessage: true,
              error: 'Please enter valid email',
              errorTitle: 'Invalid email format',
              formulae: [`=ISNUMBER(MATCH("*@*.?*",D${i},0))`],
            };
          }
          break;
        case 'TEXT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          console.log(fildLetter);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell(fildLetter + i).dataValidation = {
              type: 'custom',
              allowBlank: false,
              showErrorMessage: true,
              error: 'Please enter valid phone number',
              errorTitle: 'Invald formt',
              formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`],
            };
          }
          break;
        case 'MULTILINETEXT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NUMERIC':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BIT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'STAFF':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'STAFF_MULTISELECT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT_MULTISELECT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'MULTISELECT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'SINGLESELECT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCODEANDTITLE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RADIOBUTTON':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RISKRATINGTYPE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTPRIORITYTYPE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTSEVERITYTYPE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INVESTIGATIONSTATUS':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'LASTREVIEWEDBY':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'LASTEREVIEWEDDATE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NEXTREVIEWDATE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'REVIEWCOMMENT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCATEGORY':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RICHTEXT':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'ORGANISATION_HIERARCHY_LINK':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTSUBMITTEDDATE':
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
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
}
