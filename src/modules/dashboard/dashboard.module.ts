import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/User';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanApplication } from '../../entities/LoanApplication';
import { PaymentRecord } from '../../entities/PaymentRecord';
import { Product } from '../../entities/Product';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ActiveLoan,
      LoanApplication,
      PaymentRecord,
      Product,
      LoanScheduleItem,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
