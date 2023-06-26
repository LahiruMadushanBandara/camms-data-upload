import UrlConfig from 'src/assets/config/api-endpoints.json';

export const environment = {
  production: true,

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
};
