import { Test, TestingModule } from '@nestjs/testing';
import { LoanScheduleItemsController } from './loan-schedule-items.controller';
import { LoanScheduleItemsService } from './loan-schedule-items.service';

describe('LoanScheduleItemsController', () => {
  let controller: LoanScheduleItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanScheduleItemsController],
      providers: [LoanScheduleItemsService],
    }).compile();

    controller = module.get<LoanScheduleItemsController>(LoanScheduleItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
