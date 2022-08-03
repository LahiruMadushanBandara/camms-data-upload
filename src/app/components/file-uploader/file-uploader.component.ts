import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class FileUploaderComponent implements OnInit {
  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  constructor() { }

  ngOnInit(): void {
  }

}
