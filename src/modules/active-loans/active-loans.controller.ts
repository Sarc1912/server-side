import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActiveLoansService } from './active-loans.service';
import { CreateActiveLoanDto } from './dto/create-active-loan.dto';
import { UpdateActiveLoanDto } from './dto/update-active-loan.dto';

@Controller('active-loans')
export class ActiveLoansController {
  constructor(private readonly activeLoansService: ActiveLoansService) {}

  @Post()
  create(@Body() createActiveLoanDto: CreateActiveLoanDto) {
    return this.activeLoansService.create(createActiveLoanDto);
  }

  @Get()
  findAll() {
    return this.activeLoansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activeLoansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActiveLoanDto: UpdateActiveLoanDto) {
    return this.activeLoansService.update(+id, updateActiveLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activeLoansService.remove(+id);
  }
}
