import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FileRestrictions,
  FileState,
  SelectEvent,
  UploadComponent,
} from '@progress/kendo-angular-upload';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Subscription } from 'rxjs';
import { ExcelService } from '../../../services/excel.service';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { StaffService } from 'src/app/services/staff.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { environment } from 'src/environments/environment';
import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-hierarchy-select-file',
  templateUrl: './hierarchy-select-file.html',
  styleUrls: ['./hierarchy-select-file.css'],
})
export class hierarchySelectFileComponent implements OnInit {
  public loaderVisible = false;
  public showErrorCard = false;
  public isIconShow = false;
  public showClearButton = false;
  public disabledUploadBtn = true;
  public showSelectBtn = true;
  public showFileSuccessMessage = false;
  changefileSelectBackground = false;

  public topNode = '';
  hierarchySubscriptionKey = '';
  staffSubscriptionKey = '';
  authToken = '';
  IsFileHasValidData = false;
  @Input() orgHierarchyId: string = '';

  @Input() public hierarchyNodeData!: FormGroup;
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @ViewChild('fselect') fselectEl!: ElementRef;

  @ViewChild('labelImport') labelImport!: ElementRef;

  @Output() newItemEvent = new EventEmitter<Boolean>();
  @Output() step1DisableEvent = new EventEmitter<boolean>();
  NextButtonDisabled!: Boolean;

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  showDoubleExtentionErrorCard = false;
  showFileIcon = false;
  showFileInputCloseBtn = false;
  showCreateTopNode = true;
  fileToUpload: File | null = null;
  showApiDetailsError: boolean = false;
  apiErrorMsg: string = '';

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  clearSelectedFile() {
    this.showFileInputCloseBtn = false;
    this.showDoubleExtentionErrorCard = false;
    this.fileInputSelect.nativeElement.value = 'Drop a file here to upload';
    this.showFileIcon = false;
    this.showErrorCard = false;
    this.isIconShow = false;
    this.disabledUploadBtn = true;
    this.IsFileHasValidData = false;
    this.showSelectBtn = true;
    this.showFileSuccessMessage = false;
    this.changefileSelectBackground = false;
    this.fileToUpload = null;
    this.changeNextButtonBehavior(true);
  }

