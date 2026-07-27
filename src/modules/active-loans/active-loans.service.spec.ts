import { Test, TestingModule } from '@nestjs/testing';
import { ActiveLoansService } from './active-loans.service';

describe('ActiveLoansService', () => {
  let service: ActiveLoansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveLoansService],
    }).compile();

    service = module.get<ActiveLoansService>(ActiveLoansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
