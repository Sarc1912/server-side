import { Module } from '@nestjs/common';
import { PaymentRecordsService } from './payment-records.service';
import { PaymentRecordsController } from './payment-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRecord } from '../../entities/PaymentRecord';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';
import { AuditLog } from '../../entities/AuditLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRecord, ActiveLoan, LoanScheduleItem, AuditLog]),
  ],
  controllers: [PaymentRecordsController],
  providers: [PaymentRecordsService],
})
export class PaymentRecordsModule {}
