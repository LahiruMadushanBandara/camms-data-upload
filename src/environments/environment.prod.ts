import UrlConfig from 'src/assets/config/api-endpoints.json';

export const environment = {
  production: true,

  //API Endpoints
  HierarchyUrl : UrlConfig.HierarchyUrl,
  HierarchyNodeUrl : UrlConfig.HierarchyNodeUrl,
  FlexOrgStaff: UrlConfig.FlexOrgStaff,
  FlexHierarchyAddStaffBulkUrl : UrlConfig.FlexHierarchyAddStaffBulkUrl,
  getUserUrls : UrlConfig.getUserUrls
};
