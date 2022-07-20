import { Component, OnInit } from '@angular/core';
import { StaffService } from "../services/staff.service"
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { Staff } from '../models/staff.model';
import { LoadingService } from '../services/loading.service';
import { StaffBulk } from '../models/StaffBulk.model';
import { HierarchyPermissionModel } from '../models/HerarchyPersmission.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})


export class StaffComponent implements OnInit {

  constructor(private staffDet: StaffService, private loader: LoadingService) { }

  loading$ = this.loader.loadig$;
  BusniessUnits: any;
  Directories: any;

  workbook = new Workbook();
  worksheet = this.workbook.addWorksheet("Staff Data");

  exportExcel(excelData: any, StaffDetails: []) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const HierarchyCodes = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Staff Data');

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

    worksheet.addTable({
      name: 'Business Units',
      ref: 'Y1',
      headerRow: true,
      totalsRow: false,

      columns: [
        { name: 'Code', filterButton: false },
        { name: 'Name', filterButton: false },
      ],
      rows: HierarchyCodes,
    });

    worksheet.addTable({
      name: 'Staff',
      ref: 'AC1',
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
        formulae: [`=$Z$2:$Z${HierarchyCodes.length + 1}`]//'"One,Two,Three,Four"'
      };
    }
    for (let i = 2; i < 500; i++) {
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=$AC$2:$AC${StaffDetails.length + 1}`]//'"One,Two,Three,Four"'
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
    let HierarchyCodes: any = [];
    let StaffDetails: any = []
    let headerList = ["Employee ID", "Staff Code", "Reporting Officer Code", "HierarchyCode", "User Name", "Staff Name", "Position Code", "Position", "Email Address", "Phone Number", "Termination Date", "IsActive","Permission"]


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
      });
    });
  }

  readExcel(e: any) {
    const workbook = new Workbook();
    const target: DataTransfer = <DataTransfer>(e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const arryBuffer = new Response(target.files[0]).arrayBuffer();
    arryBuffer.then((data) => {
      workbook.xlsx.load(data)
        .then((x) => {
          let worksheet = workbook.getWorksheet(1);
          let rangeCell = 'B2:M6';
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
          
          let staffList = Array<StaffBulk>();

          var regExp = /\(([^)]+)\)/;
          

          for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
            let model = new StaffBulk();
            const row = worksheet.getRow(y)
            var hierarchyPermissionObj = new HierarchyPermissionModel();
            for (let x = startColumnNumber; x <= endColumnNumber; x++) {
              //console.log(row.getCell(x).value + ' - '+ row.getCell(x).address)
              if (row.getCell(x).address.includes("B") && row.getCell(x).value != null) {
                model.staffCode = row.getCell(x).value?.toString()
              }
              if (row.getCell(x).address.includes("C") && row.getCell(x).value != null) {
                model.reportingOfficerCode = regExp.exec((row.getCell(x).value!)?.toString())![1]?.toString()
              }
              if (row.getCell(x).address.includes("D") && row.getCell(x).value != null) {
                hierarchyPermissionObj.hierarchyNodeCode = regExp.exec((row.getCell(x).value!)?.toString())![1]?.toString()
              }
              if (row.getCell(x).address.includes("M") && row.getCell(x).value != null) {
                hierarchyPermissionObj.permission = row.getCell(x).value!.toString()
                console.log(row.getCell(x).value!.toString())
              }
              if (row.getCell(x).address.includes("E") && row.getCell(x).value != null) {
                model.userName = row.getCell(x).value?.toString()
              }
              if (row.getCell(x).address.includes("F") && row.getCell(x).value != null) {
                model.staffName = row.getCell(x).value?.toString()
              }
              // if (row.getCell(x).address.includes("G") && row.getCell(x).value != null) {
              //   model.positionCode = row.getCell(x).value?.toString()
              // }
              if (row.getCell(x).address.includes("H") && row.getCell(x).value != null) {
                model.position = row.getCell(x).value?.toString()
              }
              if (row.getCell(x).address.includes("I") && row.getCell(x).value != null) {
                model.email = JSON.parse(JSON.stringify(row.getCell(x).value)).text
              }
              if (row.getCell(x).address.includes("J") && row.getCell(x).value != null) {
                model.phone = row.getCell(x).value?.toString()
              }
              if (row.getCell(x).address.includes("K") && row.getCell(x).value != null) {
                model.terminationDate = row.getCell(x).value?.toString()
              }
              if (row.getCell(x).address.includes("L") && row.getCell(x).value != null) {
                model.active = Boolean(row.getCell(x).value)
              }
            }
            if ( hierarchyPermissionObj.permission !== "" || hierarchyPermissionObj.hierarchyNodeCode !== "") {
              model.hierarchyPermissionList?.push(hierarchyPermissionObj)
            }
            staffList.push(model)
          }
          console.log(staffList) 
          this.staffDet.AddFlexStaffBulk(staffList,true,5,5,5,"true").subscribe((d: any) => {
            console.log(d)
          });
        });
    });
  }
  ngOnInit(): void {
  }
}
