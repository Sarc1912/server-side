import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDataService } from './payment-data.service';
import { PaymentDataController } from './payment-data.controller';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';
import { PaymentMethod } from '../../entities/PaymentMethod';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveLoan, LoanScheduleItem, PaymentMethod]),
  ],
  controllers: [PaymentDataController],
  providers: [PaymentDataService],
})
export class PaymentDataModule {}
