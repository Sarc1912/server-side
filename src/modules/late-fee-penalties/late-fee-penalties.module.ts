import { Module } from '@nestjs/common';
import { LateFeePenaltiesService } from './late-fee-penalties.service';
import { LateFeePenaltiesController } from './late-fee-penalties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LateFeePenalty } from '../../entities/LateFeePenalty';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';

@Module({
  imports: [TypeOrmModule.forFeature([LateFeePenalty, ActiveLoan, LoanScheduleItem])],
  controllers: [LateFeePenaltiesController],
  providers: [LateFeePenaltiesService],
})
export class LateFeePenaltiesModule {}
