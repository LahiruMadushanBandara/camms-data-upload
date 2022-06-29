import { Component, OnInit } from '@angular/core';
import { StaffService } from "../services/staff.service"
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { Staff } from '../models/staff.model';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})


export class StaffComponent implements OnInit {

  

  constructor(private staffDet:StaffService, private loader :LoadingService) { }
  
  loading$ = this.loader.loadig$;
  BusniessUnits:any;
  Directories:any;
  
  workbook = new Workbook();
  worksheet = this.workbook.addWorksheet("Staff Data");

  exportExcel(excelData:any, BusinessUnitsList:[], DirectoratesList:[],StaffDetails:[]) {
    
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    console.log(data)

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Staff Data');

    
    //Add Row and formatting
    //worksheet.mergeCells('C1', 'F4');
    // let titleRow = worksheet.getCell('C1');
    // titleRow.value = title
    // titleRow.font = {
    //   name: 'Calibri',
    //   size: 16,
    //   underline: 'single',
    //   bold: true,
    //   color: { argb: '0085A3' }
    // }
    // titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    // let d = new Date();
    // let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    // let dateCell = worksheet.getCell('G1');
    // dateCell.value = date;
    // dateCell.font = {
    //   name: 'Calibri',
    //   size: 12,
    //   bold: true
    // }
    // dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // //Add Image
    // let myLogoImage = workbook.addImage({
    //   base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:B4');
    // worksheet.addImage(myLogoImage, 'A1:B4');

    ////Blank Row 
    //worksheet.addRow([]);

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
      name: 'Directorates',
      ref: 'U1',
      headerRow: true,
      totalsRow: false,
      
      columns: [
        {name: 'Code', filterButton: false},
        {name: 'Name', filterButton: false},
      ],
      rows: DirectoratesList,
    });

    worksheet.addTable({
      name: 'Business Units',
      ref: 'Y1',
      headerRow: true,
      totalsRow: false,
      
      columns: [
        {name: 'Code', filterButton: false},
        {name: 'Name', filterButton: false},
      ],
      rows: BusinessUnitsList,
    });

    worksheet.addTable({
      name: 'Staff',
      ref: 'AC1',
      headerRow: true,
      totalsRow: false,
      
      columns: [
        {name: 'StaffCode', filterButton: false}
      ],
      rows: StaffDetails,
    });



    // // Adding Data with Conditional Formatting
    // data.forEach((d: any) => {

    //     let row = worksheet.addRow(d);

    //     let sales = row.getCell(6);
    //     let color = 'FF99FF99';
    //     if (+ sales < 200000) {
    //       color = 'FF9999'
    //     }

    //     sales.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: color }
    //     }
    //   }
    // );

    // worksheet.getColumn(3).width = 20;
    // worksheet.addRow([]);
    //let dropList = ["Sales C001","name IT","value C002"];

    let BUdropdownlist = "\""+BusinessUnitsList.join(',')+"\"";
    
    for(let i=2;i<500;i++){
        worksheet.getCell('E'+i).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`=$Z$2:$Z${BusinessUnitsList.length + 1}`]//'"One,Two,Three,Four"'
          };
    }
    let DirectoratesDropdownList = "\""+DirectoratesList.join(',')+"\"";
    
    for(let i=2;i<500;i++){
        worksheet.getCell('D'+i).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`=$V$2:$V${DirectoratesList.length + 1}`]//'"One,Two,Three,Four"'
          };
    }
    let staffCodes = "\""+StaffDetails.join(',')+"\"";
    for(let i=2;i<500;i++){
      worksheet.getCell('C'+i).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`=$AC$2:$AC${StaffDetails.length + 1}`]//'"One,Two,Three,Four"'
        };
  }

    // //Footer Row
    // let footerRow = worksheet.addRow(['Staff data upload ']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFB050' }
    // };

    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

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
  

  GetBusinessUnitsAndDirectories(){
    let BusinessUnits:any = [];
    let Directorates:any = [];
    let StaffDetails:any = []
    let headerList = ["Employee ID","Staff Code","Reporting Officer Code","Directorate Code","Business Unit Code","Employee Name","Employee Email","Phone","Status","Position Code","Position","Termination Date","Title","Username","Permissions"]
    
      // this.staffDet.GetBusinessUnits().subscribe((d:any) => {
      //   console.log(d.data)
      //   for(let i =0;i< d.data.length;i++){
      //     BusinessUnits.push(d.data[i].name.toString())
      //   }
      //   let reportData = {
      //     data: '',
      //     headers: headerList
      //   }

      //   this.staffDet.GetDirectorates().subscribe((d:any) => {
      //     console.log(d.data)
      //     for(let i =0;i< d.data.length;i++){
      //       Directorates.push(d.data[i].name.toString())
      //     }
      //     this.exportExcel(reportData, BusinessUnits, Directorates);
      //   });
      // });
      this.staffDet.GetHierarchyNodes().subscribe((d:any) => {
          for(let i =0;i< d.data.length;i++){
            if(d.data[i].level == 2){
              let a = {
                code: d.data[i].code,
                name: d.data[i].name+' -('+d.data[i].code+')'
              }
              Directorates.push(Object.values(a))
            }
          }
         //console.log(Directorates)

          for(let i =0;i< d.data.length;i++){
            if(d.data[i].level == 3){
              let a = {
                code: d.data[i].code,
                name: d.data[i].name+' -('+d.data[i].code+')'
              }
              BusinessUnits.push(Object.values(a))
            }
          }
          //console.log(BusinessUnits)
          let reportData = {
            data: Directorates,
            headers: headerList
          }
          
          this.staffDet.GetStaffDetails().subscribe((d:any) => {
            for(let i =0;i< d.data.length;i++){
              if(d.data[i].StaffCode !== null){
                let a = {
                  Code:d.data[i].EmployeeFirstName!+' '+d.data[i].EmployeeLastName! + ' -('+d.data[i].StaffCode+')'
                }
                //console.log(a)
                StaffDetails.push(Object.values(a))
              }
            }
          console.log(StaffDetails)
          this.exportExcel(reportData, BusinessUnits, Directorates, StaffDetails);

          });
      });
  }

  // selectRange(sheet: Worksheet, rangeCell: string){
    
  
  //   return cells
  // }

  readExcel(e:any){
    let modelList:any = [];
    const workbook = new Workbook();
        const target: DataTransfer = <DataTransfer>(e.target);
        if (target.files.length !== 1) {
          throw new Error('Cannot use multiple files');
        }
        const arryBuffer = new Response(target.files[0]).arrayBuffer();
        arryBuffer.then((data) => {
          workbook.xlsx.load(data)
            .then((x)=> {
              let worksheet = workbook.getWorksheet(1);
              let rangeCell = 'B2:O4';
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
            
              for (let y = parseInt(startRow); y <= parseInt(endRow); y++) {
                const row = worksheet.getRow(y)
                let model = new Staff();
                const cells = []
                
                for (let x = startColumnNumber; x <= endColumnNumber; x++) {
                  if(row.getCell(x).value !== null)
                  {
                    //console.log(row.getCell(x).value)
                    cells.push(row.getCell(x).value)
                  }
                }
                if(cells.length !== 0){
                var regExp = /\(([^)]+)\)/;
                //console.log(regExp.exec((cells[3]!)?.toString())![1]?.toString())
                model.StaffCode =  cells[0]?.toString()

                var firstName = cells[4]?.toString().split(' ').slice(0, -1).join(' ');
                var lastName = cells[4]?.toString().split(' ').slice(-1).join(' ');

                model.ReportingOfficerCode = regExp.exec((cells[1]!)?.toString())![1]?.toString()
                model.DirectorateCode = ''//regExp.exec((cells[2]!)?.toString())![1]?.toString()
                model.BusinessUnitCode = ''//regExp.exec((cells[3]!)?.toString())![1]?.toString()
                model.EmployeeFirstName =  firstName
                model.EmployeeLastName = lastName
                model.EmailAddress = JSON.parse(JSON.stringify(cells[5])).text
                model.PhoneNumber = cells[6]?.toString()
                model.PositionCode = ''
                model.Position = cells[9]?.toString()
                model.TerminationDate = ''//cells[10]?.toString()
                model.UserName = cells[11]?.toString()

                
                console.log(model)
                this.staffDet.AddStaff(model).subscribe((d:any) => {
                  //console.log(model.StaffCode)
                  alert(d.message)
                })
                }
                
              }
              
            });
        });   
  }
  ngOnInit(): void {
  }
}
