import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDocumentDto } from './dto/create-application-document.dto';
import { UpdateApplicationDocumentDto } from './dto/update-application-document.dto';
import { ApplicationDocument } from '../../entities/ApplicationDocument';
import { LoanApplication } from '../../entities/LoanApplication';

@Injectable()
export class ApplicationDocumentsService {
  constructor(
    @InjectRepository(ApplicationDocument)
    private readonly docRepo: Repository<ApplicationDocument>,
    @InjectRepository(LoanApplication)
    private readonly loanAppRepo: Repository<LoanApplication>,
  ) {}

  async create(createApplicationDocumentDto: CreateApplicationDocumentDto) {
    await this.assertApplicationExists(createApplicationDocumentDto.applicationId);
    const doc = this.docRepo.create(createApplicationDocumentDto);
    return this.docRepo.save(doc);
  }

  async upload(
    fields: { applicationId?: string; documentType?: string; isVerified?: string },
    file?: { filename: string; originalname: string; path: string },
  ) {
    const applicationId = Number(fields.applicationId);
    const documentType = fields.documentType;

    if (!applicationId || !documentType || !file) {
      throw new BadRequestException(
        'Faltan campos obligatorios (applicationId, documentType, archivo)',
      );
    }

    await this.assertApplicationExists(applicationId);

    const doc = this.docRepo.create({
      applicationId,
      documentType,
      fileUrl: `/uploads/${file.filename}`,
      isVerified: fields.isVerified === 'true',
    });
    return this.docRepo.save(doc);
  }

  findAll(): Promise<ApplicationDocument[]> {
    return this.docRepo.find({
      relations: { application: true },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ApplicationDocument> {
    const doc = await this.docRepo.findOne({
      where: { id },
      relations: { application: true },
    });
    if (!doc) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return doc;
  }

  findByApplication(applicationId: number): Promise<ApplicationDocument[]> {
    return this.docRepo.find({
      where: { applicationId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async update(id: number, updateApplicationDocumentDto: UpdateApplicationDocumentDto) {
    const doc = await this.findOne(id);

    if (updateApplicationDocumentDto.applicationId !== undefined) {
      await this.assertApplicationExists(updateApplicationDocumentDto.applicationId);
    }

    this.docRepo.merge(doc, updateApplicationDocumentDto);
    return this.docRepo.save(doc);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.docRepo.delete(id);
  }

  private async assertApplicationExists(applicationId: number) {
    const application = await this.loanAppRepo.findOne({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException(`Solicitud de préstamo con ID ${applicationId} no encontrada`);
    }
  }
}
