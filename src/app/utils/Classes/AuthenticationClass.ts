import { HttpErrorResponse } from '@angular/common/http';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentService } from 'src/app/services/incident.service';
import { StaffService } from 'src/app/services/staff.service';
import { forkJoin } from 'rxjs';
export class AuthenticationClass {
  constructor(
    private staffService: StaffService,
    private hierarchyService: HierarchyService,
    private incidentService: IncidentService
  ) {}

  // public staffAndHierarchyAutenticateFunction(
  //   authtoken: string,
  //   StaffSubscriptionKey: string,
  //   HierarchySubscriptionKey: string
  // ) {
  //   if (authtoken == '') {
  //   }
  // }

  // validate for incident
  public async incidentSupscriptionKeyCheck(
    authtoken: string,
    incidentSubscriptionKey: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.incidentService
        .getIncidentList(incidentSubscriptionKey, authtoken)
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (error: HttpErrorResponse) => {
            reject(error);
          },
        });
    });
  }
}

// this.staffService
// .GetEmployees(StaffSubscriptionKey, authtoken)
// .subscribe({
//   error: (error: HttpErrorResponse) => {
//     errArray.push('staff');
//   },
// });
