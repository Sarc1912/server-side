import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanScheduleItemDto } from './create-loan-schedule-item.dto';

export class UpdateLoanScheduleItemDto extends PartialType(CreateLoanScheduleItemDto) {}
