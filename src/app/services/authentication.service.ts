import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  getCammsToken(OrganizationName: string, UserName: string, Password: string) {
    var getCammsTokenHeaders = new HttpHeaders()
      .append('OrganizationName', OrganizationName)
      .append('UserName', UserName)
      .append('Password', Password);
    var getCammsTokenOptions = {
      headers: getCammsTokenHeaders,
    };
    return this.http.get(environment.getCammsToken, getCammsTokenOptions);
  }
}
