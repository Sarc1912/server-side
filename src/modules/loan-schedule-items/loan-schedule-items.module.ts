import { Module } from '@nestjs/common';
import { LoanScheduleItemsService } from './loan-schedule-items.service';
import { LoanScheduleItemsController } from './loan-schedule-items.controller';

@Module({
  controllers: [LoanScheduleItemsController],
  providers: [LoanScheduleItemsService],
})
export class LoanScheduleItemsModule {}
