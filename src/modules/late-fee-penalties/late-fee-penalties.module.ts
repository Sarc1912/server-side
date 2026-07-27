import { Module } from '@nestjs/common';
import { LateFeePenaltiesService } from './late-fee-penalties.service';
import { LateFeePenaltiesController } from './late-fee-penalties.controller';

@Module({
  controllers: [LateFeePenaltiesController],
  providers: [LateFeePenaltiesService],
})
export class LateFeePenaltiesModule {}
