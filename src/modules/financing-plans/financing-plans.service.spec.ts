import { Test, TestingModule } from '@nestjs/testing';
import { FinancingPlansService } from './financing-plans.service';

describe('FinancingPlansService', () => {
  let service: FinancingPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancingPlansService],
    }).compile();

    service = module.get<FinancingPlansService>(FinancingPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
