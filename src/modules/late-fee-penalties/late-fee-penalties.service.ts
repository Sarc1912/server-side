import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLateFeePenaltyDto } from './dto/create-late-fee-penalty.dto';
import { UpdateLateFeePenaltyDto } from './dto/update-late-fee-penalty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LateFeePenalty } from '../../entities/LateFeePenalty';
import { ActiveLoan } from '../../entities/ActiveLoan';
import { LoanScheduleItem } from '../../entities/LoanScheduleItem';

@Injectable()
export class LateFeePenaltiesService {
  constructor(
    @InjectRepository(LateFeePenalty)
    private readonly penaltyRepo: Repository<LateFeePenalty>,
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanScheduleItem)
    private readonly scheduleRepo: Repository<LoanScheduleItem>,
  ) {}

  private readonly relations = {
    loan: { user: true },
    scheduleItem: true,
  };

  async create(createLateFeePenaltyDto: CreateLateFeePenaltyDto) {
    const { loanId, scheduleItemId } = createLateFeePenaltyDto;

    const loan = await this.activeLoanRepo.findOne({ where: { id: loanId } });
    if (!loan) {
      throw new NotFoundException(`Préstamo con ID ${loanId} no encontrado`);
    }

    const scheduleItem = await this.scheduleRepo.findOne({
      where: { id: scheduleItemId },
    });
    if (!scheduleItem || scheduleItem.loanId !== loanId) {
      throw new NotFoundException(
        `Cuota con ID ${scheduleItemId} no encontrada para este préstamo`,
      );
    }

    const penalty = this.penaltyRepo.create(createLateFeePenaltyDto);
    return this.penaltyRepo.save(penalty);
  }

  findAll(): Promise<LateFeePenalty[]> {
    return this.penaltyRepo.find({
      relations: this.relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<LateFeePenalty> {
    const penalty = await this.penaltyRepo.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!penalty) {
      throw new NotFoundException(`Penalidad con ID ${id} no encontrada`);
    }
    return penalty;
  }

  async update(id: number, updateLateFeePenaltyDto: UpdateLateFeePenaltyDto) {
    const penalty = await this.findOne(id);
    this.penaltyRepo.merge(penalty, updateLateFeePenaltyDto);
    return this.penaltyRepo.save(penalty);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.penaltyRepo.delete(id);
  }
}
