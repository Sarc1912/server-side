import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';
import { PaymentRecord, PaymentStatus } from '../../entities/PaymentRecord';
import { ActiveLoan, LoanStatus } from '../../entities/ActiveLoan';
import {
  InstallmentStatus,
  LoanScheduleItem,
} from '../../entities/LoanScheduleItem';
import { AuditLog } from '../../entities/AuditLog';

@Injectable()
export class PaymentRecordsService {
  constructor(
    @InjectRepository(PaymentRecord)
    private readonly paymentRepo: Repository<PaymentRecord>,
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanScheduleItem)
    private readonly scheduleRepo: Repository<LoanScheduleItem>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  private readonly relations = {
    loan: { user: true },
    scheduleItem: true,
  };

  async create(createPaymentRecordDto: CreatePaymentRecordDto) {
    const { loanId, scheduleItemId, amountPaid, paymentMethod, transactionReference } =
      createPaymentRecordDto;

    const loan = await this.activeLoanRepo.findOne({ where: { id: loanId } });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${loanId} no encontrado`);
    }
    if (loan.loanStatus === LoanStatus.PAID_IN_FULL) {
      throw new ConflictException('El préstamo ya está pagado en su totalidad');
    }

    let targetScheduleItemId = scheduleItemId;
    if (!targetScheduleItemId) {
      const nextItem = await this.scheduleRepo.findOne({
        where: {
          loanId,
          status: In([InstallmentStatus.UNPAID, InstallmentStatus.PARTIALLY_PAID]),
        },
        order: { installmentNumber: 'ASC' },
      });
      if (!nextItem) {
        throw new BadRequestException('No hay cuotas pendientes para este préstamo');
      }
      targetScheduleItemId = nextItem.id;
    }

    const scheduleItem = await this.scheduleRepo.findOne({
      where: { id: targetScheduleItemId },
    });
    if (!scheduleItem || scheduleItem.loanId !== loanId) {
      throw new NotFoundException(
        `Cuota con ID ${targetScheduleItemId} no encontrada para este préstamo`,
      );
    }
    if (scheduleItem.status === InstallmentStatus.PAID) {
      throw new ConflictException(
        `La cuota #${scheduleItem.installmentNumber} ya está pagada`,
      );
    }

    const payment = this.paymentRepo.create({
      loanId,
      scheduleItemId: scheduleItem.id,
      amountPaid,
      paymentMethod,
      transactionReference,
      paymentStatus: PaymentStatus.COMPLETED,
    });
    const savedPayment = await this.paymentRepo.save(payment);

    // Aplicar el pago a la cuota
    const newPaid = Number(
      (Number(scheduleItem.amountPaid ?? 0) + Number(amountPaid)).toFixed(2),
    );
    scheduleItem.amountPaid = newPaid;
    if (newPaid >= Number(scheduleItem.amountDue)) {
      scheduleItem.status = InstallmentStatus.PAID;
      scheduleItem.paidAt = new Date();
    } else {
      scheduleItem.status = InstallmentStatus.PARTIALLY_PAID;
    }
    await this.scheduleRepo.save(scheduleItem);

    // Actualizar el saldo restante del préstamo
    const newBalance = Number(
      (Number(loan.remainingBalance ?? 0) - Number(amountPaid)).toFixed(2),
    );
    loan.remainingBalance = newBalance <= 0 ? 0 : newBalance;
    if (loan.remainingBalance === 0) {
      loan.loanStatus = LoanStatus.PAID_IN_FULL;
    }
    await this.activeLoanRepo.save(loan);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'PaymentRecord',
        entityId: savedPayment.id,
        action: 'CREATE',
        performedBy: paymentMethod,
        details: { loanId, scheduleItemId: scheduleItem.id, amountPaid },
      }),
    );

    return this.findOne(savedPayment.id);
  }

  findAll(): Promise<PaymentRecord[]> {
    return this.paymentRepo.find({
      relations: this.relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PaymentRecord> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return payment;
  }

  async update(id: number, updatePaymentRecordDto: UpdatePaymentRecordDto) {
    const payment = await this.findOne(id);
    this.paymentRepo.merge(payment, updatePaymentRecordDto);
    return this.paymentRepo.save(payment);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.paymentRepo.delete(id);
  }
}
