import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ActiveLoan } from '../../entities/ActiveLoan';
import {
  InstallmentStatus,
  LoanScheduleItem,
} from '../../entities/LoanScheduleItem';
import { PaymentMethod } from '../../entities/PaymentMethod';

@Injectable()
export class PaymentDataService {
  constructor(
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanScheduleItem)
    private readonly scheduleRepo: Repository<LoanScheduleItem>,
    @InjectRepository(PaymentMethod)
    private readonly methodRepo: Repository<PaymentMethod>,
  ) {}

  async getPaymentData(loanId: number) {
    const loan = await this.activeLoanRepo.findOne({
      where: { id: loanId },
      relations: {
        user: true,
        application: { financingPlan: { product: true } },
      },
    });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${loanId} no encontrado`);
    }

    const [pendingInstallments, paymentMethods] = await Promise.all([
      this.scheduleRepo.find({
        where: {
          loanId,
          status: Not(InstallmentStatus.PAID),
        },
        order: { installmentNumber: 'ASC' },
      }),
      this.methodRepo.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC', id: 'ASC' },
      }),
    ]);

    return {
      loan,
      pendingInstallments,
      paymentMethods,
    };
  }
}
