import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoanApplicationsService } from './loan-applications.service';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';

@Controller('loan-applications')
export class LoanApplicationsController {
  constructor(private readonly loanApplicationsService: LoanApplicationsService) {}

  @Post()
  create(@Body() createLoanApplicationDto: CreateLoanApplicationDto) {
    return this.loanApplicationsService.create(createLoanApplicationDto);
  }

  @Get()
  findAll() {
    return this.loanApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanApplicationDto: UpdateLoanApplicationDto) {
    return this.loanApplicationsService.update(+id, updateLoanApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanApplicationsService.remove(+id);
  }
}
