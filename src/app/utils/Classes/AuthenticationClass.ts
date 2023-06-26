import { HttpErrorResponse } from '@angular/common/http';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentService } from 'src/app/services/incident.service';
import { StaffService } from 'src/app/services/staff.service';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
export class AuthenticationClass {
  constructor(private authentication: AuthenticationService) {}

  // validate for incident
  public async incidentSupscriptionKeyCheck(
    authtoken: string,
    incidentSubscriptionKey: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authentication
        .checkIncidentKeyValidity(incidentSubscriptionKey, authtoken)
        .subscribe({
          next: () => {
            resolve('Correct Incident Supscription Key');
          },
          error: () => {
            reject('Check Incident Supscription Key');
          },
        });
    });
  }

  public staffSupscriptionKeyCheck(
    authToken: string,
    staffSupscriptionKey: string
  ): Promise<any> {
    return new Promise((res, rej) => {
      this.authentication
        .checkStaffKeyValidity(staffSupscriptionKey, authToken)
        .subscribe({
          next: () => {
            res('Correct Staff Supscription Key');
          },
          error: () => {
            rej('Check Incident Supscription Key');
          },
        });
    });
  }

  public HierarchySupscriptionKeyCheck(
    authToken: string,
    HierarchySupscriptionKey: string
  ): Promise<any> {
    return new Promise((res, rej) => {
      this.authentication
        .checkHierarchyKeyValidity(HierarchySupscriptionKey, authToken)
        .subscribe({
          next: () => {
            res('Correct Hierarchy Supscription Key');
          },
          error: () => {
            rej('Check Hierarchy Supscription Key');
          },
        });
    });
  }
}
