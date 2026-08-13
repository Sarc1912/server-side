import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { User } from '../../entities/User';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanApplication } from '../../entities/LoanApplication';
import { PaymentRecord } from '../../entities/PaymentRecord';
import { Product } from '../../entities/Product';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';

const makeQb = (handlers: { getRawOne?: () => any; getRawMany?: () => any }) => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  getRawOne: jest.fn().mockImplementation(handlers.getRawOne ?? (() => null)),
  getRawMany: jest.fn().mockImplementation(handlers.getRawMany ?? (() => [])),
});

describe('DashboardService', () => {
  let service: DashboardService;

  const repo = (handlers?: { getRawOne?: () => any; getRawMany?: () => any }) => {
    const qb = makeQb(handlers ?? {});
    return {
      count: jest.fn().mockResolvedValue(0),
      find: jest.fn().mockResolvedValue([]),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      qb,
    };
  };

  const mockUserRepo = repo();
  const mockActiveLoanRepo = repo({ getRawOne: () => ({ totalLoans: '1', totalPrincipal: '1000', totalBalance: '400' }) });
  const mockLoanAppRepo = repo();
  const mockPaymentRepo = repo();
  const mockProductRepo = repo();
  const mockScheduleRepo = repo({ getRawOne: () => ({ totalDue: '1000', totalPaid: '600' }) });

  beforeEach(async () => {
    jest.clearAllMocks();
    mockActiveLoanRepo.find.mockResolvedValue([{ id: 1 }]);
    mockActiveLoanRepo.qb.getRawOne.mockReturnValue({ totalLoans: '1', totalPrincipal: '1000', totalBalance: '400' });
    mockScheduleRepo.qb.getRawOne.mockReturnValue({ totalDue: '1000', totalPaid: '600' });
    mockUserRepo.qb.getRawOne.mockReturnValue({ avg: '700' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(ActiveLoan), useValue: mockActiveLoanRepo },
        { provide: getRepositoryToken(LoanApplication), useValue: mockLoanAppRepo },
        { provide: getRepositoryToken(PaymentRecord), useValue: mockPaymentRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(LoanScheduleItem), useValue: mockScheduleRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildPortfolioStats', () => {
    it('marca como moroso un préstamo con una cuota vencida', async () => {
      const past = new Date();
      past.setDate(past.getDate() - 10);
      const dueDate = past.toISOString().slice(0, 10);

      mockScheduleRepo.qb.getRawMany.mockResolvedValue([{ loanId: 1, dueDate }]);

      const portfolio = await (service as any).buildPortfolioStats([1]);

      expect(portfolio.onTimeLoans).toBe(0);
      expect(portfolio.lateLoans).toBe(1);
      expect(portfolio.overdueLoans).toBe(0);
      expect(portfolio.latePercent).toBe(100);
    });

    it('marca como vencido un préstamo con una cuota con más de 30 días de atraso', async () => {
      const past = new Date();
      past.setDate(past.getDate() - 45);
      const dueDate = past.toISOString().slice(0, 10);

      mockScheduleRepo.qb.getRawMany.mockResolvedValue([{ loanId: 1, dueDate }]);

      const portfolio = await (service as any).buildPortfolioStats([1]);

      expect(portfolio.onTimeLoans).toBe(0);
      expect(portfolio.overdueLoans).toBe(1);
      expect(portfolio.lateLoans).toBe(0);
    });

    it('ignora cuotas pagadas y cuotas con vencimiento futuro', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);

      mockScheduleRepo.qb.getRawMany.mockResolvedValue([
        { loanId: 1, dueDate: future.toISOString().slice(0, 10) },
        { loanId: 1, dueDate: '9999-12-31' },
      ]);

      const portfolio = await (service as any).buildPortfolioStats([1]);

      expect(portfolio.onTimeLoans).toBe(1);
      expect(portfolio.lateLoans).toBe(0);
      expect(portfolio.overdueLoans).toBe(0);
    });
  });
});
