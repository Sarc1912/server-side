import { Test, TestingModule } from '@nestjs/testing';
import { LoanScheduleItemsService } from './loan-schedule-items.service';

describe('LoanScheduleItemsService', () => {
  let service: LoanScheduleItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanScheduleItemsService],
    }).compile();

    service = module.get<LoanScheduleItemsService>(LoanScheduleItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
