import { UsersPermission } from './users.permissions';
import { ConnectionsPermission } from './connections.permissions';
import { ProjectsPermission } from './projects.permissions';
import { DataModelsPermission } from './data-models.permissions';

const Permission = {
  ...UsersPermission,
  ...ConnectionsPermission,
  ...ProjectsPermission,
  ...DataModelsPermission,
};

type Permission =
  | UsersPermission
  | ConnectionsPermission
  | ProjectsPermission
  | DataModelsPermission;

export default Permission;
