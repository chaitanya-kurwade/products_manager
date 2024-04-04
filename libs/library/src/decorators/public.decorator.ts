import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const BYPASS_JWT_KEY = 'isPublic';
export const Public = (): CustomDecorator<string> => SetMetadata(BYPASS_JWT_KEY, true);
