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
    this.keyValuesToRq = this.incidentData.getKeyValues();

    this.authToken = this.keyValuesToRq.authToken;
    this.incidentSubscriptionKey = this.keyValuesToRq.incidentKey;

    // this.listMappingSubscription =
    //   this.incidentData.currentlistMapping.subscribe(
    //     (d) => (this.listMapping = d)
    //   );
    // console.log('dropDown validation this.listMapping ->', this.listMapping);
    this.selectedObject = this.incidentData.getSelectedObject();
    this.GetListMappingBelongsToSelectedObject(this.selectedObject);
    this.allListItems = [];
  }

  public selectDropDown(
    fieldName: String,
    dataType: string,
    listSheet: Worksheet
  ): dropDownReference {
    //just initializing

    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };
    if (dataType == 'SINGLESELECT' || dataType == 'MULTISELECT') {
      console.log(this.listMapping);
      this.listMapping.forEach((x) => {
        if (x.fieldName == fieldName) {
          this.listType = x.listType;
          console.log('this.listType->', this.listType);
          this.GetListItemsForListType(this.listType);
          console.log('this.listItemSelectDropDown->', this.listItem);
          // console.log(
          //   'this.GetListItemsForListType(this.listType)->',
          //   this.GetListItemsForListType(this.listType)
          // );
        }
      });
    } else {
      dropDownReferenceList = this.DefaultList(listSheet);
    }
    return dropDownReferenceList;
  }

  //get List Items according to list type
  async GetListItemsForListType(listType: string) {
    this.incidentService
      .getListItemsAccordingToListType(
        this.incidentSubscriptionKey,
        this.authToken,
        listType
      )
      .subscribe({
        next: (res: any) => {
          this.listItem = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('listItemsComplete->', this.listItem);
          return this.listItem;
        },
      });
  }

  // getListMapping
  GetListMappingBelongsToSelectedObject(selectedObjectName: string) {
    this.incidentService
      .getListMappingBelongsToSelectedObject(
        this.incidentSubscriptionKey,
        this.authToken,
        selectedObjectName
      )
      .subscribe({
        next: (res: any) => {
          console.log('listMappingInDropDownClass->', res.data);
          this.listMapping = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('listMappingComplete');
        },
      });
  }
  // // getListMapping
  // async GetListMappingBelongsToSelectedObject(selectedObjectName: string) {
  //   this.incidentService
  //     .getListMappingBelongsToSelectedObject(
  //       this.incidentSubscriptionKey,
  //       this.authToken,
  //       selectedObjectName
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         console.log('listMappingInDropDownClass->', res.data);
  //         this.listMapping = res.data;
  //       },
  //       error: (err: any) => {
  //         console.log(err);
  //       },
  //       complete: () => {
  //         console.log('listMappingComplete');
  //       },
  //     });
  // }
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
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: fieldName, filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = 'A';
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    return dropDownReferenceList;
  }

  private IncidentTypeNameList(sheet: Worksheet): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };
    var list: any[] = [
      ['Type 1'],
      ['Type 2'],
      ['Type 3'],
      ['Type 4'],
      ['Type 5'],
    ];
    sheet.addTable({
      name: 'BUnits',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: 'IncidentTypeName', filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = 'A';
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    return dropDownReferenceList;
  }
  private IncidentLocationList(sheet: Worksheet): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };
    var list: any[] = [
      ['Location 1'],
      ['Location 2'],
      ['Location 3'],
      ['Location 4'],
      ['Location 5'],
    ];
    sheet.addTable({
      name: 'CUnits',
      ref: 'B1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: 'IncidentLocation', filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = 'B';
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    return dropDownReferenceList;
  }
  private DefaultList(sheet: Worksheet): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
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
      ref: 'C1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: 'Default', filterButton: false }],
      rows: list,
    });
    dropDownReferenceList.refLetter = 'C';
    dropDownReferenceList.refNum = 1;
    dropDownReferenceList.listLen = list.length;
    return dropDownReferenceList;
  }
}
