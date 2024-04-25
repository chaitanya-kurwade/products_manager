import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../types/jwt-payload.types';
export const getCurrentUserByContext = (
  context: ExecutionContext,
  data: keyof JwtPayload | undefined,
): unknown[] => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  if (data) {
    return req.user[data];
  }
  return req.user;
};
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) =>
    getCurrentUserByContext(context, data),
);
