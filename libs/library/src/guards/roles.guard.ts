import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // required role
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext().req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      }); // Assuming you're using the JwtService from @nestjs/jwt

      if (typeof decodedToken !== 'object' || !decodedToken.hasOwnProperty('role')) {
        return false; // Invalid token format or missing role property
      }
      const userRole = decodedToken['role'];

      return requiredRoles.includes(userRole);
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      return false; // Token verification failed
    }
  }
}
