import { PartialType } from '@nestjs/mapped-types';
import { CreateLateFeePenaltyDto } from './create-late-fee-penalty.dto';

export class UpdateLateFeePenaltyDto extends PartialType(CreateLateFeePenaltyDto) {}
