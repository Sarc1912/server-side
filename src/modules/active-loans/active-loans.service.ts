import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActiveLoanDto } from './dto/create-active-loan.dto';
import { UpdateActiveLoanDto } from './dto/update-active-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanApplication } from '../../entities/LoanApplication';
import { AuditLog } from '../../entities/AuditLog';

@Injectable()
export class ActiveLoansService {
  constructor(
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanApplication)
    private readonly loanAppRepo: Repository<LoanApplication>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  private readonly relations = {
    user: true,
    application: { financingPlan: { product: true }, items: { product: true } },
    scheduleItems: true,
    payments: true,
  };

  async create(createActiveLoanDto: CreateActiveLoanDto) {
    const application = await this.loanAppRepo.findOne({
      where: { id: createActiveLoanDto.applicationId },
    });
    if (!application) {
      throw new NotFoundException(
        `Solicitud de préstamo con ID ${createActiveLoanDto.applicationId} no encontrada`,
      );
    }

    const loan = this.activeLoanRepo.create(createActiveLoanDto);
    return this.activeLoanRepo.save(loan);
  }

  findAll(): Promise<ActiveLoan[]> {
    return this.activeLoanRepo.find({
      relations: this.relations,
      order: {
        createdAt: 'DESC',
        scheduleItems: { installmentNumber: 'ASC' },
      },
    });
  }

  async findOne(id: number): Promise<ActiveLoan> {
    const loan = await this.activeLoanRepo.findOne({
      where: { id },
      relations: this.relations,
      order: { scheduleItems: { installmentNumber: 'ASC' } },
    });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }
    return loan;
  }

  async update(id: number, updateActiveLoanDto: UpdateActiveLoanDto) {
    const loan = await this.findOne(id);

    this.activeLoanRepo.merge(loan, updateActiveLoanDto);
    const saved = await this.activeLoanRepo.save(loan);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'ActiveLoan',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'SYSTEM',
        details: updateActiveLoanDto,
      }),
    );

    return saved;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.activeLoanRepo.delete(id);
  }
}
