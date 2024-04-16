import { ROLES } from 'apps/auth/src/users/enums/role.enum';

export type JwtPayload = {
  email: string;
  _id: string;
  role: ROLES;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string;
};
