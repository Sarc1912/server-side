import { Test, TestingModule } from '@nestjs/testing';
import { LateFeePenaltiesController } from './late-fee-penalties.controller';
import { LateFeePenaltiesService } from './late-fee-penalties.service';

describe('LateFeePenaltiesController', () => {
  let controller: LateFeePenaltiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LateFeePenaltiesController],
      providers: [LateFeePenaltiesService],
    }).compile();

    controller = module.get<LateFeePenaltiesController>(LateFeePenaltiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
