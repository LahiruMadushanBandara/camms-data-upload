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
      refLetter: 'Z',
      refNum: 0,
      listLen: 0,
    };
    switch (fieldName) {
      case 'IncidentTypeName':
        dropDownReferenceList = this.IncidentTypeNameList(sheet);
        break;
    }
    return dropDownReferenceList;
  }

  private IncidentTypeNameList(sheet: Worksheet): dropDownReference {
    //just initializing
    var dropDownReferenceList: dropDownReference = {
      refLetter: 'Z',
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
}
