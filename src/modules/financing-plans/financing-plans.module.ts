import { Module } from '@nestjs/common';
import { FinancingPlansService } from './financing-plans.service';
import { FinancingPlansController } from './financing-plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancingPlan } from '../../entities/FinancingPlan';
import { Product } from '../../entities/Product';

@Module({
  imports: [TypeOrmModule.forFeature([FinancingPlan, Product])],
  controllers: [FinancingPlansController],
  providers: [FinancingPlansService],
})
export class FinancingPlansModule {}
