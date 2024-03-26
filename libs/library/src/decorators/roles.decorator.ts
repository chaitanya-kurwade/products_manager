import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'apps/auth/src/users/enums/role.enum';

export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
