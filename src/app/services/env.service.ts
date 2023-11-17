import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  public baseForCammsAPI = 'https://demo.cammsconnect.com.au';
  public baseForAuditLogAPI = 'https://localhost:7206';

  constructor() {}
}
