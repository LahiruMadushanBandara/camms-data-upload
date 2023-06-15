/************if we find field with dropDown we*****************
 ************can create private function for that field********
 ************and add list of data belongs to that field ***/
//used A1, B1 ,
import { Worksheet } from 'exceljs';
import { dropDownReference } from './models/dropDownReference.model';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { Component, OnDestroy } from '@angular/core';
import { listMapping } from 'src/app/models/listMapping.model';
import { Subscription } from 'rxjs';
import { IncidentService } from 'src/app/services/incident.service';
import { listItems } from 'src/app/models/listItems.model';
import { keyValues } from 'src/app/models/keyValues.model copy';

export class dropDownListHandlingClass {
  private coloumnLetterIndex: number = 1;
  private authToken!: string;
  private keyValuesToRq!: keyValues;
  private incidentSubscriptionKey!: string;
  private selectedObject: string = '';
  private listType: string = '';
  private listItem!: listItems;
  private allListItems: listItems[] = [];
  private listMapping: listMapping[] = [];
  private listMappingSubscription!: Subscription;

  constructor(
    private incidentData: IncidentUploadSharedService,
    private incidentService: IncidentService
  ) {
    this.coloumnLetterIndex = 1;

    this.keyValuesToRq = this.incidentData.getKeyValues();

    this.authToken = this.keyValuesToRq.authToken;
    this.incidentSubscriptionKey = this.keyValuesToRq.incidentKey;
    this.selectedObject = this.incidentData.getSelectedObject();

    this.allListItems = [];
  }

  public async selectDropDown(
    fieldName: string,
    dataType: string,
    listSheet: Worksheet
  ) {
    this.listMapping = await this.GetListMappingBelongsToSelectedObject(
      this.selectedObject
    );

    return new Promise((resolve, reject) => {
      let dropDownReferenceList: dropDownReference = {
        refLetter: '',
        refNum: 0,
        listLen: 0,
      };

      let listItemValues: any[] = [];
      if (dataType == 'SINGLESELECT' || dataType == 'MULTISELECT') {
        const fieldnameAvailabilityDetails =
          this.checkFieldNameAvailableOnListMapping(
            this.listMapping,
            fieldName
          );

        if (fieldnameAvailabilityDetails != '') {
          this.GetListItemsForListType(
            fieldnameAvailabilityDetails.listType
          ).then((res) => {
            for (let i = 0; i < res.length; i++) {
              listItemValues.push([res[i].listValue]);
            }
            dropDownReferenceList = this.createListOnDataSheet(
              listSheet,
              listItemValues,
              fieldName
            );
            console.log(
              'dropDownReferenceList in SD dLH->',
              dropDownReferenceList
            );
            resolve(dropDownReferenceList);
          });
        } else {
          dropDownReferenceList = this.DefaultList(listSheet, fieldName);
          resolve(dropDownReferenceList);
        }
      }
    });
  }

  private checkFieldNameAvailableOnListMapping(
    listmap: listMapping[],
    fieldName: string
  ) {
    for (let i = 0; i < listmap.length; i++) {
      if (listmap[i].fieldName === fieldName) {
        return {
          fieldName: listmap[i].fieldName,
          listType: listmap[i].listType,
        };
      }
    }
    return ''; // Return null if no match is found
  }

  private createListOnDataSheet(
    sheet: Worksheet,
    list: any[],
    fieldName: string
  ): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };

    sheet.addTable({
      name: 'BUnits',
      ref: `${this.getExcelColumnName(this.coloumnLetterIndex)}1`,
      headerRow: true,
      totalsRow: false,

      columns: [{ name: fieldName, filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = this.getExcelColumnName(
      this.coloumnLetterIndex
    );
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    this.coloumnLetterIndex++;
    return dropDownReferenceList;
  }

  private DefaultList(sheet: Worksheet, fieldName: string): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: ``,
      refNum: 0,
      listLen: 0,
    };
    var list: any[] = [
      ['Default 1'],
      ['Default 2'],
      ['Default 3'],
      ['Default 4'],
      ['Default 5'],
    ];
    sheet.addTable({
      name: 'CUnits',
      ref: `${this.getExcelColumnName(this.coloumnLetterIndex)}1`,
      headerRow: true,
      totalsRow: false,

      columns: [{ name: fieldName, filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = this.getExcelColumnName(
      this.coloumnLetterIndex
    );
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    this.coloumnLetterIndex++;
    return dropDownReferenceList;
  }
  private getExcelColumnName(columnNumber: number): string {
    let columnName = '';
    let dividend = columnNumber;

    while (dividend > 0) {
      const modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  }
  //get List Items according to list type
  async GetListItemsForListType(listType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.incidentService
        .getListItemsAccordingToListType(
          this.incidentSubscriptionKey,
          this.authToken,
          listType
        )
        .subscribe({
          next: (res: any) => {
            resolve(res.data);
          },
          error: (err: any) => {
            reject(err);
          },
        });
    });
  }

  // getListMapping
  public async GetListMappingBelongsToSelectedObject(
    selectedObjectName: string
  ): Promise<listMapping[]> {
    return new Promise((resolve, reject) => {
      this.incidentService
        .getListMappingBelongsToSelectedObject(
          this.incidentSubscriptionKey,
          this.authToken,
          selectedObjectName
        )
        .subscribe({
          next: (res: any) => {
            resolve(res.data);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            console.log('listMappingComplete');
          },
        });
    });
  }
}

// // getListMapping
// GetListMappingBelongsToSelectedObject(selectedObjectName: string) {
//   this.incidentService
//     .getListMappingBelongsToSelectedObject(
//       this.incidentSubscriptionKey,
//       this.authToken,
//       selectedObjectName
//     )
//     .subscribe({
//       next: (res: any) => {
//         this.listMapping = res.data;
//         console.log('listMappingInDropDownClass->', this.listMapping);
//       },
//       error: (err: any) => {
//         console.log(err);
//       },
//       complete: () => {
//         console.log('listMappingComplete');
//       },
//     });
// }
// // getListMapping

// public  selectDropDown(
//   fieldName: String,
//   dataType: string,
//   listSheet: Worksheet
// ) {
//   //just initializing

//   var dropDownReferenceList: dropDownReference = {
//     refLetter: '',
//     refNum: 0,
//     listLen: 0,
//   };
//   if (dataType == 'SINGLESELECT' || dataType == 'MULTISELECT') {
//     this.listMapping.forEach((x) => {
//
//         this.listType = x.listType;
//         this.GetListItemsForListType(this.listType);
//         console.log('this.listItemSelectDropDown->', this.listItem);
//         // console.log(
//         //   'this.GetListItemsForListType(this.listType)->',
//         //   this.GetListItemsForListType(this.listType)
//         // );
//       }
//     });
//   } else {
//     dropDownReferenceList = this.DefaultList(listSheet);
//   }
//   return dropDownReferenceList;
// }
