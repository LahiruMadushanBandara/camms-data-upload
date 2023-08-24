import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuditLogSharedService {
  constructor() {}

  // Define an EventEmitter to hold the event
  myEvent = new EventEmitter<void>();

  // Method to trigger the event
  triggerEvent() {
    this.myEvent.emit();
    console.log('hi-shared');
  }
}
