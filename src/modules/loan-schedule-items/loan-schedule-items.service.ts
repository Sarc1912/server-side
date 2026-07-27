import { Injectable } from '@nestjs/common';
import { CreateLoanScheduleItemDto } from './dto/create-loan-schedule-item.dto';
import { UpdateLoanScheduleItemDto } from './dto/update-loan-schedule-item.dto';

@Injectable()
export class LoanScheduleItemsService {
  create(createLoanScheduleItemDto: CreateLoanScheduleItemDto) {
    return 'This action adds a new loanScheduleItem';
  }

  findAll() {
    return `This action returns all loanScheduleItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loanScheduleItem`;
  }

  update(id: number, updateLoanScheduleItemDto: UpdateLoanScheduleItemDto) {
    return `This action updates a #${id} loanScheduleItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} loanScheduleItem`;
  }
}
