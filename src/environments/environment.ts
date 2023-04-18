// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import UrlConfig from 'src/assets/config/api-endpoints.json';
import ApiConfig from 'src/assets/config/api-config.json';


export const environment = {
  production: false,

  //API Endpoints
  HierarchyUrl : UrlConfig.HierarchyUrl,
  HierarchyNodeUrl : UrlConfig.HierarchyNodeUrl,
  FlexOrgStaff: UrlConfig.FlexOrgStaff,
  FlexHierarchyAddStaffBulkUrl : UrlConfig.FlexHierarchyAddStaffBulkUrl,
  getUserUrls : UrlConfig.getUserUrls,

  //Authentication Keys
  AuthToken : ApiConfig.AuthToken,
  HierarchySubscriptionKey : ApiConfig.HierarchySubscriptionKey,
  StaffSubscriptionKey : ApiConfig.StaffSubscriptionKey

};

