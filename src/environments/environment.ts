// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import UrlConfig from 'src/assets/config/api-endpoints.json';

export const environment = {
  production: false,

  //API Endpoints
  HierarchyUrl : UrlConfig.HierarchyUrl,
  HierarchyNodeUrl : UrlConfig.HierarchyNodeUrl,
  FlexOrgStaff: UrlConfig.FlexOrgStaff,
  FlexHierarchyAddStaffBulkUrl : UrlConfig.FlexHierarchyAddStaffBulkUrl,
  getUserUrls : UrlConfig.getUserUrls

};

