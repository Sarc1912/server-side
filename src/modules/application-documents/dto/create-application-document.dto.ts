import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApplicationDocumentDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
  applicationId: number;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  @MaxLength(50, { message: 'El tipo de documento no puede exceder los 50 caracteres' })
  documentType: string;

  @IsString()
  @IsNotEmpty({ message: 'La URL del archivo es obligatoria' })
  fileUrl: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
