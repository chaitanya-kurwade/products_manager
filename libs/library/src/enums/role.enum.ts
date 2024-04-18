import { registerEnumType } from '@nestjs/graphql';

export enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
}

registerEnumType(ROLES, {
  name: 'ROLES',
});
