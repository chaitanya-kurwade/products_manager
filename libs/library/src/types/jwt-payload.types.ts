export type JwtPayload = {
  email: string;
  userId: string;
  role: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string;
};
