import { Injectable } from '@nestjs/common';
import { CreateFinancingPlanDto } from './dto/create-financing-plan.dto';
import { UpdateFinancingPlanDto } from './dto/update-financing-plan.dto';

@Injectable()
export class FinancingPlansService {
  create(createFinancingPlanDto: CreateFinancingPlanDto) {
    return 'This action adds a new financingPlan';
  }

  findAll() {
    return `This action returns all financingPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} financingPlan`;
  }

  update(id: number, updateFinancingPlanDto: UpdateFinancingPlanDto) {
    return `This action updates a #${id} financingPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} financingPlan`;
  }
}
