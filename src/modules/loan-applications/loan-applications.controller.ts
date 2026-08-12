import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoanApplicationsService } from './loan-applications.service';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';
import { RejectLoanApplicationDto } from './dto/reject-loan-application.dto';

@Controller('loan-applications')
export class LoanApplicationsController {
  constructor(private readonly loanApplicationsService: LoanApplicationsService) {}

  @Post()
  create(@Body() createLoanApplicationDto: CreateLoanApplicationDto) {
    return this.loanApplicationsService.create(createLoanApplicationDto);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.loanApplicationsService.approve(+id);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectLoanApplicationDto: RejectLoanApplicationDto,
  ) {
    return this.loanApplicationsService.reject(+id, rejectLoanApplicationDto?.reason);
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
