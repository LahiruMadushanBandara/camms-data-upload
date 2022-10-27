import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { StaffService } from "../../../services/staff.service"
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { StaffBulk } from '../../../models/StaffBulk.model';
import { HierarchyPermissionModel } from '../../../models/HerarchyPersmission.model';
import { FormGroup } from '@angular/forms';
import { FileRestrictions, FileState, SelectEvent, UploadComponent } from '@progress/kendo-angular-upload';
import { lastValueFrom, Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { ExcelService } from "../../../services/excel.service";

@Component({
  selector: 'app-staff-data',
  templateUrl: './fileSelectStep.html',
  styleUrls: ['./fileSelectStep.css'],
  encapsulation: ViewEncapsulation.None
})
export class StaffDataComponent implements OnInit, OnDestroy {
  public loaderVisible = false;
  public uploadBtnLoaderVisible = false;
  public showErrorCard = false;
  public isIconShow = false;
  public showClearButton = false;
  public disabledUploadBtn = true;
  public showSelectBtn = true;
  public showFileSuccessMessage = false;
  changefileSelectBackground = false;

  @Input()
  public staffUploadData!: FormGroup;

  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @ViewChild('fselect') fselectEl!: ElementRef;


  @ViewChild('labelImport')
  labelImport!: ElementRef;

  @Output() newItemEvent = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  showFileIcon = false;
  showFileInputCloseBtn = false;

  @Output() step1DisableEvent = new EventEmitter<boolean>();

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

  IsFileHasValidData = false
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
          console.log(worksheet.rowCount)

          if (HeaderRow.getCell(3).value === null || rowCount <= 1 || worksheet.name !== "Staff Data" || HeaderRow.getCell(1).value !== "Staff Code") {
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
    this.GetHierarchyCodesAndStaffCodes()
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

  staffDataList!: StaffBulk[];
  errorDataList!: string[];
  subscription!: Subscription;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.changeNextButtonBehavior(false)
  }

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(d => this.staffDataList = d)
    this.subscription = this.data.currentErrorList.subscribe(d => this.errorDataList = d)
    this.changeNextButtonBehavior(true)
    this.step1DisableEvent.emit(false);
    this.fileInputSelect.nativeElement.value = "Please Select"
  }

  constructor(private excelService: ExcelService, private staffDet: StaffService, private data: SharedService) { }

  BusniessUnits: any;
  Directories: any;

  exportExcel(excelData: any, hierarchies: [], StaffDetails: [], existingRecords: any[]) {

    //Title, Header & Data
    const header = excelData.headers;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Staff Data');
    let dataTablesSheet = workbook.addWorksheet('DataTables');
    let ExistingDataSheet = workbook.addWorksheet('ExistingRecords');

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

    dataTablesSheet.addTable({
      name: 'Staff',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'StaffCode', filterButton: false }
      ],
      rows: StaffDetails,
    });

    //upper case first letter in headers of existing rec
    const upperCase = (str: any) => str[0].toUpperCase() + str.slice(1);
    const res = existingRecords.map(
      (obj: any) => Object.fromEntries(Object.entries(obj).map(
        ([k, v]) => [upperCase(k), v])
      )
    );

    //Changing order of existing records
    var orderedExistingRec: any[] = [];
    res.forEach((i) => {
      let model = {
        StaffCode: i['StaffCode'],
        StaffName: i['StaffName'],
        ReportingOfficer: i['ReportingOfficerCode'],
        Email: i['EmailAddress'],
        PhoneNumber: i['PhoneNumber'],
        HierarchyCode: i['HierarchyCode'],
        PostionCode: i['PositionCode'],
        Position: i['Position'],
        UserName: i['UserName'],
        ActiveStatus: i['ActiveStatus']
      }
      orderedExistingRec.push(model)
    })


    this.excelService.CreateHeadersAndRows(orderedExistingRec, ExistingDataSheet)
    this.excelService.FormatSheet(ExistingDataSheet)

    for (let i = StaffDetails.length + 2; i < 5000; i++) {
      dataTablesSheet.getCell('A' + i).value =
        { formula: `=IF('Staff Data'!A${(i - StaffDetails.length)}=0,"",CONCATENATE('Staff Data'!B${(i - StaffDetails.length)},"-(",'Staff Data'!A${(i - StaffDetails.length)},")"))`, date1904: false }

    }
    var mandatoryColumns = ['A', 'B', 'C', 'F', 'H', 'J', 'L'];
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

      worksheet.getCell('F' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$F$2:$F${hierarchies.length + 1}`]//'"One,Two,Three,Four"'
      };
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$A$2:$A${StaffDetails.length + (i - 1)}`]
      };
      worksheet.getCell('L' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: ['"True,False"']
      };
      worksheet.getCell('K' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: ['"Administrator,Operational User"']
      };
      worksheet.getCell('E' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Please enter valid phone number",
        errorTitle: "Invalid phone number Format",
        formulae: [`=AND(ISNUMBER(E${i}),LEN(E${i})=11)`]
      };
      worksheet.getCell('D' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Please enter valid email",
        errorTitle: "Invalid email format",
        formulae: [`=ISNUMBER(MATCH("*@*.?*",D${i},0))`]
      };
      worksheet.getCell('J' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Spaces are not allowed",
        errorTitle: "Invalid user name format",
        formulae: [`=J${i}=SUBSTITUTE(J${i}," ","")`]
      };

      worksheet.getCell('I' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Please enter correct date",
        errorTitle: "Incorrect date format - mm/dd/yyyy",
        formulae: [`=AND(ISNUMBER(I${i}),LEFT(CELL("format",I${i}),1)="D")`]
      };

      worksheet.getCell('A' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: "Please enter unique staff code",
        errorTitle: "Duplicate Staff Code",
        formulae: [`=COUNTIF($A$2:$A${i}, $A${i})=1`]
      };


      worksheet.getCell('E' + i).numFmt = '+############';
      worksheet.getCell('E' + i).border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }

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
      fs.saveAs(blob, 'Staff_Data_Upload' + '.xlsx');
    })
  }


  GetHierarchyCodesAndStaffCodes() {
    this.uploadBtnLoaderVisible = true
    let hierarchyCodes: any = [];
    let staffCodes: any = [];
    let userNames: any = [];


    this.staffDet.GetHierarchyNodes().subscribe((res: any) => {
      res.data.filter((x: any) => x.parentCode != null && x.importKey != null)
        .forEach((item: any) => {
          hierarchyCodes.push(item.importKey);
        })

      this.staffDet.GetStaffDetails().subscribe((d: any) => {
        console.log(d.data)

        d.data.filter((x: any) => x.StaffCode != null && !x.EmployeeLastName.includes("Inactive"))
          .forEach((item: any) => {
            staffCodes.push(item.StaffCode);
            userNames.push(item.UserName)
          });
        this.readExcel({ HierarchyCodes: hierarchyCodes, StaffCodes: staffCodes, UserNames:userNames }, this.fileToUpload?.arrayBuffer())
      });
    });
  }


  GetBusinessUnitsAndDirectories() {
    this.loaderVisible = true
    let HierarchyCodes: any = [];
    let StaffDetails: any = []

    let headerList = ["Staff Code", "Staff Name", "Reporting Officer", "Email", "Phone Number", "Hierarchy Code", "Position Code", "Position", "Termination Date", "Username", "Permission", "IsActive"]

    this.staffDet.GetHierarchyNodes().subscribe((d: any) => {
      for (let i = 0; i < d.data.length; i++) {
        if (d.data[i].importKey != null && d.data[i].parentCode != null) {
          let a = {
            name: d.data[i].name + ' -(' + d.data[i].importKey + ')'
          }
          HierarchyCodes.push(Object.values(a))
        }
      }
      let reportData = {
        data: HierarchyCodes,
        headers: headerList
      }
      this.staffDet.GetStaffDetails().subscribe((d: any) => {
        for (let i = 0; i < d.data.length; i++) {
          if (d.data[i].StaffCode !== null && !(d.data[i].EmployeeLastName.includes("Inactive"))) {
            let a = {
              Code: d.data[i].EmployeeFirstName! + ' ' + d.data[i].EmployeeLastName! + ' -(' + d.data[i].StaffCode + ')'
            }
            StaffDetails.push(Object.values(a))
          }
        }
        let subsKey = JSON.parse(localStorage.getItem('subscriptionKey')!)
        let authToken = JSON.parse(localStorage.getItem('auth-token')!)

        this.staffDet.GetEmployees(subsKey, authToken).subscribe((d: any) => {
          this.exportExcel(reportData, reportData.data, StaffDetails, d.data);
          this.loaderVisible = false
        });
      });
    });
  }

  staffUploadFileRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx", ".xls"],
  };

  async readExcel(codes:any, arryBuffer?: Promise<ArrayBuffer>) {
    const workbook = new Workbook();
     arryBuffer?.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);
          let rowCount = 0;
          worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            rowCount = rowNumber
          });

          let rangeCell = `A2:L${rowCount}`;
          const [startCell, endCell] = rangeCell.split(":")

          const [endCellColumn, endRow] = endCell.match(/[a-z]+|[^a-z]+/gi) as string[]
          const [startCellColumn, startRow] = startCell.match(/[a-z]+|[^a-z]+/gi) as string[]

          let endColumn = worksheet.getColumn(endCellColumn)
          let startColumn = worksheet.getColumn(startCellColumn)

          if (!endColumn) throw new Error("End column not found")
          if (!startColumn) throw new Error("Start column not found")

          const endColumnNumber = endColumn.number
          const startColumnNumber = startColumn.number

          let staffList = [];
          let errorList = [];

          var regExp = /\(([^)]+)\)/;
          var regExAlpanumeric = /^[a-zA-Z0-9-_ ]*$/;
          var regexUserName = /^[a-zA-Z0-9-.@_]*$/;
          var regExAlpanumericNoSpaces = /^[A-Za-z0-9]*$/;
          for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
            let model = new StaffBulk();

            const row = worksheet.getRow(y)
            var hierarchyPermissionObj = new HierarchyPermissionModel();
            for (let x = startColumnNumber; x <= endColumnNumber; x++) {

              let cell = row.getCell(x);
              let cellVal = cell.value ? cell.value.toString() : ''
              let rowNo = row.number.toString();


              if (cell.address.includes("A")) {
                if (cell.value != null) {
                  model.staffCode = cellVal
                  if (!(regExAlpanumeric.test(model.staffCode))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Staff Code",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                } else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Staff Code",
                    ValueEntered: cellVal,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }
              if (cell.address.includes("B")) {
                if (cell.value != null) {
                  model.staffName = cellVal
                  if (!(regExAlpanumeric.test(cellVal))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Staff Name",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Alphanumerics"
                    }
                    errorList.push(data)
                  }
                } else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Staff Name",
                    ValueEntered: cellVal,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }
              if (cell.address.includes("C")) {
                if (cell.value != null) {
                  model.reportingOfficerCode = cell.value.toString()
                  if((/\(|\)|\[|\]/g.test(cell.value.toString()))){
                    model.reportingOfficerCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                    model.reportingOfficerName = cellVal.substring(0, cellVal.indexOf('-'));
                  }
                  else if(!codes.StaffCodes.includes(model.reportingOfficerCode)){
                    console.log(codes.StaffCodes)
                    console.log(cell.value)
                    let data = {
                      RowNo: rowNo,
                      Column: "Reporting Officer",
                      ValueEntered: cellVal,
                      ErrorMessage: "Reporting Officer Code doesn't exist",
                      ExpectedType: "Alphanumerics"
                    }
                    errorList.push(data)
                  }
                  if (!(regExAlpanumeric.test(model.reportingOfficerCode))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Reporting Officer",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Alphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Reporting Officer",
                    ValueEntered: cell.value,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }
              if (cell.address.includes("D")) {
                if (cell.value != null) {
                  model.email = JSON.parse(JSON.stringify(cell.value)).text
                  if (JSON.parse(JSON.stringify(cell.value)).text == undefined) {
                    model.email = cell.value.toString()
                  }
                  if (!model.email?.toString().match('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Email",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Eg: example@test.com"
                    }
                    errorList.push(data)
                  }
                }
              }
              if (cell.address.includes("E")) {
                if (cell.value != null) {
                  model.phone = cellVal
                  if (!(/^(?!0+$)(?:\(?\+\d{1,3}\)?|0)?\d{11}$/.test(cellVal))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Phone Number",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Eg: +61000000000"
                    }
                    errorList.push(data)
                  }
                }
              }
              if (cell.address.includes("F")) {
                if (cell.value != null) {
                  hierarchyPermissionObj.hierarchyNodeCode = cell.value.toString()
                  if((/\(|\)|\[|\]/g.test(cell.value.toString()))){
                  hierarchyPermissionObj.hierarchyNodeCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                  }
                  else if(!codes.HierarchyCodes.includes(hierarchyPermissionObj.hierarchyNodeCode)){
                    let data = {
                      RowNo: rowNo,
                      Column: "Hierarchy Code",
                      ValueEntered: cellVal,
                      ErrorMessage: "Hierarchy Code doesn't exist",
                      ExpectedType: "Alphanumerics"
                    }
                    errorList.push(data)
                  }
                  if (!(regExAlpanumeric.test(hierarchyPermissionObj.hierarchyNodeCode))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Hierarchy Code",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                else {
                  console.log(cell.value)
                  let data = {
                    RowNo: rowNo,
                    Column: "Hierarchy Code",
                    ValueEntered: cell.value,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }

              if (cell.address.includes("H")) {
                if (cell.value != null) {
                  model.position = cellVal
                  if (!(regExAlpanumeric.test(cellVal))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "Position",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Characters"
                    }
                    errorList.push(data)
                  }
                }
                else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Position",
                    ValueEntered: cellVal,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphabetic characters"
                  }
                  errorList.push(data)
                }
              }

              if (cell.address.includes("I")) {
                if (cell.value != null) {
                  model.terminationDate = new Date(cellVal).toISOString()
                }
              }
              if (cell.address.includes("J")) {
                if (cell.value != null) {
                  
                  if(typeof cell.value === 'object' && JSON.parse(JSON.stringify(cell.value)).text != undefined){
                    cellVal =  JSON.parse(JSON.stringify(cell.value)).text;
                  }
                  model.userName = cellVal
                  if (!(regexUserName.test(model.userName))) {
                    let data = {
                      RowNo: rowNo,
                      Column: "UserName",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Username",
                    ValueEntered: cellVal,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Alphanumerics"
                  }
                  errorList.push(data)
                }
              }

              if (cell.address.includes("K")) {
                if (cell.value != null) {
                  hierarchyPermissionObj.permission = cellVal
                  if (!(regExAlpanumeric.test(cellVal))) {
                    console.log(cellVal)
                    let data = {
                      RowNo: rowNo,
                      Column: "Permission",
                      ValueEntered: cellVal,
                      ErrorMessage: "Invalid Cell Data",
                      ExpectedType: "Characters"
                    }
                    errorList.push(data)
                  }
                }
              }
              if (cell.address.includes("L")) {
                if (cell.value != null) {
                  model.active = Boolean(cellVal)
                } else {
                  let data = {
                    RowNo: rowNo,
                    Column: "Is Active",
                    ValueEntered: cellVal,
                    ErrorMessage: "Cell is empty",
                    ExpectedType: "Boolean"
                  }
                  errorList.push(data)
                }
              }
              if (hierarchyPermissionObj.permission !== "" || hierarchyPermissionObj.hierarchyNodeCode !== "") {
                model.hierarchyPermissionList?.push(hierarchyPermissionObj)
              }
            }
            staffList.push(model)
          }

          const duplicateIds = staffList
            .map(v => v.staffCode)
            .filter((v, i, vIds) => vIds.indexOf(v) !== i)

          const duplicates = staffList
            .filter(obj => duplicateIds.includes(obj.staffCode));

          duplicates.forEach(element => {
            if (element.staffCode !== '') {
              let data = {
                RowNo: '',
                Column: "Staff Code",
                ValueEntered: element.staffCode,
                ErrorMessage: "Duplicate Cell Data",
                ExpectedType: "Staff Cannot be Duplicated"
              }
              errorList.push(data)
            }
          });
          this.data.changeDataList(staffList, errorList)
          this.changeNextButtonBehavior(false)
          this.showFileSuccessMessage = true;
          this.uploadBtnLoaderVisible = false
        });
    });
  
  }


}
