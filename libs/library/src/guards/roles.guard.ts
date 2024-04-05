import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES } from 'apps/auth/src/users/enums/role.enum';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext) {
    // required role
    const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const token = await ctx.getContext().req.headers['authorization']?.split(' ')[1];
    // console.log(token, 'token');

    if (!token) {
      return false;
    }

    const user = jwt.verify(token, 'mysecretkey');

    // // does the current user making request, have those requied role(s) in it
    return requiredRoles.some((role) => [user.role].includes(role));
  }
}
