import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Permission from '../enums/permissions/permissions';

const PermissionGuard = (
  mandatoryPermissions: Permission[],
): Type<CanActivate> => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user: { permissions = [] } = {} } = context
        .switchToHttp()
        .getRequest();

      return (
        permissions.filter((permission) =>
          mandatoryPermissions.includes(permission),
        ).length > 0
      );
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
