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

  exportExcel(excelData: any) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers

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
  
  downloadHierarchyTemplate() {
    
    let headerList = ["Hierarchy Node ID", "Name", "Parent Hierarcy ID","IsNode" ]

    let hierarchyDetails = {
      headers : headerList
    }
    this.exportExcel(hierarchyDetails);  
  }
}
