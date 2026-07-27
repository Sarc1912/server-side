import { Test, TestingModule } from '@nestjs/testing';
import { LateFeePenaltiesService } from './late-fee-penalties.service';

describe('LateFeePenaltiesService', () => {
  let service: LateFeePenaltiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LateFeePenaltiesService],
    }).compile();

    service = module.get<LateFeePenaltiesService>(LateFeePenaltiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
