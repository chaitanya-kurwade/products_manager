import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { BYPASS_JWT_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(BYPASS_JWT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context) as boolean;
  }

  // canActivate(context: ExecutionContext): boolean {
  //   const bypassJwt = this.reflector.getAllAndOverride<boolean>(
  //     BYPASS_JWT_KEY,
  //     [context.getHandler(), context.getClass()],
  //   );

  //   if (bypassJwt === true) {
  //     return true;
  //   }

  //   const request = context.switchToHttp().getRequest();

  //   if (request && request.headers && request.headers.authorization) {
  //     return super.canActivate(context) as boolean;
  //   }
  //   return false;
  // }
}
