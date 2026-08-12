import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoanScheduleItemsService } from './loan-schedule-items.service';
import { CreateLoanScheduleItemDto } from './dto/create-loan-schedule-item.dto';
import { UpdateLoanScheduleItemDto } from './dto/update-loan-schedule-item.dto';

@Controller('loan-schedule-items')
export class LoanScheduleItemsController {
  constructor(private readonly loanScheduleItemsService: LoanScheduleItemsService) {}

  @Post()
  create(@Body() createLoanScheduleItemDto: CreateLoanScheduleItemDto) {
    return this.loanScheduleItemsService.create(createLoanScheduleItemDto);
  }

  @Get()
  findAll() {
    return this.loanScheduleItemsService.findAll();
  }

  @Get('loan/:loanId')
  findByLoan(@Param('loanId') loanId: string) {
    return this.loanScheduleItemsService.findByLoan(+loanId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanScheduleItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanScheduleItemDto: UpdateLoanScheduleItemDto) {
    return this.loanScheduleItemsService.update(+id, updateLoanScheduleItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanScheduleItemsService.remove(+id);
  }
}
