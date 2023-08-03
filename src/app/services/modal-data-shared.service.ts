import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataSharedService {
  public eventEmitter: EventEmitter<any> = new EventEmitter();
  constructor() {}
}
