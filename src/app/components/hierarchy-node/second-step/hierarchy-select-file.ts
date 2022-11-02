import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileRestrictions, FileState, SelectEvent, UploadComponent } from '@progress/kendo-angular-upload';
import { Workbook } from 'exceljs';
import { Subscription } from 'rxjs';
import * as fs from 'file-saver';
import { ExcelService } from 'src/app/services/excel.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';

@Component({
  selector: 'app-hierarchy-select-file',
  templateUrl: './hierarchy-select-file.html',
  styleUrls: ['./hierarchy-select-file.css']
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
  public topNode = "";
  subsKey = '';
  authToken = '';
  IsFileHasValidData = false

  @Input() public hierarchyNodeData!: FormGroup;
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @ViewChild('fselect') fselectEl!: ElementRef;

  @ViewChild('labelImport') labelImport!: ElementRef;

  @Output() newItemEvent = new EventEmitter<Boolean>();
  @Output() step1DisableEvent = new EventEmitter<boolean>();
  NextButtonDisabled!: Boolean;

  showFileIcon = false;
  showFileInputCloseBtn = false;
  showCreateTopNode = true;
  fileToUpload: File | null = null;

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  clearSelectedFile() {
    this.fileInputSelect.nativeElement.value = "Please Select";
    this.showFileIcon = false;
    this.showErrorCard = false;
    this.isIconShow = false;
    this.disabledUploadBtn = true;
    this.IsFileHasValidData = false
    this.showSelectBtn = true;
    this.showFileSuccessMessage = false;
    this.changefileSelectBackground = false;
    this.fileToUpload = null;
    this.changeNextButtonBehavior(true)
  }

  
  onFileChange(e: any) {
    const workbook = new Workbook();
    this.fileInputSelect.nativeElement.value = e.target.files[0].name
    this.fileToUpload = e.target.files.item(0);

    this.showFileInputCloseBtn = true;
    this.fileToUpload?.arrayBuffer()?.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);

          const HeaderRow = worksheet.getRow(1)
          let rowCount = 0;
          worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            rowCount = rowNumber
          });

          if (HeaderRow.getCell(3).value === null || rowCount <= 1 || worksheet.name !== "Hierarchy Node Data" || HeaderRow.getCell(1).value !== "Code") {
            this.IsFileHasValidData = false;
            this.showErrorCard = true;
            console.log(this.showErrorCard)
            this.changefileSelectBackground = false;
          }
          else {
            this.IsFileHasValidData = true;
            this.showErrorCard = false;
            this.showSelectBtn = false;
            this.changefileSelectBackground = true;
          }

          this.showFileIcon = true;

          if (this.IsFileHasValidData) {

            this.disabledUploadBtn = false
          }
          else {
            this.disabledUploadBtn = true
          }
        });
      this.showClearButton = true
    });
  }

  onClickFileInputButton(): void {
    this.readExcel(this.fileToUpload?.arrayBuffer())
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
    this.changeNextButtonBehavior(false)
  }

  ngOnInit(): void {
    this.subscription = this.hierarchySharedService.currentHierarchyList.subscribe(d => this.staffDataList = d)
    this.subscription = this.hierarchySharedService.currentHierarchyErrorList.subscribe(d => this.errorDataList = d)
    this.changeNextButtonBehavior(true)
    this.step1DisableEvent.emit(false);
    this.fileInputSelect.nativeElement.value = "Please Select"

    this.subsKey = JSON.parse(localStorage.getItem('HierarchySubscriptionKey')!)
    this.authToken = JSON.parse(localStorage.getItem('auth-token')!)

  }

  constructor(private excelService: ExcelService, private hierarchyService: HierarchyService, private hierarchySharedService: HierarchySharedService) { }

  BusniessUnits: any;
  Directories: any;

  exportExcel(excelData: any, hierarchies: []) {

    //Title, Header & Data
    const header = excelData.headers;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Hierarchy Node Data');
    let dataTablesSheet = workbook.addWorksheet('DataTables', { state: 'hidden' });

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {


      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C0C0C0' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: '#000000' },
        size: 11
      }
    })

    dataTablesSheet.addTable({
      name: 'BUnits',
      ref: 'F1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'HierarchyCode', filterButton: false },
      ],
      rows: hierarchies,
    });

    var mandatoryColumns = ['A', 'B', 'C', 'D'];
    mandatoryColumns.forEach(col => {
      let cell = worksheet.getCell(col + '1');
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffc7ce' }
      }
      cell.font = {
        bold: true,
        color: { argb: '9c0006' }
      }
    })

    for (let i = 2; i < 5000; i++) {
      mandatoryColumns.forEach(col => {
        worksheet.getCell(col + i).dataValidation = {
          type: 'custom',
          allowBlank: false,
          showErrorMessage: true,
          formulae: [`=NOT(ISBLANK(${col + i}))`]
        };
      });
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$F$2:$F${hierarchies.length + 1}`]//'"One,Two,Three,Four"'
      };

      worksheet.getCell('A' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Please enter unique code",
	      errorTitle: "Duplicate Code",
        formulae: [`=COUNTIF($A$2:$A$16, $A${i})=1`]
      };
    }
    worksheet.columns.forEach(column => {
      column.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      column.width = 20
    });
    
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Hierarchy_Node_Upload' + '.xlsx');
    })
  }


  GetHierarchyDetails() {
    this.loaderVisible = true
    let HierarchyCodes: any = []; 0

    let headerList = ["Code", "Description", "Parent Node"]

    this.hierarchyService.GetHierarchyNodes(this.subsKey, this.authToken).subscribe((d: any) => {
      let data = d.data.sort((a:any,b:any)=>(a.importKey < b.importKey)? -1 :1);
      for (let i = 0; i < data.length; i++) {
        if (data[i].importKey != null && data[i].parentCode != null) {
          let a = {
            name: data[i].name + ' (' + data[i].importKey + ')'
          }
          HierarchyCodes.push(Object.values(a))
        }
      }
      let reportData = {
        data: HierarchyCodes,
        headers: headerList
      }
      this.exportExcel(reportData, reportData.data);
      this.loaderVisible = false
    });
  }
  staffUploadFileRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx", ".xls"],
  };

  readExcel(arryBuffer?: Promise<ArrayBuffer>) {
    const workbook = new Workbook();
    arryBuffer?.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);
          let rowCount = 0;
          worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            rowCount = rowNumber
          });

          let rangeCell = `A2:D${rowCount}`;
          const [startCell, endCell] = rangeCell.split(":")

          const [endCellColumn, endRow] = endCell.match(/[a-z]+|[^a-z]+/gi) as string[]
          const [startCellColumn, startRow] = startCell.match(/[a-z]+|[^a-z]+/gi) as string[]

          let endColumn = worksheet.getColumn(endCellColumn)
          let startColumn = worksheet.getColumn(startCellColumn)

          if (!endColumn) throw new Error("End column not found")
          if (!startColumn) throw new Error("Start column not found")

          const endColumnNumber = endColumn.number
          const startColumnNumber = startColumn.number

          let hierarchyList = [];
          let errorList = [];

          var regExAlphanumeric = /^[A-Za-z0-9]*$/;
          var regExp = /\(([^)]+)\)/;
          var regExAlpanumericNoSpaces = /^[A-Za-z0-9]*$/;
          var regexAllowCharacters = /^[a-zA-Z0-9-.@_]*$/;

          for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
            let model = new HierarchyNode();

            const row = worksheet.getRow(y)
            for (let x = startColumnNumber; x <= endColumnNumber; x++) {

              let cell = row.getCell(x);
              let cellVal = cell.value ? cell.value.toString() : '';

              if (cell.address.includes("A")) {
                if (cell.value != null) {
                  model.importKey = cellVal
                  if (!(regexAllowCharacters.test(cell.value.toString()))) {
                    let data = {
                      RowNo: row.number.toString(),
                      Column: "Code",
                      ValueEntered: cell.value.toString(),
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                } else {
                  let data = {
                    RowNo: row.number.toString(),
                    Column: "Code",
                    ValueEntered: cell.value,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }
              if (cell.address.includes("B")) {
                if (cell.value != null) {
                  model.description = cellVal
                  if (!(regexAllowCharacters.test(model.description))) {
                    let data = {
                      RowNo: row.number.toString(),
                      Column: "Hierarchy Node Description",
                      ValueEntered: cell.value.toString(),
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                } else {
                  let data = {
                    RowNo: row.number.toString(),
                    Column: "Description",
                    ValueEntered: cell.value,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }
              if (cell.address.includes("C")) {
                
                if (cell.value != null) {
                  model.parentImportKey = regExp.exec(cellVal)![1]?.toString()
                  model.ParentNodeName = cellVal.substring(0, cellVal.indexOf('-'));
                  if (!(regExAlphanumeric.test(model.parentImportKey))) {
                    let data = {
                      RowNo: row.number.toString(),
                      Column: "Parent Node",
                      ValueEntered: cell.value.toString(),
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                  else {
                    let data = {
                      RowNo: row.number.toString(),
                      Column: "Parent Node",
                      ValueEntered: cell.value,
                      ErrorMessage: "Cell is empty",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
              }
            }
            model.active = true;
            hierarchyList.push(model);
          }

          const duplicateIds = hierarchyList
            .map(v => v.importKey)
            .filter((v, i, vIds) => vIds.indexOf(v) !== i)

          const duplicates = hierarchyList
            .filter(obj => duplicateIds.includes(obj.importKey));

          duplicates.forEach(element => {
            if (element.importKey !== '') {
              let data = {
                RowNo: '',
                Column: "Code",
                ValueEntered: element.importKey,
                ErrorMessage: "Duplicate Cell Data",
                ExpectedType: "Code Cannot be Duplicated"
              }
              errorList.push(data)
            }
          });
          console.log(hierarchyList)
          console.log(errorList)

          this.hierarchySharedService.changeDataList(hierarchyList, errorList)
          this.changeNextButtonBehavior(false)

        });
    });
  }

}
