import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StaffBulk } from 'src/app/models/StaffBulk.model';

@Component({
  selector: 'app-upload-details-table',
  templateUrl: './upload-details-table.component.html',
  styleUrls: ['./upload-details-table.component.css'],
})
export class UploadDetailsTableComponent implements OnInit {
  @Output() mainModalOpen = new EventEmitter<string>();

  public modalActive: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  public gridData: any[] = [
    {
      ProductID: 1,
      ProductName: 'Chai',
      UnitPrice: 18,
      Category: {
        CategoryID: 1,
        CategoryName: 'Beverages',
      },
    },
    {
      ProductID: 2,
      ProductName: 'Chang',
      UnitPrice: 19,
      Category: {
        CategoryID: 1,
        CategoryName: 'Beverages',
      },
    },
    {
      ProductID: 3,
      ProductName: 'Aniseed Syrup',
      UnitPrice: 10,
      Category: {
        CategoryID: 2,
        CategoryName: 'Condiments',
      },
    },
  ];
  public closeCommonModal(e: any) {
    this.modalActive = false;
  }
  public openMainModelFromSelct(data: any) {
    this.mainModalOpen.emit(data);
  }
}
