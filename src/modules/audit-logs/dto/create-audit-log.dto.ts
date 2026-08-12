import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de entidad es obligatorio' })
  @MaxLength(50, { message: 'El tipo de entidad no puede exceder los 50 caracteres' })
  entityType: string;

  @IsInt()
  @IsNotEmpty({ message: 'El ID de la entidad es obligatorio' })
  entityId: number;

  @IsString()
  @IsNotEmpty({ message: 'La acción es obligatoria' })
  @MaxLength(50, { message: 'La acción no puede exceder los 50 caracteres' })
  action: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El actor no puede exceder los 100 caracteres' })
  performedBy?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
