import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDocumentDto } from './create-application-document.dto';

export class UpdateApplicationDocumentDto extends PartialType(CreateApplicationDocumentDto) {}
