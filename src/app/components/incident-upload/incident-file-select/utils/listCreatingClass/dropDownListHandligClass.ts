/************if we find field with dropDown we*****************
 ************can create private function for that field********
 ************and add list of data belongs to that field ***/
//used A1, B1 ,
import { Worksheet } from 'exceljs';
import { dropDownReference } from './models/dropDownReference.model';
export class dropDownListHandlingClass {
  constructor() {}
  public selectDropDown(
    fieldName: String,
    sheet: Worksheet
  ): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: '',
      refNum: 0,
      listLen: 0,
    };
    switch (fieldName) {
      case 'IncidentTypeName':
        dropDownReferenceList = this.IncidentTypeNameList(sheet);
        break;
      case 'IncidentLocation':
        dropDownReferenceList = this.IncidentLocationList(sheet);
        break;
    }
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
      ['pasindu'],
      ['kavindu'],
      ['saman'],
      ['supun'],
      ['gayan'],
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
      ['galle'],
      ['matara'],
      ['colombo'],
      ['gampaha'],
      ['udugama'],
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
}
