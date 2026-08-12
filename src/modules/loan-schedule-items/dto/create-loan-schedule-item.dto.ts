import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { InstallmentStatus } from '../../../entities/LoanScheduleItem';

export class CreateLoanScheduleItemDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del préstamo es obligatorio' })
  loanId: number;

  @IsInt()
  @Min(0, { message: 'El número de cuota no puede ser negativo' })
  installmentNumber: number;

  @IsString()
  @IsNotEmpty({ message: 'La fecha de vencimiento es obligatoria' })
  dueDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El monto de la cuota no puede ser negativo' })
  amountDue: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El monto pagado no puede ser negativo' })
  amountPaid?: number;

  @IsOptional()
  @IsEnum(InstallmentStatus, { message: 'El estado de la cuota no es válido' })
  status?: InstallmentStatus;
}
