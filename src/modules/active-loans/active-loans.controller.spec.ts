import { Test, TestingModule } from '@nestjs/testing';
import { ActiveLoansController } from './active-loans.controller';
import { ActiveLoansService } from './active-loans.service';

describe('ActiveLoansController', () => {
  let controller: ActiveLoansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveLoansController],
      providers: [ActiveLoansService],
    }).compile();

    controller = module.get<ActiveLoansController>(ActiveLoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
