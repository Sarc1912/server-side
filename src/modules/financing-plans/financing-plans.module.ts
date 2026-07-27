import { Module } from '@nestjs/common';
import { FinancingPlansService } from './financing-plans.service';
import { FinancingPlansController } from './financing-plans.controller';

@Module({
  controllers: [FinancingPlansController],
  providers: [FinancingPlansService],
})
export class FinancingPlansModule {}
