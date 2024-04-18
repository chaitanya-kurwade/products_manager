import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'common/library/enums/role.enum';

export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
