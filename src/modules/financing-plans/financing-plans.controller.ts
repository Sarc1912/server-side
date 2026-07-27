import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinancingPlansService } from './financing-plans.service';
import { CreateFinancingPlanDto } from './dto/create-financing-plan.dto';
import { UpdateFinancingPlanDto } from './dto/update-financing-plan.dto';

@Controller('financing-plans')
export class FinancingPlansController {
  constructor(private readonly financingPlansService: FinancingPlansService) {}

  @Post()
  create(@Body() createFinancingPlanDto: CreateFinancingPlanDto) {
    return this.financingPlansService.create(createFinancingPlanDto);
  }

  @Get()
  findAll() {
    return this.financingPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financingPlansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinancingPlanDto: UpdateFinancingPlanDto) {
    return this.financingPlansService.update(+id, updateFinancingPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financingPlansService.remove(+id);
  }
}
