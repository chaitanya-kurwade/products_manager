import { Module } from '@nestjs/common';
import { PaginationInput } from './inputs/pagination.input';

@Module({
  exports: [PaginationInput],
  providers: [PaginationInput],
})
export class PaginationModule {}
