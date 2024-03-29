// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import UrlConfig from 'src/assets/config/api-endpoints.json';
import APIConfig from 'src/assets/config/api-details.json';
import kendoKey from 'src/assets/config/kendo-key.json';

export const environment = {
  production: false,

  //API Endpoints
  HierarchyUrl: UrlConfig.HierarchyUrl,
  HierarchyNodeUrl: UrlConfig.HierarchyNodeUrl,
  FlexOrgStaff: UrlConfig.FlexOrgStaff,
  FlexHierarchyAddStaffBulkUrl: UrlConfig.FlexHierarchyAddStaffBulkUrl,
  getUserUrls: UrlConfig.getUserUrls,
  checkStaffKeyValidity: UrlConfig.checkStaffKeyValidity,

  getWorkFlowList: UrlConfig.getWorkFlowList,
  getIncidentListUrl: UrlConfig.getIncidentListUrl,
  getWorkFlowElements: UrlConfig.getWorkFlowElements,
  getWorkflowElementFieldInfo: UrlConfig.getWorkflowElementFieldInfo,
  getListMapping: UrlConfig.getListMapping,
  getListItems: UrlConfig.getListItems,
  getIncidentTypes: UrlConfig.getIncidentTypes,

  getCammsToken: UrlConfig.getCammsToken,

  APIUserName: APIConfig.APIUserName,

  auditLogTestApiBaseUrl: UrlConfig.auditLogTestApiBaseUrl,

  KENDO_UI_LICENSE: kendoKey.KENDO_UI_LICENSE,
};
