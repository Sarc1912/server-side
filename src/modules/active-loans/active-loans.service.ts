import { Injectable } from '@nestjs/common';
import { CreateActiveLoanDto } from './dto/create-active-loan.dto';
import { UpdateActiveLoanDto } from './dto/update-active-loan.dto';

@Injectable()
export class ActiveLoansService {
  create(createActiveLoanDto: CreateActiveLoanDto) {
    return 'This action adds a new activeLoan';
  }

  findAll() {
    return `This action returns all activeLoans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activeLoan`;
  }

  update(id: number, updateActiveLoanDto: UpdateActiveLoanDto) {
    return `This action updates a #${id} activeLoan`;
  }

  remove(id: number) {
    return `This action removes a #${id} activeLoan`;
  }
}
