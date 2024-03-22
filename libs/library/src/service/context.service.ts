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

    // let ascdId = data['witsbyContractGroupId'] || '';
    // const { host } = req.headers;
    // const time = new Date().toISOString();
    // const path = req.originalUrl;
    // const status = req.statusCode;
    // const userInfo: UserInfo = await this.decryptedUserInfo(
    //   token,
    //   userId,
    //   req?.headers?.userinfo,
    // );
    // if (ascdId?.length < 1) {
    //   ascdId = userInfo.witsbyContractGroupId || '';
    // }

    // const user_agent = req.headers['user-agent'];
    // const referer = req.headers.referer || '';

    // const client: IClientData = {
    //   host,
    //   time,
    //   path,
    //   status,
    //   referer,
    //   user_agent,
    // };

    return { token, _id, role, email };
  }
}
