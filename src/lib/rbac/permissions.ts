import { UserRole, RolePermissions } from './types';

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canCreateSheets: true,
    canEditOwnSheets: true,
    canEditAllSheets: true,
    canDeleteOwnSheets: true,
    canDeleteAllSheets: true,
    canVerifySheets: true,
  },
  admin: {
    canCreateSheets: true,
    canEditOwnSheets: true,
    canEditAllSheets: true,
    canDeleteOwnSheets: true,
    canDeleteAllSheets: true,
    canVerifySheets: true,
  },
  editor: {
    canCreateSheets: true,
    canEditOwnSheets: true,
    canEditAllSheets: false,
    canDeleteOwnSheets: true,
    canDeleteAllSheets: false,
    canVerifySheets: false,
  },
  quality_assurance: {
    canCreateSheets: false,
    canEditOwnSheets: false,
    canEditAllSheets: false,
    canDeleteOwnSheets: false,
    canDeleteAllSheets: false,
    canVerifySheets: true,
  },
  viewer: {
    canCreateSheets: false,
    canEditOwnSheets: false,
    canEditAllSheets: false,
    canDeleteOwnSheets: false,
    canDeleteAllSheets: false,
    canVerifySheets: false,
  },
};

export function getPermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}
