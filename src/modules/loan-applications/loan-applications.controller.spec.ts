import { Test, TestingModule } from '@nestjs/testing';
import { LoanApplicationsController } from './loan-applications.controller';
import { LoanApplicationsService } from './loan-applications.service';

describe('LoanApplicationsController', () => {
  let controller: LoanApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanApplicationsController],
      providers: [LoanApplicationsService],
    }).compile();

    controller = module.get<LoanApplicationsController>(LoanApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
