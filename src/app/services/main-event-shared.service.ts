import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MainEventSharedService {
  constructor() {}
  openMainModal = new EventEmitter<any>();

  triggerMainModalOpenEventFromSelectUploaderType(status: boolean) {
    this.openMainModal.emit(status);
  }

  triggerMainModalCloseEventToSelectUploaderType(status: boolean) {
    this.openMainModal.emit(status);
  }
}
