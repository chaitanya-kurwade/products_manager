import { registerEnumType } from '@nestjs/graphql';

export enum VERIFICATION_TYPE {
  PASSWORD = 'PASSWORD',
  OTP = 'OTP',
  VERIFY = 'VERIFY',
}

registerEnumType(VERIFICATION_TYPE, {
  name: 'VERIFICATION_TYPE',
});
