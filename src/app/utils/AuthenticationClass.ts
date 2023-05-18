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
  public incidentAutenticateFunction(
    authtoken: string,
    StaffSubscriptionKey: string,
    incidentSubscriptionKey: string
  ): string[] {
    var errArray: string[] = [];
    this.staffService.GetEmployees(StaffSubscriptionKey, authtoken).subscribe({
      error: (error: HttpErrorResponse) => {
        errArray.push('staff');
      },
    });
    this.incidentService
      .getIncidentList(incidentSubscriptionKey, authtoken)
      .subscribe({
        error: (error: HttpErrorResponse) => {
          errArray.push('incident');
        },
      });
    return errArray;
  }
}
