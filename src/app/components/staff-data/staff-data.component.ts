import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { StaffService } from "../../services/staff.service"
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LoadingService } from '../../services/loading.service';
import { StaffBulk } from '../../models/StaffBulk.model';
import { HierarchyPermissionModel } from '../../models/HerarchyPersmission.model';
import { FormGroup } from '@angular/forms';
import { FileRestrictions, FileState, SelectEvent, UploadComponent, UploadEvent } from '@progress/kendo-angular-upload';
import { Subscription, timeout } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { CustomErrorModal } from 'src/app/models/CustomErrorModal.modal';

@Component({
  selector: 'app-staff-data',
  templateUrl: './staff-data.component.html',
  styleUrls: ['./staff-data.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StaffDataComponent implements OnInit, OnDestroy {
  public loaderVisible = false;
  public showErrorCard = false;
  public isIconShow = false;
  public showClearButton= false;
  public disabledUploadBtn=true;

  @Input()
  public staffUploadData!: FormGroup;

  @ViewChild('labelImport')
  labelImport!: ElementRef;

  @Output() newItemEvent = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  @Output() step1DisableEvent = new EventEmitter<boolean>();

  fileToUpload: File | null = null;

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  IsFileHasValidData = false
  onFileChange(e: any) {
    console.log("selecting")
    const workbook = new Workbook();
    const ell = document.getElementById('filename-txt-box');
    (<HTMLInputElement>ell)!.value = e.target.files[0].name;

    this.labelImport.nativeElement.innerText = e.target.files[0].name
    this.fileToUpload = e.target.files.item(0);


    this.fileToUpload?.arrayBuffer()?.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);

          const HeaderRow = worksheet.getRow(1)
          const FirstRow = worksheet.getRow(2)

          if (HeaderRow.getCell(3).value === null || FirstRow.getCell(3).value === null || worksheet.name !== "Staff Data") {
            this.IsFileHasValidData = false;
            this.showErrorCard  = true;
            console.log(this.showErrorCard)
          }
          else {
            this.IsFileHasValidData = true;
            this.showErrorCard  = false;
          }
          const el = document.getElementById('excelIcon');
          if (el!.style.display === 'none') {
            el!.style.display = 'block';
          }
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

  // onClickFileClearButton(){
    
  //   const ell = document.getElementById('filename-txt-box');
  //   (<HTMLInputElement>ell)!.value = '';
  //   const el = document.getElementById('excelIcon');
  //   el!.style.display = 'none';
  //   this.changeNextButtonBehavior(true)
  //   this.IsFileHasValidData = false;
  //           this.showErrorCard  = false;
  //           const selectbtnElement = document.getElementById('file-select-button');
  //         const uploadbtnElement = document.getElementById('file-upload-button');
  //         selectbtnElement!.style.display = 'block';
  //         uploadbtnElement!.style.display = 'none';
  // }

  onClickFileInputButton(): void {
    const selectbtnElement = document.getElementById('file-select-button');
    (<HTMLInputElement>selectbtnElement)!.disabled = true;
    this.readExcel(this.fileToUpload?.arrayBuffer())
    
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
  }

  constructor(private staffDet: StaffService, private loader: LoadingService, private data: SharedService) { }

  loading$ = this.loader.loadig$;
  BusniessUnits: any;
  Directories: any;



  exportExcel(excelData: any, StaffDetails: []) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const HierarchyCodes = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Staff Data');
    let dataTablesSheet = workbook.addWorksheet('DataTables');

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
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
      name: 'Business Units',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'Code', filterButton: false },
        { name: 'Name', filterButton: false },
      ],
      rows: HierarchyCodes,
    });

    dataTablesSheet.addTable({
      name: 'Staff',
      ref: 'E1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'StaffCode', filterButton: false }
      ],
      rows: StaffDetails,
    });

    for (let i = 2; i < 500; i++) {
      worksheet.getCell('D' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$B$2:$B${HierarchyCodes.length + 1}`]//'"One,Two,Three,Four"'
      };
    }
    for (let i = 2; i < 500; i++) {
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$E$2:$E${StaffDetails.length + 1}`]//'"One,Two,Three,Four"'
      };
    }

    for (let i = 2; i < 500; i++) {
      worksheet.getCell('L' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: ['"True,False"']//'"One,Two,Three,Four"'
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
      fs.saveAs(blob, 'Staff_Data_Upload' + '.xlsx');
    })

  }

  GetBusinessUnitsAndDirectories() {
    this.loaderVisible = true
    let HierarchyCodes: any = [];
    let StaffDetails: any = []
    let headerList = ["Employee ID", "Staff Code", "Reporting Officer Code", "HierarchyCode", "User Name", "Staff Name", "Position Code", "Position", "Email Address", "Phone Number", "Termination Date", "IsActive", "Permission"]


    this.staffDet.GetHierarchyNodes().subscribe((d: any) => {
      for (let i = 0; i < d.data.length; i++) {
        if (d.data[i].importKey != null && d.data[i].parentCode != null) {
          let a = {
            code: d.data[i].code,
            name: d.data[i].name + ' -(' + d.data[i].code + ')'
          }
          HierarchyCodes.push(Object.values(a))
        }
      }
      //console.log(Directorates)
      let reportData = {
        data: HierarchyCodes,
        headers: headerList
      }
      this.staffDet.GetStaffDetails().subscribe((d: any) => {
        for (let i = 0; i < d.data.length; i++) {
          if (d.data[i].StaffCode !== null) {
            let a = {
              Code: d.data[i].EmployeeFirstName! + ' ' + d.data[i].EmployeeLastName! + ' -(' + d.data[i].StaffCode + ')'
            }
            StaffDetails.push(Object.values(a))
          }
        }
        this.exportExcel(reportData, StaffDetails);
        this.loaderVisible = false
      });
      
    });
  }

  staffUploadFileRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx", ".xls"],
  };

  ValidateDate(str:string) {
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (t === null) return false;
    var d = parseInt(t[1]), m = parseInt(t[2], 10), y = parseInt(t[3], 10);
    //below should be more acurate algorithm
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return true;
    }
    return false;
  }

  readExcel(arryBuffer?: Promise<ArrayBuffer>) {
    //console.log(e.target);
    const workbook = new Workbook();
    arryBuffer?.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);
          let rowCount = 0;
          worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            console.log(rowNumber);
            rowCount = rowNumber
          });

          let rangeCell = `B2:M${rowCount}`;
          const [startCell, endCell] = rangeCell.split(":")

          const [endCellColumn, endRow] = endCell.match(/[a-z]+|[^a-z]+/gi) as string[]
          const [startCellColumn, startRow] = startCell.match(
            /[a-z]+|[^a-z]+/gi
          ) as string[]
          //console.log(sheet)
          let endColumn = worksheet.getColumn(endCellColumn)
          let startColumn = worksheet.getColumn(startCellColumn)

          if (!endColumn) throw new Error("End column not found")
          if (!startColumn) throw new Error("Start column not found")

          const endColumnNumber = endColumn.number
          const startColumnNumber = startColumn.number

          let staffList = [];
          let errorList = [];

          var regExp = /\(([^)]+)\)/;

          for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
            let model = new StaffBulk();
            //let errorModal = new CustomErrorModal();

            const row = worksheet.getRow(y)
            var hierarchyPermissionObj = new HierarchyPermissionModel();
            //console.log(row.values);
            for (let x = startColumnNumber; x <= endColumnNumber; x++) {

              let cell = row.getCell(x);

              if (cell.value != null) {
                if (cell.address.includes("B")) { //add other conditions here
                  model.staffCode = cell.value?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(cell.value.toString()))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Staff Code" Expected Data Type "Aplphanumerics"`);
                  }
                }
                if (cell.address.includes("C")) {
                  model.reportingOfficerCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(model.reportingOfficerCode))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Reporting Officer Code" Expected Data Type "Aplphanumerics"`);
                  }
                }
                if (cell.address.includes("D")) {
                  hierarchyPermissionObj.hierarchyNodeCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(hierarchyPermissionObj.hierarchyNodeCode))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Hierarchy Node Code" Expected Data Type "Aplphanumerics"`);
                  }
                }
                if (cell.address.includes("M")) {
                  hierarchyPermissionObj.permission = cell.value!.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(hierarchyPermissionObj.permission))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Permission" Expected Data Type "Characters"`);
                  }
                }
                if (cell.address.includes("E")) {
                  model.userName = cell.value?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(model.userName))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "UserName" Expected Data Type "Aplphanumerics"`);

                  }
                }
                if (cell.address.includes("F")) {
                  model.staffName = cell.value?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(model.staffName))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Staff Name" Expected Data Type "Aplphanumerics"`);
                  }
                }
                if (cell.address.includes("H")) {
                  model.position = cell.value?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(cell.value.toString()))) {
                    errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "position" Expected Format "Characters only"`);
                  }
                }
                if (cell.address.includes("I")) {
                  model.email = JSON.parse(JSON.stringify(cell.value)).text
                  if (!model.email?.toString().match('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')) {
                    errorList.push(`Invalid Email Format "${cell.value}" at row "${row.number}" Column "Email" Expected Format "Eg: example@test.com"`);

                  }
                }
                if (cell.address.includes("J")) {
                  model.phone = cell.value?.toString()
                  if (!(/^[0-9]+$/.test(cell.value.toString()))) {
                    errorList.push(`Invalid Phone Number type "${cell.value}" at row "${row.number}" Column "Phone Number" Expected Data type "Only Numerics"`);

                  }
                }
                if (cell.address.includes("K") && !this.ValidateDate(cell.value.toString())) {
                  model.terminationDate = cell.value?.toString()
                  errorList.push(`Invalid Date Format "${cell.value}" at row "${row.number}" Column "Termination Date" Expected Date Format "DD/MM/YYYY"`);

                }
                if (cell.address.includes("L")) {
                  model.active = Boolean(cell.value)
                }

              }
              else {


                if (cell.address.includes("B")) { //add other conditions here
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Staff Code" Expected Data type "Numerics/Characters"`);


                }
                if (cell.address.includes("C")) {
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Reporting Officer Code" Expected Data type "Numerics/Characters"`);


                }
                if (cell.address.includes("D")) {
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Hierarchy Node Code" Expected Data type "Numerics/Characters"`);


                }
                if (cell.address.includes("E")) {
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "User Name" Expected Data type "Characters with Numerics or Only Characters"`);


                }
                if (cell.address.includes("F")) {
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Staff Name" Expected Data type "Characters with Numerics or Only Characters"`);


                }
                //  if  (cell.address.includes("K")) {
                //   errorModal.RowNo= row.number.toString(); errorModal.Cell = x.toString(); errorModal.Column = "Termination Date"; errorModal.Message = "Please enter valid value"  , errorModal.ExpectedDataType = "YYYY/MM/DD Date format and Future Dates"
                //   errorList.push(errorModal)
                // }
                if (cell.address.includes("L")) {
                  errorList.push(`Invalid Cell Data "${cell.value}" at row "${row.number}" Column "Is Active" Expected Data type "Characters with Numerics or Only Characters"`);


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
          console.log(duplicates)

          duplicates.forEach(element => {
            if(element.staffCode !== ''){
              errorList.push(`Duplicate Cell Data "${element.staffCode}" at Column "Staff Code" Expected Data "Staff Cannot be Duplicated"`);

            }
          });

          this.data.changeDataList(staffList, errorList)
          this.changeNextButtonBehavior(false)

          // this.staffDet.AddFlexStaffBulk(staffList,true,5,5,5,"true").subscribe((d: any) => {
          //   console.log(d)
          // });
        });
    });
  }


}

