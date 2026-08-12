import { Module } from '@nestjs/common';
import { ApplicationDocumentsService } from './application-documents.service';
import { ApplicationDocumentsController } from './application-documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationDocument } from '../../entities/ApplicationDocument';
import { LoanApplication } from '../../entities/LoanApplication';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationDocument, LoanApplication])],
  controllers: [ApplicationDocumentsController],
  providers: [ApplicationDocumentsService],
})
export class ApplicationDocumentsModule {}
