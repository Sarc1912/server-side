import { Injectable } from '@nestjs/common';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';

@Injectable()
export class LoanApplicationsService {
  create(createLoanApplicationDto: CreateLoanApplicationDto) {
    return 'This action adds a new loanApplication';
  }

  findAll() {
    return `This action returns all loanApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loanApplication`;
  }

  update(id: number, updateLoanApplicationDto: UpdateLoanApplicationDto) {
    return `This action updates a #${id} loanApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} loanApplication`;
  }
}
