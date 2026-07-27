import { Module } from '@nestjs/common';
import { ApplicationDocumentsService } from './application-documents.service';
import { ApplicationDocumentsController } from './application-documents.controller';

@Module({
  controllers: [ApplicationDocumentsController],
  providers: [ApplicationDocumentsService],
})
export class ApplicationDocumentsModule {}
