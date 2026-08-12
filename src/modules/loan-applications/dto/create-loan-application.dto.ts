import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanApplicationApplicantDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede exceder los 150 caracteres' })
  fullName: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MaxLength(30, { message: 'El teléfono no puede exceder los 30 caracteres' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'El documento de identidad es obligatorio' })
  @MaxLength(50, { message: 'El documento de identidad no puede exceder los 50 caracteres' })
  nationalId: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateLoanApplicationItemDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateLoanApplicationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del plan de financiamiento es obligatorio' })
  financingPlanId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoanApplicationItemDto)
  items?: CreateLoanApplicationItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLoanApplicationApplicantDto)
  applicant?: CreateLoanApplicationApplicantDto;
}
