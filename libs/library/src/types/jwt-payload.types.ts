import { ROLES } from 'common/library/enums/role.enum';

export type JwtPayload = {
  email: string;
  _id: string;
  role: ROLES;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string;
};
