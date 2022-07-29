import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-hierarchy-node',
  templateUrl: './hierarchy-node.component.html',
  styleUrls: ['./hierarchy-node.component.css']
})
export class HierarchyNodeComponent implements OnInit {
  @Input()
  public hierarchyDetails!: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

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
      fs.saveAs(blob, 'HierarchyNode_Upload' + '.xlsx');
    })

  }

  readExcel(e:any){

  }

}
