import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class ContextService {
  async getContextInfo(req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const data: string | jwt.JwtPayload = jwt.decode(token);

    const role = data['role'];
    const _id = data['_id'];
    const email = data['email'];

    return { token, _id, role, email };
  }
}
