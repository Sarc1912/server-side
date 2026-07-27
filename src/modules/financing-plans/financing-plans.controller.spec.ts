import { Test, TestingModule } from '@nestjs/testing';
import { FinancingPlansController } from './financing-plans.controller';
import { FinancingPlansService } from './financing-plans.service';

describe('FinancingPlansController', () => {
  let controller: FinancingPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancingPlansController],
      providers: [FinancingPlansService],
    }).compile();

    controller = module.get<FinancingPlansController>(FinancingPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
