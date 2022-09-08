import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { StaffService } from "../../services/staff.service"
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LoadingService } from '../../services/loading.service';
import { StaffBulk } from '../../models/StaffBulk.model';
import { HierarchyPermissionModel } from '../../models/HerarchyPersmission.model';
import { FormGroup } from '@angular/forms';
import { FileRestrictions, FileState, SelectEvent, UploadComponent } from '@progress/kendo-angular-upload';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

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
  public showSelectBtn = true;
  public showFileSuccessMessage = false;
  changefileSelectBackground = false;

  @Input()
  public staffUploadData!: FormGroup;

  @ViewChild('fileInputSelect',{static:true}) fileInputSelect!: ElementRef;
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

  clearSelectedFile(e:any){
    this.fileInputSelect.nativeElement.value = "Please Select";
    //this.fselectEl.nativeElement.value = ""
    this.showFileIcon = false;
    this.showErrorCard = false;
    this.isIconShow = false;
    this.disabledUploadBtn=true;
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
          const FirstRow = worksheet.getRow(2)

          if (HeaderRow.getCell(3).value === null || FirstRow.getCell(3).value === null || worksheet.name !== "Staff Data") {
            this.IsFileHasValidData = false;
            this.showErrorCard  = true;
            this.changefileSelectBackground = false;
          }
          else {
            this.IsFileHasValidData = true;
            this.showErrorCard  = false;
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

  constructor(private staffDet: StaffService, private loader: LoadingService, private data: SharedService) { }

  loading$ = this.loader.loadig$;
  BusniessUnits: any;
  Directories: any;

  exportExcel(excelData: any, hierarchies:[], StaffDetails: []) {

    //Title, Header & Data
    const header = excelData.headers;
    
    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Staff Data');
    let dataTablesSheet = workbook.addWorksheet('DataTables');

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
      ref: 'A1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'HierarchyCode', filterButton: false },
      ],
      rows: hierarchies,
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

    for (let i = StaffDetails.length + 2; i < 500; i++) {
      console.log((i-StaffDetails.length)+1)
      dataTablesSheet.getCell('E' + i).value = 
      { formula: `=IF('Staff Data'!A${(i-StaffDetails.length)}=0,"",CONCATENATE('Staff Data'!E${(i-StaffDetails.length)},"-(",'Staff Data'!A${(i-StaffDetails.length)},")"))`, date1904:false}
      
    }

    for (let i = 2; i < 500; i++) 
    {
      worksheet.getCell('D' + i).dataValidation = {
        type: 'textLength',
        operator: 'lessThan',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [50]
      };
      worksheet.getCell('E' + i).dataValidation = {
        type: 'textLength',
        operator: 'lessThan',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [50]
      };

      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$A$2:$A${hierarchies.length + 1}`]//'"One,Two,Three,Four"'
      };
      worksheet.getCell('B' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$E$2:$E${StaffDetails.length + (i-1)}`]//'"One,Two,Three,Four"'
      };
      worksheet.getCell('K' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: ['"True,False"']//'"One,Two,Three,Four"'
      };
      worksheet.getCell('L' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: ['"Administrator,Operational User"']//'"One,Two,Three,Four"'
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
    let headerList = ["Staff Code", "Reporting Officer Code", "HierarchyCode", "User Name", "Staff Name", "Position Code", "Position", "Email Address", "Phone Number", "Termination Date", "IsActive", "Permission"]


    this.staffDet.GetHierarchyNodes().subscribe((d: any) => {
      for (let i = 0; i < d.data.length; i++) {
        if (d.data[i].importKey != null && d.data[i].parentCode != null) {
          let a = {
            name: d.data[i].name + ' -(' + d.data[i].code + ')'
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
        this.exportExcel(reportData, reportData.data, StaffDetails);
        this.loaderVisible = false
      });
      
    });
  }

  staffUploadFileRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx", ".xls"],
  };

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

          let rangeCell = `A2:L${rowCount}`;
          const [startCell, endCell] = rangeCell.split(":")

          const [endCellColumn, endRow] = endCell.match(/[a-z]+|[^a-z]+/gi) as string[]
          const [startCellColumn, startRow] = startCell.match(
            /[a-z]+|[^a-z]+/gi
          ) as string[]

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

            const row = worksheet.getRow(y)
            var hierarchyPermissionObj = new HierarchyPermissionModel();
            console.log(row.values);
            for (let x = startColumnNumber; x <= endColumnNumber; x++) {

              let cell = row.getCell(x);

              if (cell.value != null) {
                if (cell.address.includes("A")) { //add other conditions here
                  model.staffCode = cell.value?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(cell.value.toString()))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Staff Code",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Aplphanumerics"
                    }
                    errorList.push(data) 
                  }
                }
                if (cell.address.includes("B")) {
                  console.log(cell.value)
                  model.reportingOfficerCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                  model.reportingOfficerName = cell.value.toString().substring(0, cell.value.toString().indexOf('-'));
                  if (!(/^[A-Za-z0-9]*$/.test(model.reportingOfficerCode))) {
                    console.log(model.reportingOfficerCode)
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Reporting Officer Code",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Aplphanumerics"
                    }
                    errorList.push(data) 
                  }
                }
                if (cell.address.includes("C")) {
                  hierarchyPermissionObj.hierarchyNodeCode = regExp.exec((cell.value!)?.toString())![1]?.toString()
                  if (!(/^[A-Za-z0-9]*$/.test(hierarchyPermissionObj.hierarchyNodeCode))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Hierarchy Node Code",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("L")) {
                  hierarchyPermissionObj.permission = cell.value!.toString()
                  if (!(/^[A-Za-z0-9 _]*$/.test(hierarchyPermissionObj.permission))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Permission",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Characters"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("D")) {
                  model.userName = cell.value?.toString()
                  if (!(/^[A-Za-z0-9 _]*$/.test(model.userName))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"UserName",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("E")) {
                  model.staffName = cell.value?.toString()
                  if (!(/^[A-Za-z0-9 _]*$/.test(model.staffName))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Staff Name",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Aplphanumerics"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("G")) {
                  model.position = cell.value?.toString()
                  if (!(/^[A-Za-z0-9 _]*$/.test(cell.value.toString()))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Position",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Characters"
                    }
                    errorList.push(data) 
                  }
                }
                if (cell.address.includes("H")) {
                  model.email = JSON.parse(JSON.stringify(cell.value)).text
                  if (!model.email?.toString().match('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Email",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Eg: example@test.com"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("I")) {
                  model.phone = cell.value?.toString()
                  if (!(/^[0-9]+$/.test(cell.value.toString()))) {
                    let data = {
                      RowNo :row.number.toString(),
                      Column :"Phone Number",
                      ValueEntered : cell.value.toString(),
                      ErrorMessage :"Invalid Cell Data",
                      ExpectedType :"Numerics"
                    }
                    errorList.push(data)
                  }
                }
                if (cell.address.includes("J")) {
                  model.terminationDate = new Date(cell.value.toString()).toISOString()
                }
                if (cell.address.includes("K")) {
                  model.active = Boolean(cell.value)
                }
              }
              else {
                if (cell.address.includes("A")) { //add other conditions here
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"Staff Code",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Aplphanumerics"
                  }
                  errorList.push(data)
                }
                if (cell.address.includes("B")) {
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"Reporting Officer Code",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Aplphanumerics"
                  }
                  errorList.push(data)
                }
                if (cell.address.includes("C")) {
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"Hierarchy Node Code",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Aplphanumerics"
                  }
                  errorList.push(data)
                }
                if (cell.address.includes("D")) {
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"User Name",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Aplphanumerics"
                  }
                  errorList.push(data)
                }
                if (cell.address.includes("E")) {
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"Staff Name",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Aplphanumerics"
                  }
                  errorList.push(data)
                }
                if (cell.address.includes("K")) {
                  let data = {
                    RowNo :row.number.toString(),
                    Column :"Is Active",
                    ValueEntered : cell.value,
                    ErrorMessage :"Cell is empty",
                    ExpectedType :"Boolean"
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
          console.log(duplicates)

          duplicates.forEach(element => {
            if(element.staffCode !== ''){
              let data = {
                CellValue : element.staffCode,
                Column :"Staff Code",
                Message :"Duplicate Cell Data",
                ExpectedDataType :"Staff Cannot be Duplicated"
              }
              errorList.push(data)
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

