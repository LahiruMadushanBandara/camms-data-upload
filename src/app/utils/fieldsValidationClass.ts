import { Worksheet } from 'exceljs';
import { WorkflowElementInfo } from '../models/WorkflowElementInfo.model';

export class fieldsValidationClass {
  constructor() {}
  public fieldsValidationFunction(
    types: WorkflowElementInfo[],
    sheet: Worksheet
  ): WorkflowElementInfo[] {
    var finalArray: WorkflowElementInfo[] = [];
    var fieldNum = 1;
    var fildLetter = '';
    types.forEach((x: WorkflowElementInfo) => {
      switch (x.dataTypeName) {
        case 'INTEGER':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell(fildLetter + i).dataValidation = {
              type: 'custom',
              allowBlank: true,
              showErrorMessage: true,
              error: 'Please enter Integer',
              errorTitle: 'Invalid phone number Format',
              formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`],
            };
          }

          break;
        case 'DATETIME':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'TEXT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          for (let i = 2; i < 5000; i++) {
            sheet.getCell(fildLetter + i).dataValidation = {
              type: 'custom',
              allowBlank: true,
              showErrorMessage: true,
              error: 'Please enter valid phone number',
              errorTitle: 'Invalid phone number Format',
              formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`],
            };
          }
          break;
        case 'MULTILINETEXT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NUMERIC':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BIT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'STAFF':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'STAFF_MULTISELECT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'BUSINESSUNIT_MULTISELECT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'MULTISELECT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'SINGLESELECT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCODEANDTITLE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RADIOBUTTON':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RISKRATINGTYPE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTPRIORITYTYPE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTSEVERITYTYPE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INVESTIGATIONSTATUS':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'LASTREVIEWEDBY':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'LASTEREVIEWEDDATE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'NEXTREVIEWDATE':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'REVIEWCOMMENT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTCATEGORY':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'RICHTEXT':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'ORGANISATION_HIERARCHY_LINK':
          finalArray.push(x);
          fildLetter = this.returnExcelCoulmnForNumericValue(fieldNum);
          fieldNum++;
          break;
        case 'INCIDENTSUBMITTEDDATE':
          finalArray.push(x);
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
    return finalArray;
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
