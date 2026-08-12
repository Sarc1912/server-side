import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanScheduleItemDto } from './dto/create-loan-schedule-item.dto';
import { UpdateLoanScheduleItemDto } from './dto/update-loan-schedule-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstallmentStatus, LoanScheduleItem } from '../../entities/LoanScheduleItem';
import { ActiveLoan } from '../../entities/ActiveLoan';

@Injectable()
export class LoanScheduleItemsService {
  constructor(
    @InjectRepository(LoanScheduleItem)
    private readonly scheduleRepo: Repository<LoanScheduleItem>,
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
  ) {}

  async create(createLoanScheduleItemDto: CreateLoanScheduleItemDto) {
    const loan = await this.activeLoanRepo.findOne({
      where: { id: createLoanScheduleItemDto.loanId },
    });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${createLoanScheduleItemDto.loanId} no encontrado`);
    }

    const existing = await this.scheduleRepo.findOne({
      where: {
        loanId: createLoanScheduleItemDto.loanId,
        installmentNumber: createLoanScheduleItemDto.installmentNumber,
      },
    });
    if (existing) {
      throw new ConflictException(
        `La cuota #${createLoanScheduleItemDto.installmentNumber} ya existe para este préstamo`,
      );
    }

    const item = this.scheduleRepo.create(createLoanScheduleItemDto);
    return this.scheduleRepo.save(item);
  }

  findAll(): Promise<LoanScheduleItem[]> {
    return this.scheduleRepo.find({
      relations: { loan: true },
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<LoanScheduleItem> {
    const item = await this.scheduleRepo.findOne({
      where: { id },
      relations: { loan: true },
    });
    if (!item) {
      throw new NotFoundException(`Cuota de préstamo con ID ${id} no encontrada`);
    }
    return item;
  }

  findByLoan(loanId: number): Promise<LoanScheduleItem[]> {
    return this.scheduleRepo.find({
      where: { loanId },
      order: { installmentNumber: 'ASC' },
    });
  }

  async update(id: number, updateLoanScheduleItemDto: UpdateLoanScheduleItemDto) {
    const item = await this.findOne(id);

    if (updateLoanScheduleItemDto.amountPaid !== undefined) {
      item.amountPaid = updateLoanScheduleItemDto.amountPaid;
      item.status =
        Number(item.amountPaid) >= Number(item.amountDue)
          ? InstallmentStatus.PAID
          : Number(item.amountPaid) > 0
            ? InstallmentStatus.PARTIALLY_PAID
            : InstallmentStatus.UNPAID;
      if (item.status === InstallmentStatus.PAID) {
        item.paidAt = item.paidAt ?? new Date();
      }
    }

    this.scheduleRepo.merge(item, updateLoanScheduleItemDto);
    return this.scheduleRepo.save(item);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.scheduleRepo.delete(id);
  }
}
