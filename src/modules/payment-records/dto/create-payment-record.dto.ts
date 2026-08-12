import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePaymentRecordDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del préstamo es obligatorio' })
  loanId: number;

  @IsOptional()
  @IsInt()
  scheduleItemId?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'El monto del pago debe ser mayor a cero' })
  amountPaid: number;

  @IsString()
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @MaxLength(50, { message: 'El método de pago no puede exceder los 50 caracteres' })
  paymentMethod: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'La referencia de la transacción no puede exceder los 100 caracteres' })
  transactionReference?: string;
}
