type MyArrayType = Array<{ hierarchyNodeCode?:string; permission?: string;}>;

export class StaffBulk {
    staffCode?: string = "";
    reportingOfficerCode?: string= "";
    userName?: string= "";
    staffName?: string= "";
    position?: string= "";
    email?: string= "";
    phone?: string= "";
    active?: boolean = true;
    terminationDate?: string = "";
    hierarchyPermissionList?:MyArrayType = []; 
}