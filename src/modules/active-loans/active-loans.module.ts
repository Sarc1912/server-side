import { Module } from '@nestjs/common';
import { ActiveLoansService } from './active-loans.service';
import { ActiveLoansController } from './active-loans.controller';

@Module({
  controllers: [ActiveLoansController],
  providers: [ActiveLoansService],
})
export class ActiveLoansModule {}
