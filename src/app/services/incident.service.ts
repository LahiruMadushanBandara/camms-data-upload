import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  getIncidentListUrl = 'https://demo.cammsconnect.com.au/incident/V2/Incident';

  getIncidentList(subscriptionKey: string, authToken: string) {
    console.log(authToken);
    console.log(subscriptionKey);

    var getIncidentListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', authToken);
    var getIncidentListOptions = {
      headers: getIncidentListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(this.getIncidentListUrl, getIncidentListOptions);
  }
}
