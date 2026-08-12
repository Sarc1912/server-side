import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApplicationDocumentsService } from './application-documents.service';
import { CreateApplicationDocumentDto } from './dto/create-application-document.dto';
import { UpdateApplicationDocumentDto } from './dto/update-application-document.dto';
import * as fs from 'fs';
import * as util from 'util';
import { pipeline } from 'stream';
import { join } from 'path';

const pump = util.promisify(pipeline);

@Controller('application-documents')
export class ApplicationDocumentsController {
  constructor(private readonly applicationDocumentsService: ApplicationDocumentsService) {}

  @Post()
  create(@Body() createApplicationDocumentDto: CreateApplicationDocumentDto) {
    return this.applicationDocumentsService.create(createApplicationDocumentDto);
  }

  @Post('upload')
  async upload(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const parts = req.parts();
    const fields: Record<string, any> = {};
    let file: { filename: string; originalname: string; path: string } | undefined;

    for await (const part of parts) {
      if (part.type === 'file') {
        const uploadId = Date.now() + '-' + part.filename;
        const savePath = join(process.cwd(), 'uploads', uploadId);
        await pump(part.file, fs.createWriteStream(savePath));
        file = {
          filename: uploadId,
          originalname: part.filename,
          path: savePath,
        };
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    return this.applicationDocumentsService.upload(fields, file);
  }

  @Get()
  findAll() {
    return this.applicationDocumentsService.findAll();
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.applicationDocumentsService.findByApplication(+applicationId);
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
