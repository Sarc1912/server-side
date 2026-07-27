import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationDocumentsService } from './application-documents.service';
import { CreateApplicationDocumentDto } from './dto/create-application-document.dto';
import { UpdateApplicationDocumentDto } from './dto/update-application-document.dto';

@Controller('application-documents')
export class ApplicationDocumentsController {
  constructor(private readonly applicationDocumentsService: ApplicationDocumentsService) {}

  @Post()
  create(@Body() createApplicationDocumentDto: CreateApplicationDocumentDto) {
    return this.applicationDocumentsService.create(createApplicationDocumentDto);
  }

  @Get()
  findAll() {
    return this.applicationDocumentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationDocumentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDocumentDto: UpdateApplicationDocumentDto) {
    return this.applicationDocumentsService.update(+id, updateApplicationDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationDocumentsService.remove(+id);
  }
}
