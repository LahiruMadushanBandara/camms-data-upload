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
      default:
        dropDownReferenceList = this.DefaultList(sheet);
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
