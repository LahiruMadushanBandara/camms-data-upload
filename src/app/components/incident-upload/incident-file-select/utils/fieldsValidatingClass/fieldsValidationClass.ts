import { Worksheet } from 'exceljs';
import { WorkflowElementInfo } from '../../../../../models/WorkflowElementInfo.model';
import { dropDownListHandlingClass } from '../listCreatingClass/dropDownListHandligClass';
import { dropDownReference } from '../listCreatingClass/models/dropDownReference.model';
import { returnExcelCoulmnForNumericValue } from 'src/app/utils/functions/returnExcelCoulmnForNumericValue';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { IncidentService } from 'src/app/services/incident.service';
import { DropDownReferenceWithfildName } from './models/DropDownReferenceWithfildName.model';

export class fieldsValidationClass {
  public dropDownRefWithField: DropDownReferenceWithfildName[] = [];
  dropDownListHandling: any;
  constructor(
    private incidentData: IncidentUploadSharedService,
    private incidentService: IncidentService
  ) {
    this.dropDownListHandling = new dropDownListHandlingClass(
      this.incidentData,
      this.incidentService
    );
  }

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

  public async fieldsValidationFunction(
    types: WorkflowElementInfo[],
    displayingSheet: Worksheet,
    listSheet: Worksheet
  ): Promise<Worksheet> {
    return new Promise(async (resolve, reject) => {
      var fieldNum = 1;
      var fieldLetter = '';
      //just initializing
      var dropDownReferenceList: dropDownReference = {
        refLetter: '',
        refNum: 0,
        listLen: 0,
      };
      for (const x of types) {
        switch (x.dataTypeName) {
          case 'INTEGER':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'DATETIME':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //add time validation
            this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
            break;
          case 'TEXT':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //if end of fildname include 'id' , 'code' , 'no' add unique field validation
            this.uniqueValidation(
              fieldLetter,
              x.isRequired,
              displayingSheet,
              x.propertyDisplayText
            );
            break;
          case 'MULTILINETEXT':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'NUMERIC':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
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
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            this.bitValidation(fieldLetter, x.isRequired, displayingSheet);
            break;
          case 'STAFF':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'STAFF_MULTISELECT':
            //sepatateapi calls
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'BUSINESSUNIT':
            //sepatateapi calls
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'BUSINESSUNIT_MULTISELECT':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'MULTISELECT':
            console.log('multiselect ----------------->');
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;

            dropDownReferenceList =
              await this.dropDownListHandling.selectDropDown(
                x.fieldName,
                x.dataTypeName,
                listSheet
              );

            console.log('dropDownReferenceList---*a*>', dropDownReferenceList);

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
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'INCIDENTCODEANDTITLE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'RADIOBUTTON':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //(temp for this filed) check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'RISKRATINGTYPE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'INCIDENTLIKELIHOODTYPE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'INCIDENTPRIORITYTYPE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'INCIDENTSEVERITYTYPE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'INVESTIGATIONSTATUS':
            //field recognition
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'LASTREVIEWEDBY':
            //field recognition
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'LASTEREVIEWEDDATE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //date validation
            this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
            break;
          case 'NEXTREVIEWDATE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //date validation
            this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
            break;
          case 'REVIEWCOMMENT':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'INCIDENTCATEGORY':
            //field recognition
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            break;
          case 'RICHTEXT':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'ORGANISATION_HIERARCHY_LINK':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //check require (this valitation is only use if another validations are not in this type)
            if (x.isRequired) {
              this.requireValidation(
                fieldLetter,
                displayingSheet,
                x.propertyDisplayText
              );
            }
            break;
          case 'INCIDENTSUBMITTEDDATE':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
            fieldNum++;
            //date validation
            this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
            break;
          case 'DATEPICKER':
            fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
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
      }
      resolve(displayingSheet);
    });
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
  public mapFieldNameWithDropDownReferenceList(
    types: WorkflowElementInfo[],
    listSheet: Worksheet
  ) {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };
    types.forEach((x: WorkflowElementInfo) => {
      switch (x.dataTypeName) {
        case 'MULTISELECT':
          break;
        case 'SINGLESELECT':
          console.log(
            'dropDownReferenceList single select->',
            dropDownReferenceList
          );

          break;
        case 'INCIDENTCODEANDTITLE':
          break;

        case 'RISKRATINGTYPE':
          break;
        case 'INCIDENTLIKELIHOODTYPE':
          break;
        case 'INCIDENTPRIORITYTYPE':
          break;
        case 'INCIDENTSEVERITYTYPE':
          break;
        case 'INVESTIGATIONSTATUS':
          break;
        case 'LASTREVIEWEDBY':
          break;

        case 'INCIDENTCATEGORY':
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
    const dropdownValues = ['True', 'False'];
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(fieldLetter + i).dataValidation = {
        allowBlank: !require,
        type: 'list',
        formulae: ['"' + dropdownValues.join(',') + '"'],
      };
    }
  }

  //this function for dataType didn't have other validation
  private requireValidation(
    fieldLetter: string,
    displayingSheet: Worksheet,
    displayname: string
  ) {
    for (let i = 2; i < 5000; i++) {
      displayingSheet.getCell(`${fieldLetter}` + i).dataValidation = {
        type: 'custom',
        allowBlank: false,
        showErrorMessage: true,
        error: `Spaces are not allowed for ${displayname} `,
        errorTitle: `Field is Empty `,
        formulae: [`=NOT(ISBLANK(${`${fieldLetter}` + i}))`],
      };
    }
  }

  private uniqueValidation(
    fieldLetter: string,
    require: boolean,
    displayingSheet: Worksheet,
    displayName: string
  ) {
    if (this.checkString(displayName)) {
      console.log('Unique Property -> ', displayName);
      for (let i = 2; i < 5000; i++) {
        displayingSheet.getCell(`${fieldLetter}` + i).dataValidation = {
          type: 'custom',
          allowBlank: !require,
          showErrorMessage: true,
          error: require
            ? `Please enter unique ${displayName} also Spaces are not allowed `
            : `Please enter unique ${displayName} `,
          errorTitle: require
            ? `Duplicate ${displayName} or Field is Empty `
            : `Duplicate ${displayName}`,
          formulae: [
            `=COUNTIF($${fieldLetter}$2:$${fieldLetter}${i}, $${fieldLetter}${i})=1`,
          ],
        };
      }
    } else if (require) {
      this.requireValidation(fieldLetter, displayingSheet, displayName);
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

//  //drop Down part i
//  this.dropDownListHandling
//  .selectDropDown(x.fieldName, x.dataTypeName, listSheet)
//  .then((res: any) => {
//    dropDownReferenceList = res;
//    console.log(
//      'dropDownReferenceList multi select->',
//      dropDownReferenceList
//    );
//    //drop down part  ii
//    dropDownReferenceList.refLetter != ''
//      ? this.singleSelectDropDown(
//          fieldLetter,
//          dropDownReferenceList.listLen,
//          x.isRequired,
//          displayingSheet,
//          'TempData',
//          dropDownReferenceList.refLetter,
//          dropDownReferenceList.refNum
//        )
//      : console.log(
//          `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
//        );
//  });

//  this.dropDownListHandling
//         .selectDropDown(x.fieldName, x.dataTypeName, listSheet)
//         .then((res: any) => {
//           dropDownReferenceList = res;
//           console.log(
//             'dropDownReferenceList multi select----->',
//             dropDownReferenceList
//           );
//           dropDownReferenceList.refLetter != ''
//             ? this.singleSelectDropDown(
//                 fieldLetter,
//                 dropDownReferenceList.listLen,
//                 x.isRequired,
//                 displayingSheet,
//                 'TempData',
//                 dropDownReferenceList.refLetter,
//                 dropDownReferenceList.refNum
//               )
//             : console.log(
//                 `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
//               );
//         });

// public async fieldsValidationFunction(
//   types: WorkflowElementInfo[],
//   displayingSheet: Worksheet,
//   listSheet: Worksheet
// ): Promise<Worksheet> {
//   return new Promise((resolve, reject) => {
//     console.log('field Validation class called');
//     var fieldNum = 1;
//     var fieldLetter = '';
//     //just initializing
//     var dropDownReferenceList: dropDownReference = {
//       refLetter: '',
//       refNum: 0,
//       listLen: 0,
//     };
//     types.forEach((x: WorkflowElementInfo) => {
//       switch (x.dataTypeName) {
//         case 'INTEGER':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'DATETIME':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //add time validation
//           this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;
//         case 'TEXT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //if end of fildname include 'id' , 'code' , 'no' add unique field validation
//           this.uniqueValidation(
//             fieldLetter,
//             x.isRequired,
//             displayingSheet,
//             x.propertyDisplayText
//           );
//           break;
//         case 'MULTILINETEXT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'NUMERIC':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           this.integerValidation(
//             fieldLetter,
//             100,
//             1000,
//             x.isRequired,
//             displayingSheet
//           );
//           break;
//         case 'BIT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           this.bitValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;
//         case 'STAFF':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'STAFF_MULTISELECT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'BUSINESSUNIT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'BUSINESSUNIT_MULTISELECT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'MULTISELECT':
//           console.log('multiselect ----------------->');
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           dropDownReferenceList =
//             await this.dropDownListHandling.selectDropDown(
//               x.fieldName,
//               x.dataTypeName,
//               listSheet
//             );
//           console.log('dropDownReferenceList---**>', dropDownReferenceList);
//           dropDownReferenceList.refLetter != ''
//             ? this.singleSelectDropDown(
//                 fieldLetter,
//                 dropDownReferenceList.listLen,
//                 x.isRequired,
//                 displayingSheet,
//                 'TempData',
//                 dropDownReferenceList.refLetter,
//                 dropDownReferenceList.refNum
//               )
//             : console.log(
//                 `dropdown refField not Found for ${x.fieldName} - SINGLESELECT`
//               );
//           break;
//         case 'SINGLESELECT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'INCIDENTCODEANDTITLE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'RADIOBUTTON':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //(temp for this filed) check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'RISKRATINGTYPE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'INCIDENTLIKELIHOODTYPE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'INCIDENTPRIORITYTYPE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'INCIDENTSEVERITYTYPE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'INVESTIGATIONSTATUS':
//           //field recognition
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'LASTREVIEWEDBY':
//           //field recognition
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'LASTEREVIEWEDDATE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //date validation
//           this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;
//         case 'NEXTREVIEWDATE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //date validation
//           this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;
//         case 'REVIEWCOMMENT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'INCIDENTCATEGORY':
//           //field recognition
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           break;
//         case 'RICHTEXT':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'ORGANISATION_HIERARCHY_LINK':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //check require (this valitation is only use if another validations are not in this type)
//           if (x.isRequired) {
//             this.requireValidation(
//               fieldLetter,
//               displayingSheet,
//               x.propertyDisplayText
//             );
//           }
//           break;
//         case 'INCIDENTSUBMITTEDDATE':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //date validation
//           this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;
//         case 'DATEPICKER':
//           fieldLetter = returnExcelCoulmnForNumericValue(fieldNum);
//           fieldNum++;
//           //date validation
//           this.dateValidation(fieldLetter, x.isRequired, displayingSheet);
//           break;

//         default:
//           console.log(
//             'ignore - ',
//             x.propertyDisplayText,
//             ',type - ',
//             x.dataTypeName,
//             ',require - ',
//             x.isRequired
//           );
//           break;
//       }
//     });
//     resolve(displayingSheet);
//   });
// }
// private singleSelectDropDown2(
//   fieldLetter: string,
//   length: number,
//   require: boolean,
//   displayingSheet: Worksheet,
//   dataTableName: string,
//   dataTableCellLetter: string,
//   dataTableCellNumber: number
// ) {
//   console.log('single DropDowns ->', fieldLetter);
//   for (let i = 2; i < 5000; i++) {
//     displayingSheet.getCell(fieldLetter + i).dataValidation = {
//       type: 'list',
//       allowBlank: !require,
//       showErrorMessage: true,

//       formulae: [
//         `=${dataTableName}!$${dataTableCellLetter}$${
//           dataTableCellNumber + 1
//         }:$${dataTableCellLetter}${length + 1}`,
//       ],
//     };
//   }
// }
