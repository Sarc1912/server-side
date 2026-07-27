import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancingPlanDto } from './create-financing-plan.dto';

export class UpdateFinancingPlanDto extends PartialType(CreateFinancingPlanDto) {}
