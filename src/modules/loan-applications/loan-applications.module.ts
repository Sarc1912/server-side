import { Module } from '@nestjs/common';
import { LoanApplicationsService } from './loan-applications.service';
import { LoanApplicationsController } from './loan-applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from '../../entities/LoanApplication';
import { LoanApplicationItem } from '../../entities/LoanApplicationItem';
import { Product } from '../../entities/Product';
import { User } from '../../entities/User';
import { FinancingPlan } from '../../entities/FinancingPlan';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';
import { AuditLog } from '../../entities/AuditLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoanApplication,
      LoanApplicationItem,
      Product,
      User,
      FinancingPlan,
      ActiveLoan,
      LoanScheduleItem,
      AuditLog,
    ]),
  ],
  controllers: [LoanApplicationsController],
  providers: [LoanApplicationsService],
  exports: [LoanApplicationsService],
})
export class LoanApplicationsModule {}
