import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar!: Subscription;    
    
  constructor() { }    
    
  onFirstComponentButtonClick() {    
    this.invokeFirstComponentFunction.emit();    
  }
}
