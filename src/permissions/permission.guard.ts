import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Permission from '../enums/permissions/permissions';

const PermissionGuard = (
  mandatoryPermissions: Permission[],
): Type<CanActivate> => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();
      console.log(`user`, user);
      const { permissions = [] } = user;

      return (
        permissions.map((permission) =>
          mandatoryPermissions.includes(permission),
        ).length > 0
      );
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