  onFileChange(e: any) {
    const workbook = new Workbook();
    this.fileInputSelect.nativeElement.value = e.target.files[0].name;
    this.fileToUpload = e.target.files.item(0);

    this.showFileInputCloseBtn = true;
    this.fileToUpload?.arrayBuffer()?.then((data) => {
      var extention = this.fileToUpload.name.split('.');

      this.auditLogShared.uploadedfilename = this.fileToUpload.name;
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);

        const HeaderRow = worksheet.getRow(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });

        if (
          HeaderRow.getCell(3).value === null ||
          rowCount <= 1 ||
          worksheet.name !== 'Organisation Hierarchy Upload' ||
          HeaderRow.getCell(1).value !== 'Hierarchy Code'
        ) {
          this.IsFileHasValidData = false;
          this.showErrorCard = true;
          this.changefileSelectBackground = false;
        } else {
          if (extention.length > 2) {
            this.IsFileHasValidData = false;
            this.showDoubleExtentionErrorCard = true;
            this.changefileSelectBackground = false;
          } else {
            this.showDoubleExtentionErrorCard = false;
            this.IsFileHasValidData = true;
            this.showErrorCard = false;
            this.showSelectBtn = false;
            this.changefileSelectBackground = true;
          }
        }

        this.showFileIcon = true;

        if (this.IsFileHasValidData) {
          this.disabledUploadBtn = false;
        } else {
          this.disabledUploadBtn = true;
        }
      });
      this.showClearButton = true;
    });
  }

  onClickFileInputButton(): void {
    this.readExcel(this.fileToUpload?.arrayBuffer());
    this.showFileSuccessMessage = true;
  }

  currentFileUpload!: any;

  public remove(upload: UploadComponent, uid: string): void {
    upload.removeFilesByUid(uid);
  }

  public showButton(state: FileState): boolean {
    return state === FileState.Uploaded ? true : false;
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file: any) => {
      if (!file.validationErrors) {
        this.currentFileUpload = file;
      }
    });
  }

  staffDataList!: HierarchyNode[];
  errorDataList!: string[];
  subscription!: Subscription;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.changeNextButtonBehavior(false);
  }

  constructor(
    private excelService: ExcelService,
    private authService: AuthenticationService,
    private auditLogShared: AuditLogSharedService,
    private hierarchyService: HierarchyService,
    private hierarchySharedService: HierarchySharedService,
    private staffService: StaffService
  ) {}
  ngOnInit(): void {
    this.subscription =
      this.hierarchySharedService.currentHierarchyList.subscribe(
        (d) => (this.staffDataList = d)
      );
    this.subscription =
      this.hierarchySharedService.currentHierarchyErrorList.subscribe(
        (d) => (this.errorDataList = d)
      );
    this.changeNextButtonBehavior(true);
    this.step1DisableEvent.emit(false);
    this.fileInputSelect.nativeElement.value = 'Drop a file here to upload';

    this.authToken = localStorage.getItem('auth-token')!;
    this.staffSubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;
    this.hierarchySubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;
  }

  BusniessUnits: any;
  Directories: any;

  exportExcel(
    excelData: any,
    hierarchies: [],
    staffList: [],
    existingRecords: []
  ) {
    //Title, Header & Data
    const header = excelData.headers;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Organisation Hierarchy Upload');
    let dataTablesSheet = workbook.addWorksheet('DataTables', {
      state: 'hidden',
    });
    let ExistingDataSheet = workbook.addWorksheet('ExistingRecords');
    let InstructionSheet = workbook.addWorksheet('Instructions', {
      views: [{ showGridLines: false }],
    });
    //////////////////////////////////////////
    InstructionSheet.addTable({
      name: 'MyTable',
      ref: 'A3',
      headerRow: true,
      style: {
        theme: 'TableStyleLight1',
        showRowStripes: true,
      },
      columns: [
        {
          name: 'Index',
          filterButton: false,
        },
        { name: 'Description', filterButton: false },
      ],
      rows: [
        ['', 'General'],
        ['1', 'Do not add, modify or delete columns in the extract.'],

        ['', ''],
        ['', 'Mandatory fields for upload.'],
        ['2', "The mandatory fields are indicated in 'Red' in the template."],
        ['3', 'Mandatory fileds cannot be left blank.'],
        [
          '4',
          'Fields not highlighted in red are non-mandatory and data can be provided if required.',
        ],
        ['5', 'Do not add, modify or delete columns in the extract'],
        ['', ''],
        ['', 'Hierarchy Code'],
        [
          '6',
          'This is the unique identifier for each hierarchy node and can be either numeric or alphanumeric. The Hierarchy Code is a backend reference only and not visible in the application.',
        ],
        ['', ''],
        ['', 'Existing Records Worksheet'],
        [
          '7',
          "This worksheet consists of all existing Hierarchy nodes in Camms at the time of template generation. The worksheet provides the primary source of data to populate the Parent Node and Responsible Officer dropdowns in the 'Hierarchy Node Data' Worksheet, and can be utilised to avoid duplicate Hierarchy Codes and Records when creating new records.",
        ],
      ],
    });

    let bold = ['A5', 'A8', 'A9', 'A10', 'A11', 'A14', 'A17'];
    let boldAndUnderLine = ['B4', 'B7', 'B13', 'B16'];
    boldAndUnderLine.forEach((x) => {
      InstructionSheet.getCell(`${x}`).font = {
        size: 12,
        underline: true,
        bold: true,
      };
    });
    bold.forEach((x) => {
      InstructionSheet.getCell(`${x}`).font = {
        size: 12,
        bold: true,
      };
    });

    InstructionSheet.getColumn('A').eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    InstructionSheet.columns[0].width = 10;
    InstructionSheet.columns[1].width = 100;

    for (let i = 1; i < 18; i++) {
      InstructionSheet.getCell(`B${i}`).alignment = {
        wrapText: true,
      };
    }

    /////////////////////////////////////////////

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C0C0C0' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: '#000000' },
        size: 11,
      };
    });

    dataTablesSheet.addTable({
      name: 'BUnits',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: 'HierarchyCode', filterButton: false }],
      rows: hierarchies,
    });
    dataTablesSheet.addTable({
      name: 'BUnits',
      ref: 'D1',
      headerRow: true,
      totalsRow: false,

      columns: [{ name: 'ResponsibleOfficerCode', filterButton: false }],
      rows: staffList,
    });
    this.excelService.FormatSheet(dataTablesSheet);
    for (let i = hierarchies.length + 2; i < hierarchies.length + 5000; i++) {
      dataTablesSheet.getCell('A' + i).value = {
        formula: `=IF('Organisation Hierarchy Upload'!A${
          i - hierarchies.length
        }=0,"",CONCATENATE('Organisation Hierarchy Upload'!B${
          i - hierarchies.length
        }," (",'Organisation Hierarchy Upload'!A${
          i - hierarchies.length
        },")"))`,
        date1904: false,
      };
    }
    //create existig record sheet
    //upper case first letter in headers of existing rec
    const upperCase = (str: any) => str[0].toUpperCase() + str.slice(1);
    const res = existingRecords.map((obj: any) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [upperCase(k), v]))
    );

    //Changing order of existing records
    var orderedExistingRec: any[] = [];

    res.forEach((i) => {
      let ResponsiblePerson = '';
      for (let j = 0; j < i['Fields'].length; j++) {
        if (i['Fields'][j].label == 'Responsible Person') {
          ResponsiblePerson = i['Fields'][j].values[0].value;
        }
      }
      let model = {
        HierarchyCode: i['ImportKey'],
        Description: i['Description'],
        ParentNode: i['ParentNodeName'],
        ResponsiblePerson: ResponsiblePerson,
      };
      orderedExistingRec.push(model);
    });
    this.excelService.CreateHeadersAndRows(
      orderedExistingRec,
      ExistingDataSheet
    );
    this.excelService.FormatSheet(ExistingDataSheet);

    /////////////////////////////////////
    var columns = ['A', 'B', 'C', 'D'];
    var mandatoryColumns = ['A', 'B', 'C'];

    columns.forEach((col) => {
      let cell = worksheet.getCell(col + '1');
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffc7ce' },
      };
      cell.font = { bold: true, color: { argb: '9c0006' } };
    });

    for (let i = 2; i < 5000; i++) {
      mandatoryColumns.forEach((col) => {
        worksheet.getCell(col + i).dataValidation = {
          type: 'custom',
          allowBlank: false,
          showErrorMessage: true,
          formulae: [`=NOT(ISBLANK(${col + i}))`],
        };
      });
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$A$2:$A${hierarchies.length + (i - 1)}`], //'"One,Two,Three,Four"'
      };

      worksheet.getCell('D' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$D$2:$D${staffList.length + (i - 1)}`], //'"One,Two,Three,Four"'
      };

      worksheet.getCell('B' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: 'Please enter alphanumeric data',
        errorTitle: 'Invalid Description',
        formulae: [
          `=ISNUMBER(SUMPRODUCT(SEARCH(MID(B${i},ROW(INDIRECT("1:"&LEN(B${i}))),1)," _-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")))`,
        ],
      };

      worksheet.getCell('A' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: 'Please enter unique code',
        errorTitle: 'Duplicate Code',
        formulae: [`=COUNTIF($A$2:$A${i}, $A${i})=1`],
      };
      //worksheet.getCell('A' + i).numFmt = '@';
    }
    worksheet.columns.forEach((column) => {
      column.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      column.width = 20;
    });

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Organisation_Hierarchy_Upload' + '.xlsx');
    });
  }

  GetHierarchyDetails() {
    this.loaderVisible = true;
    let HierarchyCodes: any = [];
    0;

    let headerList = [
      'Hierarchy Code',
      'Description',
      'Parent Node',
      'Responsible Person',
    ];

    this.hierarchyService
      .GetHierarchyNodes(
        this.hierarchySubscriptionKey,
        this.authToken,
        this.orgHierarchyId
      )
      .subscribe({
        next: (d: any) => {
          let existingRecords = d.data;
          let data = d.data.sort((a: any, b: any) =>
            a.importKey < b.importKey ? -1 : 1
          );
          for (let i = 0; i < data.length; i++) {
            if (
              data[i].importKey != null &&
              (data[i].parentCode != null || data[i].level === 1)
            ) {
              let a = {
                name: data[i].name + ' (' + data[i].importKey + ')',
              };
              HierarchyCodes.push(Object.values(a));
            }
          }
          let reportData = {
            data: HierarchyCodes,
            headers: headerList,
          };

          let staffDetails: any = [];
          this.staffService
            .GetStaffDetails(this.authToken, this.staffSubscriptionKey)
            .subscribe((d: any) => {
              for (let i = 0; i < d.data.length; i++) {
                if (
                  d.data[i].staffCode !== null &&
                  d.data[i].activeStatus === 'Active'
                ) {
                  let a = {
                    Code:
                      d.data[i].staffName! + ' (' + d.data[i].staffCode + ')',
                  };
                  staffDetails.push(Object.values(a));
                }
              }
              this.exportExcel(
                reportData,
                reportData.data,
                staffDetails,
                existingRecords
              );
              this.loaderVisible = false;
            });
        },
        error: (error: HttpErrorResponse) => {
          this.apiErrorMsg = error.message;
          this.showApiDetailsError = true;
          this.modalMessage.open();
        },
      });
  }

  staffUploadFileRestrictions: FileRestrictions = {
    allowedExtensions: ['.xlsx', '.xls'],
  };

  readExcel(arryBuffer?: Promise<ArrayBuffer>) {
    const workbook = new Workbook();
    arryBuffer?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });

        let rangeCell = `A2:D${rowCount}`;
        const [startCell, endCell] = rangeCell.split(':');

        const [endCellColumn, endRow] = endCell.match(
          /[a-z]+|[^a-z]+/gi
        ) as string[];
        const [startCellColumn, startRow] = startCell.match(
          /[a-z]+|[^a-z]+/gi
        ) as string[];

        let endColumn = worksheet.getColumn(endCellColumn);
        let startColumn = worksheet.getColumn(startCellColumn);

        if (!endColumn) throw new Error('End column not found');
        if (!startColumn) throw new Error('Start column not found');

        const endColumnNumber = endColumn.number;
        const startColumnNumber = startColumn.number;

        let hierarchyList = [];
        let errorList = [];

        var regExAlphanumericNoSpaces = /^[A-Za-z0-9]*$/;
        var regExp = /\(([^)]+)\)/;
        var regExAlpanumericNoSpaces = /^[A-Za-z0-9]*$/;
        var regexAllowCharactersNoSpaces = /^[a-zA-Z0-9-.@_]*$/;
        var regexAllowCharacters = /^[a-zA-Z0-9-.@_ ]*$/;

        var regExAlpanumeric = /^[a-zA-Z0-9-.-_ ]*$/;

        if (rowCount > 5001) {
          let data = {
            RowNo: '',
            Column: '',
            ValueEntered: '',
            ErrorMessage: 'Maximum Record Limit Exceeded',
            ExpectedType: 'Less than 5000 records',
          };
          errorList.push(data);
        }

        for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
          let model = new HierarchyNode();         
          const row = worksheet.getRow(y);
          for (let x = startColumnNumber; x <= endColumnNumber; x++) {
            let cell = row.getCell(x);
            let cellVal = cell.value ? cell.value.toString() : '';

            if (cell.address.includes('A')) {
              if (cell.value != null) {
                if (
                  typeof cell.value === 'object' &&
                  JSON.parse(JSON.stringify(cell.value)).text != undefined
                ) {
                  cellVal = JSON.parse(JSON.stringify(cell.value)).text;
                }
                model.importKey = cellVal;
                if (!regExAlphanumericNoSpaces.test(model.importKey)) {
                  let data = {
                    RowNo: row.number.toString(),
                    Column: 'Code',
                    ValueEntered: model.importKey,
                    ErrorMessage: 'Invalid Cell Data',
                    ExpectedType: 'Alphanumerics',
                  };
                  errorList.push(data);
                }
              } else {
                let data = {
                  RowNo: row.number.toString(),
                  Column: 'Code',
                  ValueEntered: model.importKey,
                  ErrorMessage: 'Cell is empty',
                  ExpectedType: 'Alphanumerics',
                };
                errorList.push(data);
              }
            }
            if (cell.address.includes('B')) {
              if (cell.value != null) {
                model.description = cellVal;
                if (!regExAlpanumeric.test(model.description)) {
                  let data = {
                    RowNo: row.number.toString(),
                    Column: 'Description',
                    ValueEntered: cell.value.toString(),
                    ErrorMessage: 'Invalid Cell Data',
                    ExpectedType: 'Alphanumerics',
                  };
                  errorList.push(data);
                }
              } else {
                let data = {
                  RowNo: row.number.toString(),
                  Column: 'Description',
                  ValueEntered: cell.value,
                  ErrorMessage: 'Cell is empty',
                  ExpectedType: 'Alphanumerics',
                };
                errorList.push(data);
              }
            }
            if (cell.address.includes('C')) {
              if (cell.value != null) {
                model.parentImportKey = regExp.exec(cellVal)![1]?.toString();
                model.ParentNodeName = cellVal.substring(
                  0,
                  cellVal.indexOf(' (')
                );
                if (model.ParentNodeName == '') {
                  model.ParentNodeName = cellVal.substring(
                    0,
                    cellVal.indexOf('-(')
                  );
                  if (model.ParentNodeName == '') {
                    model.ParentNodeName = cellVal.substring(
                      0,
                      cellVal.indexOf('(')
                    );
                  }
                }
                if (!regExAlpanumeric.test(model.parentImportKey)) {
                  let data = {
                    RowNo: row.number.toString(),
                    Column: 'Parent Node',
                    ValueEntered: cell.value.toString(),
                    ErrorMessage: 'Invalid Cell Data',
                    ExpectedType: 'Alphanumerics',
                  };
                  errorList.push(data);
                }
              } else {
                let data = {
                  RowNo: row.number.toString(),
                  Column: 'Parent Node',
                  ValueEntered: cell.value,
                  ErrorMessage: 'Cell is empty',
                  ExpectedType: 'Alphanumerics',
                };
                errorList.push(data);
              }
            }
            if (cell.address.includes('D')) {
              if (cell.value != null) {
                if (
                  typeof cell.value === 'object' &&
                  JSON.parse(JSON.stringify(cell.value)).text != undefined
                ) {
                  cellVal = JSON.parse(JSON.stringify(cell.value)).text;
                }
                model.responsibleOfficerImportKey = regExp
                  .exec(cellVal)![1]
                  ?.toString();
                model.responsibleOfficerName = cellVal.substring(
                  0,
                  cellVal.indexOf(' (')
                );
                if (model.responsibleOfficerName == '') {
                  model.responsibleOfficerName = cellVal.substring(
                    0,
                    cellVal.indexOf('-(')
                  );
                }
              } else {
                let data = {
                  RowNo: row.number.toString(),
                  Column: 'Responsible Person',
                  ValueEntered: cell.value,
                  ErrorMessage: 'Cell is empty',
                  ExpectedType: 'Alphanumerics',
                };
                errorList.push(data);
              }
            }
          }
          model.active = true;
          hierarchyList.push(model);
        }

        const duplicateIds = hierarchyList
          .map((v) => v.importKey)
          .filter((v, i, vIds) => vIds.indexOf(v) !== i);

        const duplicates = hierarchyList.filter((obj) =>
          duplicateIds.includes(obj.importKey)
        );

        duplicates.forEach((element) => {
          if (element.importKey !== '') {
            let data = {
              RowNo: '',
              Column: 'Code',
              ValueEntered: element.importKey,
              ErrorMessage: 'Duplicate Cell Data',
              ExpectedType: 'Code Cannot be Duplicated',
            };
            errorList.push(data);
          }
        });

        this.hierarchySharedService.changeDataList(hierarchyList, errorList);

        this.changeNextButtonBehavior(false);
      });
    });
  }
}
