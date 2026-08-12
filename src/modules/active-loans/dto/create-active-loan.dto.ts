import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LoanStatus } from '../../../entities/ActiveLoan';

export class CreateActiveLoanDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
  applicationId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  userId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El capital no puede ser negativo' })
  principalAmount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El saldo restante no puede ser negativo' })
  remainingBalance: number;

  @IsOptional()
  @IsEnum(LoanStatus, { message: 'El estado del préstamo no es válido' })
  loanStatus?: LoanStatus;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  expectedEndDate?: string;
}
