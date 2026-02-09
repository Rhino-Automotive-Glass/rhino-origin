export type UserRole = 'super_admin' | 'admin' | 'editor' | 'quality_assurance' | 'viewer';

export interface RolePermissions {
  canCreateSheets: boolean;
  canEditOwnSheets: boolean;
  canEditAllSheets: boolean;
  canDeleteOwnSheets: boolean;
  canDeleteAllSheets: boolean;
  canVerifySheets: boolean;
}
