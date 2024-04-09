export type JwtPayload = {
  email: string;
  _id: string;
  role: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string;
};
