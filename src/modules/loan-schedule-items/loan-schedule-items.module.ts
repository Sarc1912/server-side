import { Module } from '@nestjs/common';
import { LoanScheduleItemsService } from './loan-schedule-items.service';
import { LoanScheduleItemsController } from './loan-schedule-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';
import { ActiveLoan } from '../../entities/ActiveLoan';

@Module({
  imports: [TypeOrmModule.forFeature([LoanScheduleItem, ActiveLoan])],
  controllers: [LoanScheduleItemsController],
  providers: [LoanScheduleItemsService],
})
export class LoanScheduleItemsModule {}
