import type { UserRole } from "@/types";

export function hasRequiredRole(currentRole: string | undefined, allowedRoles: UserRole[]) {
  if (!currentRole) {
    return false;
  }

  return allowedRoles.includes(currentRole as UserRole);
}
