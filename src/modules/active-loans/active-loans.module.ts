import { Module } from '@nestjs/common';
import { ActiveLoansService } from './active-loans.service';
import { ActiveLoansController } from './active-loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanApplication } from '../../entities/LoanApplication';
import { AuditLog } from '../../entities/AuditLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveLoan, LoanApplication, AuditLog]),
  ],
  controllers: [ActiveLoansController],
  providers: [ActiveLoansService],
})
export class ActiveLoansModule {}
