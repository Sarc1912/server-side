import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveLoanDto } from './create-active-loan.dto';

export class UpdateActiveLoanDto extends PartialType(CreateActiveLoanDto) {}
