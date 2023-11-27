import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor() {}
  private _baseCammsAPI = '';
  private _baseForAuditLogAPI = '';
  public get baseForAuditLogAPI() {
    return this._baseForAuditLogAPI;
  }
  public set baseForAuditLogAPI(value) {
    this._baseForAuditLogAPI = value;
  }
  public get baseCammsAPI() {
    return this._baseCammsAPI;
  }
  public set baseCammsAPI(value) {
    this._baseCammsAPI = value;
  }
}
